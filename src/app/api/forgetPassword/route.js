import { NextResponse } from "next/server";
import connection from "@/lib/connection";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Step 1: Check if user exists
    const [users] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return NextResponse.json({ error: "No user found with this email" }, { status: 404 });
    }

    const user = users[0];

    // Step 2: Generate token
    const token = crypto.randomBytes(32).toString("hex");
    
    // Token valid for 1 hour from now
    const tokenExpire = new Date(Date.now() + 60 * 60 * 1000); 

    // Formatting date to MySQL standard 'YYYY-MM-DD HH:MM:SS'
    const formattedDate = tokenExpire.toISOString().slice(0, 19).replace('T', ' ');

    // Step 3: Store token in DB
    await connection.execute(
      "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?",
      [token, formattedDate, user.id]
    );

    // Step 4: Send email with reset link
    const emailAddress = process.env.EMAIL_ADDRESS;
    const emailPassword = process.env.EMAIL_PASSWORD;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    
    if (!emailAddress || !emailPassword) {
      console.warn("EMAIL credentials missing. Cannot send reset email.");
      return NextResponse.json({ error: "Email server configuration is missing on the backend." }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: emailAddress,
        pass: emailPassword,
      },
    });

    const resetLink = `${baseUrl}/resetPassword?token=${token}`;

    await transporter.sendMail({
      from: `"Sumaiya Home" <${emailAddress}>`,
      to: email,
      subject: "Password Reset Request - Sumaiya Home",
      html: `
        <h3>Hello ${user.first_name || 'User'},</h3>
        <p>You requested a password reset for your Sumaiya Home account.</p>
        <p>Click the link below to securely reset your password:</p>
        <a href="${resetLink}" style="display:inline-block;padding:10px 20px;background-color:#1e3a8a;color:#ffffff;text-decoration:none;border-radius:5px;">Reset Password</a>
        <br>
        <br>
        <p>Or copy this link into your browser: <br/>${resetLink}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
      `,
    });

    return NextResponse.json({ message: "Password reset link has been sent to your email" });

  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json({ error: "Failed to send password reset email. Please try again later." }, { status: 500 });
  }
}
