import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import sendEmail from "../libs/send-email.js";
import jwt from "jsonwebtoken";
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
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello, ${newUser.name}!</h2>
          <p>Thank you for registering at TaskHub. Please verify your email to activate your account.</p>
          <a href="${verifyUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
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

    // 1. Find user and select password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2. Verify password first (Security Best Practice)
    // This prevents attackers from spamming emails to unverified users
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Check if email is verified
    if (!user.isEmailVerified) {
      // Check if the previous token is still valid (e.g., not expired)
      if (
        user.verificationToken &&
        user.verificationTokenExpires > Date.now()
      ) {
        return res.status(403).json({
          message:
            "Email not verified. Please check your email for the verification link we already sent.",
        });
      }

      // If token is expired or missing, generate a new one
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      // Update user with new token
      user.verificationToken = verificationToken;
      user.verificationTokenExpires = verificationTokenExpires;
      await user.save();

      // Construct verification URL
      const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${user.email}`;

      // Resend verification email
      await sendEmail({
        to: user.email,
        subject: "Verify your TaskHub Account (New Link)",
        html: `
           <p>Your previous link expired. Please click below to verify:</p>
           <a href="${verifyUrl}">Verify Email</a>
        `,
      });

      return res.status(403).json({
        message:
          "Email not verified. A new verification link has been sent to your email.",
      });
    }

    // 4. Generate Login Token (JWT)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Prepare user data for response (exclude password)
    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
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
      html: `<p>Click <a href="${resetPasswordLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
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
};
