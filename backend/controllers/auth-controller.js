import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import sendEmail from "../libs/send-email.js";
import jwt from "jsonwebtoken";
import {
  getVerificationEmailTemplate,
  getPasswordResetTemplate,
  getTwoFACodeTemplate,
} from "../libs/emailTemplates.js";
// 1. Register User
const registerUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a secure random token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Set token expiration (24 hours)
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

    // Create user in database
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpires,
      isEmailVerified: false,
    });

    // Construct the verification URL
    // Note: We use newUser.email to ensure we use the sanitized email from DB
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${newUser.email}`;

    // Send verification email
    await sendEmail({
      to: newUser.email,
      subject: "Verify your TaskHub Account",
      html: getVerificationEmailTemplate(newUser.name, verifyUrl),
    });

    res.status(201).json({
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// 2. Verify Email
const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.body;

    // Validate inputs
    if (!token || !email) {
      return res.status(400).json({ message: "Missing token or email" });
    }

    // Find user with matching email, token, and check if token is not expired
    const user = await User.findOne({
      email,
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    // Activate user and clear token fields
    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    res
      .status(200)
      .json({ message: "Email verified successfully! You can now login." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// 3. Login User (Placeholder)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Email not verified..." });
    }

    if (user.is2FAEnabled) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      const salt = await bcrypt.genSalt(10);
      const hashedOtp = await bcrypt.hash(otpCode, salt);

      user.twoFAOtp = hashedOtp;
      user.twoFAOtpExpires = Date.now() + 10 * 60 * 1000;
      await user.save();

      await sendEmail({
        to: user.email,
        subject: "Your Login Verification Code",
        html: getTwoFACodeTemplate(otpCode),
      });

      return res.status(200).json({
        message: "OTP sent to email",
        twoFactorRequired: true,
        email: user.email,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const verifyTwoFactorAuth = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({
      email,
      twoFAOtpExpires: { $gt: Date.now() },
    }).select("+twoFAOtp +twoFAOtpExpires");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or expired OTP" });
    }

    if (!user.twoFAOtp) {
      return res.status(400).json({ message: "No OTP request found" });
    }

    const isMatch = await bcrypt.compare(otp, user.twoFAOtp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    user.twoFAOtp = undefined;
    user.twoFAOtpExpires = undefined;
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // if user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // if user is not verified
    if (!user.isEmailVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }

    // if a valid reset request already exists
    if (user.resetPasswordToken && user.resetPasswordExpires > Date.now()) {
      return res.status(400).json({
        message:
          "Reset password request already sent. Please check your email.",
      });
    }

    // create JWT token for password reset
    const resetPasswordToken = jwt.sign(
      { userId: user._id, purpose: "reset-password" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // 15 minutes
    );

    // save token and expiration to user
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    // send reset password email
    const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`;

    await sendEmail({
      to: email,
      subject: "Reset your password",
      html: getPasswordResetTemplate(resetPasswordLink),
    });

    res.status(200).json({ message: "Reset password email sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyResetPasswordTokenAndResetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    // if any field is missing
    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // verify JWT token
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // check token purpose
    if (payload.purpose !== "reset-password") {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    // find user
    // if token matches and is not expired
    const user = await User.findOne({
      _id: payload.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // $gt means "greater than"
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    // update user
    user.password = hashPassword;

    // clear used token (for security, so it can't be used again)
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  registerUser,
  loginUser,
  verifyEmail,
  resetPasswordRequest,
  verifyResetPasswordTokenAndResetPassword,
  verifyTwoFactorAuth,
};
