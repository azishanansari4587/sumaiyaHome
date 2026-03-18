
import { NextResponse } from "next/server";
import connection from "@/lib/connection";
import { verifyToken } from "@/lib/verifyToken";

export async function POST(req) {
  try {
    const auth = verifyToken(req);
    if (auth.error) return auth.error;
    const { decoded } = auth;

    const body = await req.json();
    const { productId, quantity, color, size, image } = body;

    // Check if the same product with same color and size is already in cart
    const [existing] = await connection.execute(
      "SELECT * FROM cart WHERE userId = ? AND productId = ? AND color = ? AND size = ?",
      [decoded.id, productId, color, size]
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: "This item is already in the cart" }, { status: 409 });
    }

    // Insert if not exists
    await connection.execute(
      "INSERT INTO cart (userId, productId, quantity, color, size, image) VALUES (?, ?, ?, ?, ?, ?)",
      [decoded.id, productId, quantity, color, size, image]
    );

    return NextResponse.json({ message: "Added to cart successfully" });

  } catch (error) {
    console.error("Cart Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}



export async function GET(req) {
  try {
    const auth = verifyToken(req);
    if (auth.error) return auth.error;
    const { decoded } = auth;

    const [rows] = await connection.execute(`
      SELECT 
        c.id AS cartId,
        c.productId,
        c.quantity,
        c.size,
        c.color,
        c.image,
        p.name
      FROM cart c
      JOIN product p ON c.productId = p.id
      WHERE c.userId = ?
    `, [decoded.id]);

    return NextResponse.json({ cartItems: rows });

  } catch (error) {
    console.error("Get Cart Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
