import { NextResponse } from "next/server";
import connection from "@/lib/connection";
import { verifyToken } from "@/lib/verifyToken";

export async function GET(req) {
  try {
    const auth = verifyToken(req);
    if (auth.error) return auth.error;
    const { decoded } = auth;

    const [rows] = await connection.execute(
      `SELECT p.id, p.name, p.images, p.inStock, p.slug, w.color, w.image
       FROM wishlist w
       JOIN product p ON w.productId = p.id
       WHERE w.userId = ?`,
      [decoded.id]
    );

    const items = rows.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.image,
      inStock: !!product.inStock
    }));

    return NextResponse.json({ wishlistItems: items }, { status: 200 });

  } catch (error) {
    console.error("Get Wishlist Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
