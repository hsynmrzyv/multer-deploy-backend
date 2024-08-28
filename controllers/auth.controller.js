import bcrypt from "bcryptjs";

// User model
import User from "../models/user.model.js";

// Utils
import { generateTokenAndSetCookie } from "../generateTokenAndSetCookie.js";


export const signIn = async (request, response) => {
  const { email, password } = request.body;

  // Check for empty values
  if (!email || !password) {
    return response
      .status(400)
      .json({ message: "Email and password are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return response
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = generateTokenAndSetCookie(user._id, response);

    // Send back the user info (excluding password) and the token
    response.status(200).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userName: user.userName,
        profilePic: user.profilePic,
      },
      token,

      message: "Sign in successful",
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Server error" });
  }
};

export const signUp = async (request, response) => {
  const { firstName, lastName, email, password, userName } = request.body;

  // Check for empty values
  if (!firstName || !lastName || !email || !password || !userName) {
    return response.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if a user already exists with the provided email or userName
    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });
    if (existingUser) {
      return response
        .status(400)
        .json({ message: "User with this email or username already exists" });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      userName,
      password: hashedPassword,
    });

    // Generate JWT
    generateTokenAndSetCookie(newUser._id, response);

    // Send back the user (excluding the password)
    response.status(201).json({
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        userName: newUser.userName,
        profilePic: newUser.profilePic,
      },
      message: "User successfully created",
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Server error" });
  }
};

export const logout = (request, response) => {
  // Clear the JWT cookie
  response.cookie("jwt", "", {
    maxAge: 0,
  });

  response.status(200).json({ message: "Logged out successfully" });
};

export const update = async (request, response) => {
  const { id } = request;

  if (!id) {
    response.status(401).send({ message: "User id is required" });
    return;
  }

  const user = await User.findById(id);

  if (!user) {
    response.status(404).send({ message: "User not found" });
    return;
  }

  Object.assign(user, request.body);

  if (request.file) {
    user.profilePic = request.file.path;
  }

  await user.save();

  response.status(200).json({
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName,
      profilePic: user.profilePic,
    },
    message: "User successfully updated",
  });
};
