import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

/**
 * Verifies the JWT token from the Authorization header.
 * Returns { decoded } on success.
 * Returns { error: NextResponse } on failure (call `return result.error` immediately).
 *
 * Usage:
 *   const result = verifyToken(req);
 *   if (result.error) return result.error;
 *   const { decoded } = result;
 */
export function verifyToken(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { decoded };
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return {
        error: NextResponse.json(
          { error: "Session expired. Please log in again." },
          { status: 401 }
        ),
      };
    }
    // Invalid token (tampered, wrong secret, etc.)
    return {
      error: NextResponse.json(
        { error: "Invalid token. Please log in again." },
        { status: 401 }
      ),
    };
  }
}
