import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";

const RelatedProducts = () => {
  const [related, setRelated] = useState([]);
  const { slug } = useParams(); // ✅ Correct param


  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!slug) return;

      try {
        const res = await fetch(`/api/product/related/${slug}`);
        const data = await res.json();
        setRelated(data.relatedProducts || []);
      } catch (err) {
        console.error("Failed to fetch related products:", err);
      }
    };

    fetchRelatedProducts();
  }, [slug]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
      {related.map((product) => (
        <ProductGrid
          key={product.id}
          productId={product.id}
          id={product.slug}
          name={product.name}
          image={product.images?.[0]}
          hoverImage={product.images?.[1]}
          badges={product.badges}
          selectedColor={product.colors?.[0]}
        />
      ))}
    </div>
  );
};

export default RelatedProducts;
