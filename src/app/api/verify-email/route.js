import { NextResponse } from "next/server";
import connection from "@/lib/connection";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

        if (!token) {
            return NextResponse.json({ error: "Verification token is missing" }, { status: 400 });
        }

        // Step 1: Find user with this token
        const [users] = await connection.execute(
            "SELECT id FROM users WHERE verification_token = ?",
            [token]
        );

        if (users.length === 0) {
            return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 });
        }

        const userId = users[0].id;

        // Step 2: Mark user as verified and clear the token
        await connection.execute(
            "UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?",
            [userId]
        );

        // Step 3: Redirect to login page with success message
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        return NextResponse.redirect(`${baseUrl}/signin?verified=true`);
    } catch (error) {
        console.error("Email Verification Error:", error);
        return NextResponse.json({ error: "Something went wrong during verification" }, { status: 500 });
    }
}
