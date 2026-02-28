// app/api/becomePartner/route.js
import { NextResponse } from "next/server";
import connection from "@/lib/connection"; // Make sure this connects to your MySQL DB

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      companyName,
      contactName,
      email,
      phone,
      website,
      businessType,
      message,
      termsAccepted,
    } = body;

    if (
      !companyName ||
      !contactName ||
      !email ||
      !phone ||
      !businessType ||
      !message ||
      !termsAccepted
    ) {
      return NextResponse.json(
        { message: "All required fields must be filled." },
        { status: 400 }
      );
    }

    const [result] = await connection.execute(
      `
      INSERT INTO partner_applications (
        companyName, contactName, email, phone, website,
        businessType, message, termsAccepted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        companyName,
        contactName,
        email,
        phone,
        website,
        businessType,
        message,
        termsAccepted ? 1 : 0,
      ]
    );

    return NextResponse.json(
      { message: "Application submitted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving partner application:", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const [messages] = await connection.query(
      `SELECT *
       FROM partner_applications
       ORDER BY createdAt DESC`
    );

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("MySQL Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}



