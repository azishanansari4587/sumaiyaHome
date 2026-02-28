"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchProduct() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchSearch = async () => {
      const res = await fetch(`/api/search?q=${query}`);
      const data = await res.json();
      setProducts(data.results || []);
    };

    if (query) fetchSearch();
  }, [query]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Search Results for: {query}</h2>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded p-2 shadow hover:shadow-lg transition">
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
              <h3 className="mt-2 font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.description.slice(0, 60)}...</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}
