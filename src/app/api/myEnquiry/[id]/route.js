import connection from "@/lib/connection"; // apna MySQL connection file
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {

    const { id } = await context.params; // App Router me query params yaha se milte hain

    // Fetch enquiry
    const [rows] = await connection.execute(
      "SELECT * FROM enquiries WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Enquiry not found" }),
        { status: 404 }
      );
    }

    const enquiry = rows[0];
    const parsedItems = enquiry.cartItems ? JSON.parse(enquiry.cartItems) : [];

    let currentStatus = "pending";
    if (parsedItems.length > 0 && parsedItems[0].status) {
      currentStatus = parsedItems[0].status;
    }

    return new Response(
      JSON.stringify({
        ...enquiry,
        cartItems: parsedItems,
        status: currentStatus,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }

}


export async function PUT(req, { params }) {
  try {
    const { id } = await params; // route params
    const { status } = await req.json();

    // Fetch existing
    const [rows] = await connection.query("SELECT * FROM enquiries WHERE id = ?", [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    const enquiry = rows[0];
    let cartItems = [];
    try {
      cartItems = typeof enquiry.cartItems === 'string' ? JSON.parse(enquiry.cartItems) : (enquiry.cartItems || []);
    } catch (e) {
      console.error("Parse error", e);
    }

    // Update status for all items in the enquiry
    const updatedItems = cartItems.map(item => ({ ...item, status }));

    // Update query
    const [result] = await connection.query(
      "UPDATE enquiries SET cartItems = ? WHERE id = ?",
      [JSON.stringify(updatedItems), id]
    );

    // Get updated row and add a top-level status for frontend convenience
    const [updatedRows] = await connection.query("SELECT * FROM enquiries WHERE id = ?", [id]);
    const updatedEnquiry = updatedRows[0];
    updatedEnquiry.status = status;

    return NextResponse.json(updatedEnquiry, { status: 200 });
  } catch (error) {
    console.error("Error updating enquiry:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await connection.query(`DELETE FROM enquiries WHERE id = ?`, [id]);

    return NextResponse.json(
      { success: true, message: "Product enquiry deleted successfully!" },
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


