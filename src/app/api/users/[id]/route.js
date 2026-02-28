import connection from "@/lib/connection"; // apna MySQL connection file
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await connection.query(`DELETE FROM users WHERE id = ?`, [id]);

    return NextResponse.json(
      { success: true, message: "Users deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete users." },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    // Auth Check
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Role == 1 can fetch any user, normal users can only fetch themselves
    if (decoded.role !== 1 && decoded.id !== parseInt(id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [rows] = await connection.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove password before sending
    const { password, ...userWithoutPassword } = rows[0];
    return NextResponse.json({ user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user details." },
      { status: 500 }
    );
  }
}