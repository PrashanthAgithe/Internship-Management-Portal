const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey"; // keep in .env

// Signup function
const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        // Create JWT token
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Exclude password from response
        const userData = newUser.toObject();
        delete userData.password;

        res.status(201).json({
            message: 'User registered successfully',
            user: userData,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Signin function
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Exclude password from response
        const userData = user.toObject();
        delete userData.password;

        res.status(200).json({
            message: 'User signed in successfully',
            user: userData,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error signing in', error: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.user.id; // added from JWT middleware

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
};

const uploadDocuments = async (req, res) => {
    try {
        const userId = req.user.id;
        const { documents } = req.body;

        if (!documents) {
            return res.status(400).json({ message: "No documents provided" });
        }

        // Find student
        const student = await User.findById(userId);
        if (!student || student.role !== "student") {
            return res.status(403).json({ message: "Only students can upload documents" });
        }

        // Update only provided documents
        Object.keys(documents).forEach((docType) => {
            if (student.documents[docType]) {
                student.documents[docType].url = documents[docType];
                student.documents[docType].status = "pending";   // reset status on re-upload
            }
        });

        await student.save();

        res.status(200).json({
            message: "Documents uploaded successfully",
            user: student,
        });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({
            message: "Error saving documents",
            error: error.message,
        });
    }
};


const getAllStudents = async (req, res) => {
    try {
        // Fetch only users with role = "student"
        const students = await User.find({ role: "student" })
            .select("-password"); // hide password

        res.status(200).json({
            message: "Students fetched successfully",
            students,
        });
    } catch (error) {
        console.error("Fetch Students Error:", error);
        res.status(500).json({
            message: "Error fetching students",
            error: error.message,
        });
    }
};

const updateDocumentStatus = async (req, res) => {
    try {
        const { studentId, docType } = req.params;
        const { status, comment } = req.body;

        // Validate status
        if (!["pending", "approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Validate docType
        const validDocs = ["offerLetter", "noc", "certificate"];
        if (!validDocs.includes(docType)) {
            return res.status(400).json({ message: "Invalid document type" });
        }

        // Fetch the student
        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        if (student.role !== "student") {
            return res.status(400).json({ message: "Cannot approve teacher accounts" });
        }

        // Update the selected document status
        student.documents[docType].status = status;

        if (comment) {
            student.documents[docType].comment = comment;
        }

        await student.save();

        res.status(200).json({
            message: `Updated status of ${docType} to ${status}`,
            student,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating document status",
            error: error.message,
        });
    }
};




module.exports = { signup, signin, getUser, uploadDocuments, getAllStudents, updateDocumentStatus };
