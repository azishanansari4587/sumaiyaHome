import connection from '@/lib/connection';
import { NextResponse } from 'next/server';

export async function GET(req, context) {
  const params = await context.params; // ✅ await required
  const slug = params.slug;

  try {
    const [rows] = await connection.query(
      'SELECT * FROM product WHERE slug = ?',
      [slug]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = rows[0];

    // Safely parse all JSON fields
    const formattedProduct = {
      ...product,
      colors: JSON.parse(product.colors || '[]'),
      sizes: JSON.parse(product.sizes || '[]'),
      features: JSON.parse(product.features || '[]'),
      specifications: JSON.parse(product.specifications || '[]'),
      images: JSON.parse(product.images || '[]'),
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error('PRODUCT GET ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



// ** Edit Product Page **//
export async function PUT(req, { params }) {
  const { slug } = await params;

  try {
    const body = await req.json();

    const images = JSON.stringify(body.images || []);
    const colors = JSON.stringify(body.colors || []);
    const sizes = JSON.stringify(body.sizes || []);
    const features = JSON.stringify(body.features || []);
    const specifications = JSON.stringify(body.specifications || []);
    const tags = Array.isArray(body.tags) ? body.tags : [];

    const [result] = await connection.execute(
      `UPDATE product SET
        name = ?,
        code = ?,
        slug = ?,
        isActive = ?,
        isFeatured = ?,
        images = ?,
        colors = ?,
        sizes = ?,
        features = ?,
        specifications = ?,
        inStock = ?,
        sku = ?,
        collectionId = ?,
        short_description = ?,
        description = ?,
        badges = ?,
        tags = ?
      WHERE slug = ?`,
      [
        body.name,
        body.code,
        body.slug,
        body.isActive ? 1 : 0,
        body.isFeatured ? 1 : 0,
        images,
        colors,
        sizes,
        features,
        specifications,
        body.inStock ? 1 : 0,
        body.sku || "",
        body.collectionId || "",
        body.short_description || "",
        body.description || "",
        body.badges || "",
        JSON.stringify(tags),
        slug
      ]
    );

    return NextResponse.json({ message: "Product updated successfully" });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return NextResponse.json(
      { message: "Failed to update product", error: err.message },
      { status: 500 }
    );
  }
}

// export async function PUT(req, { params }) {
//   const { slug } = params;

//   try {
//     const body = await req.json();

//     // ✅ Prepare JSON fields
//     const images = JSON.stringify(body.images || []);
//     const colors = JSON.stringify(body.colors || []);
//     const sizes = JSON.stringify(body.sizes || []);
//     const features = JSON.stringify(body.features || []);
//     const specifications = JSON.stringify(body.specifications || []);

//     const tags = Array.isArray(body.tags) ? body.tags : [];
//     // const designers = Array.isArray(body.designers) ? body.designers : [];

//     const result = await connection.execute(
//       `UPDATE product SET
//         name = ?,
//         code = ?,
//         slug = ?,
//         isActive = ?,
//         isFeatured = ?,
//         images = ?,
//         colors = ?,
//         sizes = ?,
//         features = ?,
//         specifications = ?,
//         inStock = ?,
//         sku = ?,
//         collectionId = ?,
//         short_description = ?,
//         description = ?,
//         badges = ?,
//         tags = ?,
//       WHERE slug = ?`,
//       [
//         body.name,
//         body.code,
//         body.slug,
//         body.isActive ? 1 : 0,
//         body.isFeatured ? 1 : 0,
//         images,
//         colors,
//         sizes,
//         features,
//         specifications,
//         body.inStock ? 1 : 0,
//         body.sku || "",
//         body.collectionId || "",
//         body.short_description || "",
//         body.description || "",
//         body.badges || "",
//         // tags,
//         // designers,
//         JSON.stringify(tags),
//         // JSON.stringify(designers),
//         slug
//       ]
//     );

//     return NextResponse.json({ message: "Product updated successfully" });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
//   }
// }

export async function DELETE(req, { params }) {
  const { slug } = await params;

  try {
    const [result] = await connection.execute(
      `DELETE FROM product WHERE slug = ?`,
      [slug]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("DELETE product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}