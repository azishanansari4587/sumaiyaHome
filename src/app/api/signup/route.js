import { NextResponse } from "next/server";
import connection from "@/lib/connection";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

// Generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via Email
async function sendOTPEmail(email, firstName, otp) {
  const emailAddress = process.env.EMAIL_ADDRESS;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailAddress || !emailPassword) {
    console.warn("EMAIL credentials missing. Cannot send OTP email.");
    return false;
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

  await transporter.sendMail({
    from: `"Sumaiya Home" <${emailAddress}>`,
    to: email,
    subject: "Your Email Verification Code - Sumaiya Home",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #f9f9f9; border-radius: 10px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1e3a8a, #2563eb); padding: 30px 24px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px;">Sumaiya Home</h2>
          <p style="color: #bfdbfe; margin: 6px 0 0;">Email Verification</p>
        </div>
        <div style="padding: 32px 24px; background: #ffffff;">
          <h3 style="color: #1e293b; margin-top: 0;">Hello ${firstName}! 👋</h3>
          <p style="color: #475569; line-height: 1.6;">
            Thank you for registering at <strong>Sumaiya Home</strong>. 
            Please use the verification code below to complete your registration:
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <div style="display: inline-block; background: #f1f5f9; border: 2px dashed #2563eb; border-radius: 12px; padding: 16px 36px;">
              <span style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #1e3a8a; font-family: 'Courier New', monospace;">${otp}</span>
            </div>
          </div>
          <p style="color: #64748b; font-size: 13px; text-align: center;">
            ⏱️ This code is valid for <strong>10 minutes</strong> only.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            If you didn't create an account with Sumaiya Home, please ignore this email.
          </p>
        </div>
      </div>
    `,
  });

  return true;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Step 1: Check if user already exists
    const [existing] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);

    // Generate OTP and expiry (using existing DB columns: verification_token & reset_token_expiry)
    const otp = generateOTP();
    // Store OTP as "OTP:123456" prefix so we can differentiate from old link tokens
    const otpToken = `OTP:${otp}`;
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    if (existing.length > 0) {
      const user = existing[0];
      // If user exists but is not verified, allow resending OTP
      if (user.is_verified === 0) {
        await connection.execute(
          "UPDATE users SET verification_token = ?, reset_token_expiry = ? WHERE email = ?",
          [otpToken, otpExpires, email]
        );

        try {
          await sendOTPEmail(email, firstName, otp);
        } catch (emailErr) {
          console.error("Failed to resend OTP:", emailErr);
          return NextResponse.json({ error: "Failed to send OTP email. Please try again later." }, { status: 500 });
        }

        return NextResponse.json({
          message: "Account already exists but not verified. A new OTP has been sent to your email.",
          pending_verification: true,
          email,
        }, { status: 200 });
      }
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Step 2: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3: Insert new user (unverified, with OTP stored in verification_token)
    await connection.execute(
      "INSERT INTO users (first_name, last_name, email, password, contact, is_verified, verification_token, reset_token_expiry) VALUES (?, ?, ?, ?, ?, 0, ?, ?)",
      [firstName, lastName, email, hashedPassword, phone, otpToken, otpExpires]
    );

    // Step 4: Send OTP email
    try {
      await sendOTPEmail(email, firstName, otp);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      return NextResponse.json({
        error: "Registered but failed to send OTP email. Please contact support.",
        pending_verification: true,
        email,
      }, { status: 500 });
    }

    return NextResponse.json({
      message: "OTP sent to your email. Please verify to complete registration.",
      pending_verification: true,
      email,
    }, { status: 201 });

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
