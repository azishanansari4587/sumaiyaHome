import { NextResponse } from "next/server";
import connection from "@/lib/connection";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    // Find user with this email
    const [users] = await connection.execute(
      "SELECT id, verification_token, reset_token_expiry, is_verified FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: "No account found with this email" }, { status: 404 });
    }

    const user = users[0];

    // Check if already verified
    if (user.is_verified === 1) {
      return NextResponse.json({ error: "Account is already verified. Please sign in." }, { status: 400 });
    }

    // Check that token starts with "OTP:" prefix (our OTP format)
    const storedToken = user.verification_token || "";
    if (!storedToken.startsWith("OTP:")) {
      return NextResponse.json({ error: "No OTP found for this account. Please sign up again." }, { status: 400 });
    }

    const storedOtp = storedToken.replace("OTP:", "");

    // Check OTP match
    if (storedOtp !== otp.trim()) {
      return NextResponse.json({ error: "Invalid OTP. Please check your email and try again." }, { status: 400 });
    }

    // Check OTP expiry
    const now = new Date();
    const expiresAt = new Date(user.reset_token_expiry);
    if (now > expiresAt) {
      return NextResponse.json({ error: "OTP has expired. Please sign up again to get a new code." }, { status: 400 });
    }

    // Mark user as verified, clear OTP
    await connection.execute(
      "UPDATE users SET is_verified = 1, verification_token = NULL, reset_token_expiry = NULL WHERE id = ?",
      [user.id]
    );

    return NextResponse.json({
      message: "Email verified successfully! You can now sign in.",
      verified: true,
    }, { status: 200 });

  } catch (error) {
    console.error("OTP Verification Error:", error);
    return NextResponse.json({ error: "Something went wrong during verification" }, { status: 500 });
  }
}
