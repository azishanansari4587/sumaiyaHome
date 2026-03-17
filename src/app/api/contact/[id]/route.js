import connection from "@/lib/connection";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, phone, subject, message, status } = body;

    // Update query
    const [result] = await connection.query(
      "UPDATE contact_messages SET name=?, email=?, phone=?, subject=?, message=?, status=? WHERE id=?",
      [name, email, phone, subject, message, status, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Contact Message not found" }, { status: 404 });
    }

    // Get updated row
    const [rows] = await connection.query("SELECT * FROM contact_messages WHERE id = ?", [id]);

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error updating contact message:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await connection.query(`DELETE FROM contact_messages WHERE id = ?`, [id]);

    return NextResponse.json(
      { success: true, message: "Contact Message deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting contact message:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete contact message." },
      { status: 500 }
    );
  }
}