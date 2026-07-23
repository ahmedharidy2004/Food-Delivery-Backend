import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "dev-secret";

export const signToken = (id) => {
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, secret);
};
