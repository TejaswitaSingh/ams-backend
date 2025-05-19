import { verifyToken } from "../utils/Token.js"; // Add .js if you're using ES modules

export default function adminAuth(req, res, next){
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Access token missing", status: 0 });
  }

  const token = authHeader.split(" ")[1]; // Remove "Bearer " prefix

  try {
    const decoded = verifyToken(token);
    req.admin = decoded; // Attach admin data to the request
    next();
  } catch (err) {
    return res.status(403).json({ msg: "Invalid or expired token", status: 0 });
  }
};


