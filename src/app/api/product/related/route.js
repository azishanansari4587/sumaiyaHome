import { NextResponse } from "next/server";
import connection from "@/lib/connection";

export async function GET(req, { params }) {
  const {  } = await params;

  try {
    // Step 1: Get current product to extract its collectionId
    const [productRows] = await connection.execute(
      "SELECT collectionId FROM product WHERE id = ?",
      [productId]
    );

    if (productRows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const { collectionId } = productRows[0];

    // Step 2: Get related products with same collectionId but different id
    const [relatedProducts] = await connection.execute(
      "SELECT * FROM product WHERE collectionId = ? AND id != ?",
      [collectionId, productId]
    );

    return NextResponse.json({ relatedProducts });
  } catch (error) {
    console.error("Related Product Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
