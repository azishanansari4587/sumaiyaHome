import connection from "@/lib/connection";
import { NextResponse } from "next/server";

// ✅ PUT -> Edit Banner (name + imageUrl)
export async function PUT(req, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Banner ID is required" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { name, imageUrl } = body;

    if (!name && !imageUrl) {
      return NextResponse.json({ error: "At least name or imageUrl is required" }, { status: 400 });
    }

    // Ensure name column exists
    try {
      await connection.execute(
        "ALTER TABLE banners ADD COLUMN IF NOT EXISTS name VARCHAR(255) NULL"
      );
    } catch (_) {}

    const [result] = await connection.execute(
      "UPDATE banners SET name = COALESCE(?, name), imageUrl = COALESCE(?, imageUrl) WHERE id = ?",
      [name || null, imageUrl || null, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Banner updated successfully" }, { status: 200 });
  } catch (err) {
    console.error("Edit banner error:", err);
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}

// ✅ DELETE -> Delete Banner
export async function DELETE(req, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Banner ID is required" }, { status: 400 });
  }

  try {
    const [result] = await connection.execute(
      "DELETE FROM banners WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Banner deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}