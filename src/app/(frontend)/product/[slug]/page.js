import ProductDetailClient from "@/components/ProductDetailClient";
import connection from "@/lib/connection"; // Path to MySQL connection

// Native Next.js 15 metadata generation
export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const [rows] = await connection.query(
      "SELECT name, description, images FROM product WHERE slug = ?",
      [slug]
    );

    if (rows.length === 0) {
      return { title: "Product Not Found | Sumaiya Home" };
    }

    const product = rows[0];
    const images = JSON.parse(product.images || "[]");
    const primaryImage = images.length > 0 ? images[0] : "https://www.sumaiyahome.com/placeholder.jpg";

    return {
      title: `${product.name} | Sumaiya Home`,
      description: product.description?.substring(0, 160) || "Explore this premium product from Sumaiya Home.",
      openGraph: {
        title: product.name,
        description: product.description?.substring(0, 160),
        url: `https://www.sumaiyahome.com/product/${slug}`,
        images: [{ url: primaryImage }],
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.description?.substring(0, 160),
        images: [primaryImage],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return { title: "Product | Sumaiya Home" };
  }
}

// Server Component (Renders the Client Component)
export default async function ProductDetailPage({ params }) {
  const { slug } = await params;

  return <ProductDetailClient slug={slug} />;
}
