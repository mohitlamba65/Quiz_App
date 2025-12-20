import jwt from "jsonwebtoken";
import { UserModel } from "../models/user-schema.js";

// Generate JWT token
const generateToken = (userId, role, username) => {
    return jwt.sign(
        { userId, role, username },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Signup
export const signup = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User with this email or username already exists"
            });
        }

        // Create new user
        const user = await UserModel.create({
            username,
            email,
            password,
            role: role || 'student'
        });

        // Generate token
        const token = generateToken(user._id, user.role, user.username);

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = generateToken(user._id, user.role, user.username);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Guest login
export const guestLogin = async (req, res) => {
    try {
        const guestId = `guest_${Date.now()}`;
        const guestUsername = `Guest_${Math.random().toString(36).substring(7)}`;

        // Generate temporary token for guest
        const token = jwt.sign(
            {
                userId: guestId,
                role: 'guest',
                username: guestUsername,
                isGuest: true
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Guest session created",
            token,
            user: {
                id: guestId,
                username: guestUsername,
                role: 'guest',
                isGuest: true
            }
        });
    } catch (error) {
        console.error("Guest login error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get current user
export const getCurrentUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ message: error.message });
    }
};
