import { NextResponse } from "next/server";
import connection from "@/lib/connection";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Step 1: Check if user already exists
    const [existing] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Step 2: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Split name into first and last name
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    // Generate a secure verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Step 3: Insert new user (unverified by default)
    await connection.execute(
      "INSERT INTO users (first_name, last_name, email, password, contact, is_verified, verification_token) VALUES (?, ?, ?, ?, ?, 0, ?)",
      [firstName, lastName, email, hashedPassword, phone, verificationToken]
    );

    // Step 4: Send verification email
    const emailAddress = process.env.EMAIL_ADDRESS;
    const emailPassword = process.env.EMAIL_PASSWORD;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const verifyUrl = `${baseUrl}/verify-email?token=${verificationToken}`;

    if (emailAddress && emailPassword) {
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: emailAddress,
            pass: emailPassword,
          },
        });

        await transporter.sendMail({
          from: `"Sumaiya Home" <${emailAddress}>`,
          to: email, // send to the registering user
          subject: "Verify your email - Sumaiya Home",
          html: `
            <h3>Hello ${firstName},</h3>
            <p>Thank you for registering at Sumaiya Home!</p>
            <p>Please click the link below to verify your email address and activate your account:</p>
            <a href="${verifyUrl}" style="display:inline-block;padding:10px 20px;background-color:#1e3a8a;color:#ffffff;text-decoration:none;border-radius:5px;">Verify Email</a>
            <br>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p>${verifyUrl}</p>
            <p>This verification link will expire in 24 hours.</p>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
        // Continue and tell the user there was an error with email but registration succeeded
        return NextResponse.json({ message: "Registered, but failed to send verification email.", pending_verification: true }, { status: 201 });
      }
    } else {
      console.warn("EMAIL credentials missing. Cannot send verification email.");
    }

    return NextResponse.json({ message: "User registered successfully. Please check your email to verify your account.", pending_verification: true }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
