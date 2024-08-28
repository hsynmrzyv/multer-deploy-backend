import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (id, response) => {
  // Generate the JWT
  const token = jwt.sign({ id }, process.env.JWT_SECRET);

  // Set the JWT as a cookie
  response.cookie("jwt", token);

  return token;
};
