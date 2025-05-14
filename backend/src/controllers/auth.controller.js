import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/Users.js"
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    // Validation checks (unchanged)
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    if (req.body.profilePic && req.body.profilePic.length > 10 * 1024 * 1024) {
      return res.status(413).json({ message: 'Image too large' });
    }
    // Fixed avatar generation - more reliable source
    const avatarIdx = Math.floor(Math.random() * 100);
    const defaultAvatar = `https://avatar.iran.liara.run/public/${avatarIdx}.png`;

    const newUser = await User.create({
      email,
      fullName,
      password, // Make sure you're hashing this in pre-save hook!
      profilePic: defaultAvatar,
    });

    // Stream integration (unchanged)
    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: defaultAvatar, // Use the same avatar here
      });
    } catch (error) {
      console.error("Stream error:", error);
    }

    // JWT and response (unchanged)
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // Return user data without sensitive info
    const userResponse = {
      _id: newUser._id,
      email: newUser.email,
      fullName: newUser.fullName,
      profilePic: newUser.profilePic
    };

    res.status(201).json({ success: true, user: userResponse });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

    try {
      await upsertStreamUser({
        id: user._id,
        name: user.fullName,
        image: user.profilePic || "",
      });
      console.log("Stream User is Created");
    } catch (error) {
      console.log("error in creating stream User", error);
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks,
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout successful" });
}

export async function onaboard(req, res) {
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

    let profilePic = req.user.profilePic; // Default to existing

    if (req.file) {
      profilePic = `/uploads/${req.file.filename}`; // Or your preferred path
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        bio,
        nativeLanguage,
        learningLanguage,
        location,
        profilePic,
        isOnboarded: true
      },
      { new: true }
    );

    // Update Stream chat user with ALL current information
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic // Make sure this is the full URL if stored as relative path
      });
      console.log("Stream user updated successfully");
    } catch (streamError) {
      console.error("Stream update error:", streamError);
      // Don't fail the whole request, just log the error
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error in Onboarding", error);
    res.status(500).json({ message: "Internal server Error" });
  }
}