import connection from "@/lib/connection";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { slug } = await context.params; // ✅ params awaited

  if (!slug) {
    return NextResponse.json({ error: "Product Slug is required" }, { status: 400 });
  }

  try {
    // Find current product
    const [rows] = await connection.query(
      "SELECT * FROM product WHERE slug = ?",
      [slug]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = rows[0];
    let tags = [];
    try {
      tags = JSON.parse(product.tags || '[]');
      if (!Array.isArray(tags)) tags = [tags];
    } catch (e) {
      tags = typeof product.tags === 'string' ? product.tags.split(',').map(t => t.trim()) : [];
    }
    let relatedProductRows = [];

    // Find related products (same tags OR same collection, different slug)
    if (tags.length > 0) {
      // Tags might be JSON arrays or comma separated strings in the DB
      // We will use LIKE to confidently match tags regardless of the format
      const likeConditions = tags.map(() => `tags LIKE ?`).join(' OR ');
      const queryParams = [slug, ...tags.map(t => `%${t}%`), product.collectionId];

      const query = `
        SELECT * FROM product
        WHERE slug != ? AND (${likeConditions} OR collectionId = ?)
        ORDER BY id DESC
        LIMIT 6
      `;

      const [rows] = await connection.execute(query, queryParams);
      relatedProductRows = rows;
    } else {
      // Fallback: If no tags, just use collectionId
      const [rows] = await connection.execute(
        "SELECT * FROM product WHERE collectionId = ? AND slug != ? ORDER BY id DESC LIMIT 6",
        [product.collectionId, slug]
      );
      relatedProductRows = rows;
    }

    if (relatedProductRows.length === 0) {
      return NextResponse.json({ message: "No related products found" }, { status: 404 });
    }

    const formattedProduct = relatedProductRows.map((product) => ({
      ...product,
      colors: JSON.parse(product.colors || '[]'),
      sizes: JSON.parse(product.sizes || '[]'),
      features: JSON.parse(product.features || '[]'),
      specifications: JSON.parse(product.specifications || '[]'),
      images: JSON.parse(product.images || '[]'),
    }));

    return NextResponse.json(
      { relatedProducts: formattedProduct },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching related products:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the product." },
      { status: 500 }
    );
  }
}
