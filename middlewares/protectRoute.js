import jwt from "jsonwebtoken";

export const protectRoute = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    req.id = id;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};
