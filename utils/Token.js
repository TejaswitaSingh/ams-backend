import jwt from "jsonwebtoken";

// Function to generate a JWT token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1m", // Token expires in 7 days
    });
};

// Function to verify a JWT token
const verifyToken = (token) => {
    try {
        // Verifies the token and decodes it
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;  // Return decoded user data
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};

export { generateToken, verifyToken };