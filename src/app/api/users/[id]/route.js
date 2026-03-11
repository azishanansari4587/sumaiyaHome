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
    if (String(decoded.role) !== "1" && String(decoded.id) !== String(id)) {
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

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Ensure the ID is valid and the user is authenticated
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

    if (String(decoded.role) !== "1" && String(decoded.id) !== String(id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { first_name, last_name, name, contact, address, city, state, businessType } = body;
    
    // Fallback to split full name if first/last aren't explicitly provided but name is
    let fName = first_name;
    let lName = last_name;
    if (name && (!first_name && !last_name)) {
        const parts = name.split(" ");
        fName = parts[0] || "";
        lName = parts.slice(1).join(" ") || "";
    }

    await connection.query(
      `UPDATE users SET 
        first_name = ?, 
        last_name = ?, 
        contact = COALESCE(?, contact), 
        address = COALESCE(?, address), 
        city = COALESCE(?, city), 
        state = COALESCE(?, state), 
        business_type = COALESCE(?, business_type)
      WHERE id = ?`,
      [fName || null, lName || null, contact || null, address || null, city || null, state || null, businessType || null, id]
    );

    return NextResponse.json({ success: true, message: "Profile updated successfully!" }, { status: 200 });

  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    );
  }
}