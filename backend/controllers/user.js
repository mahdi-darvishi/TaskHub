import User from "../models/user.js";
import bcrypt from "bcrypt";

// Get User Profile

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password"); // Exclude password from the result

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, profilePicture } = req.body;

    // Find user and update
    // { new: true } returns the updated document instead of the old one
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        profilePicture,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // 1. Basic Validation
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    // 2. Find the user (Include password field explicitly if it's excluded by default in schema)
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // 4. Check if new password is same as old (Optional but good practice)
    if (await bcrypt.compare(newPassword, user.password)) {
      return res.status(400).json({
        message: "New password cannot be the same as the old password",
      });
    }

    // 5. Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 6. Update and save
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const toggleTwoFactorAuth = async (req, res) => {
  try {
    const userId = req.user._id;
    const { isEnabled, password } = req.body;

    const user = await User.findById(userId).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    user.is2FAEnabled = isEnabled;

    if (!isEnabled) {
      user.twoFAOtp = undefined;
      user.twoFAOtpExpires = undefined;
    }

    await user.save();

    res.status(200).json({
      message: `Two-Factor Authentication ${
        isEnabled ? "enabled" : "disabled"
      } successfully`,
      is2FAEnabled: user.is2FAEnabled,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export {
  getUserProfile,
  updateUserProfile,
  changePassword,
  toggleTwoFactorAuth,
};
