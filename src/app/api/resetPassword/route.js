import { NextResponse } from "next/server";
import connection from "@/lib/connection";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    // Checking if token is valid and not expired
    const [users] = await connection.execute(
      "SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()",
      [token]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    const user = users[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and invalidate the token
    await connection.execute(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );

    return NextResponse.json({ message: "Password successfully updated" });

  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Server error while resetting password" }, { status: 500 });
  }
}
