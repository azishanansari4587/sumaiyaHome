import { NextResponse } from "next/server";
import  connection  from "@/lib/connection";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;


    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "Required fields are missing" },
        { status: 400 }
      );
    }

    const [result] = await connection.query(
      `INSERT INTO contact_messages (name, email, phone, subject, message)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone || null, subject, message]
    );

    return NextResponse.json({
      success: true,
      message: "Your message has been stored successfully!",
    });
    
  } catch (error) {
    console.error("MySQL Insert Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}



export async function GET() {
  try {
    const [messages] = await connection.query(
      `SELECT *
       FROM contact_messages
       ORDER BY created_at DESC`
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

