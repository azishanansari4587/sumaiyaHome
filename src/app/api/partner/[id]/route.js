import { NextResponse } from "next/server";
import connection from "@/lib/connection"; // Make sure this connects to your MySQL DB


// PUT METHOD

export async function PUT(req, { params }) {
  const {  } = await params;
  const { Status } = await req.json();

  // Update in DB (MySQL example)
  await connection.execute("UPDATE partner_applications SET Status = ? WHERE id = ?", [Status, id]);

  return new Response(JSON.stringify({ message: "Status updated" }), {
    status: 200,
  });
}

export async function DELETE(req, { params }) {
  try {
    const {  } = await params;

    await connection.query(`DELETE FROM partner_applications WHERE id = ?`, [id]);

    return NextResponse.json(
      { success: true, message: "Partner Application deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete enquiry." },
      { status: 500 }
    );
  }
}