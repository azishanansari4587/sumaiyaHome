// /app/api/reset-password/route.js

import { NextResponse } from "next/server";
import connection from "@/lib/connection";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { token, newPassword } = await req.json();

  if (!token || !newPassword) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    // Step 1: Find user by token
    const [users] = await connection.execute(
      "SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()",
      [token]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Step 2: Update password and remove token
    await connection.execute(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
      [hashedPassword, users[0].id]
    );

    return NextResponse.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
