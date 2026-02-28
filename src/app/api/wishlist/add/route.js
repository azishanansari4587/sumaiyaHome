import { NextResponse } from "next/server";
import connection from "@/lib/connection";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, productId, image, color } = body;

    if (!userId || !productId) {
      return NextResponse.json({ error: "userId and productId required" }, { status: 400 });
    }

    // Check if item already exists in wishlist
    const [existing] = await connection.execute(
      "SELECT * FROM wishlist WHERE userId = ? AND productId = ?",
      [userId, productId]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Product is already in your wishlist" },
        { status: 409 }
      );
    }

    // Insert new item
    await connection.execute(
      "INSERT INTO wishlist (userId, productId, image, color) VALUES (?, ?, ?, ?)",
      [userId, productId, image || "", color || ""]
    );

    return NextResponse.json({ message: "Added to wishlist" }, { status: 200 });
  } catch (error) {
    console.error("Wishlist Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
