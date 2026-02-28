// /app/api/forgot-password/route.js

import { NextResponse } from "next/server";
import connection from "@/lib/connection";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    // Step 1: Check if user exists
    const [users] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return NextResponse.json({ error: "No user found with this email" }, { status: 404 });
    }

    const user = users[0];

    // Step 2: Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Step 3: Store token in DB (create new column if not already)
    await connection.execute(
      "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?",
      [token, tokenExpire, user.id]
    );

    // Step 4: Send email with reset link
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com",
        pass: "your-app-password", // use app password for Gmail
      },
    });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await transporter.sendMail({
      from: "your-email@gmail.com",
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 1 hour.</p>`,
    });

    return NextResponse.json({ message: "Reset link sent to email" });

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
