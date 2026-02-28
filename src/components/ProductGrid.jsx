"use client"
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import useWishlistStore from '@/store/useWishlistStore';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';



const ProductGrid = ({
  productId,
  id,
  name,
  image,
  hoverImage,
  badges,
  selectedColor // ✅ yeh aa raha hai parent se
}) => {

  const [showHoverImage, setShowHoverImage] = useState(false);
  const router = useRouter();
  const hoverTimer = useRef(null);

  const handleMouseEnter = () => {
    if (!hoverImage) return; // skip if no hoverImage
    hoverTimer.current = setTimeout(() => {
      setShowHoverImage(true);
    }, 500); // 5 seconds
  };


  const handleMouseLeave = () => {
    clearTimeout(hoverTimer.current);
    setShowHoverImage(false);
  };


  const addToWishlistLocal = useWishlistStore((state) => state.addToWishlist);

  const handleAddToWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add to wishlist");
      router.push("/signin");
      return;
    }

    const decoded = jwtDecode(token);;// ✅ This will now work
    const userId = decoded.id;

    const res = await fetch("/api/wishlist/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId, productId, image: image || null,
        color: selectedColor?.name || null,
      }),
    });

    const result = await res.json();

    if (res.ok) {
      // addToWishlistLocal(productId);
      addToWishlistLocal({
        productId,
        image: image || "",
        color: selectedColor?.name || "",
      }); // ✅ Store locally with color & image
      toast.success("Added to Wishlist");
    } else {
      // If already exists
      if (res.status === 409) {
        toast.warning("Already in Wishlist");
      } else {
        toast.error(result.error);
      }
    }
  };


  return (
    <div
      className="relative overflow-hidden rounded-md bg-secondary mb-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      {/* ✅ Badge (top-right corner) */}
      {badges && badges !== "None" && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-gray-500 text-white px-2 py-1 rounded-md shadow">
            {badges}
          </Badge>
        </div>
      )}

      <div key={productId} className="product-card">
        <div className="overflow-hidden">
          <Link href={`/product/${id}?color=${selectedColor?.name}`}>
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={(hoverImage && showHoverImage ? hoverImage : image) || "/placeholder.jpg"}
                alt={name || "Product Image"}
                fill
                className="object-cover transition-opacity duration-200 product-card-image"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </Link>
        </div>
        <div className="p-2 sm:p-4">
          <div className="flex justify-between items-center gap-1">
            <h3 className="font-small text-xs sm:text-sm mb-1 line-clamp-2">{name}</h3>
            <Button size="sm" variant="secondary"
              className="rounded-full w-7 h-7 sm:w-10 sm:h-10 p-0 flex-shrink-0 flex items-center justify-center hover:bg-red-100 transition-colors"
              onClick={() => handleAddToWishlist(productId)}>
              <Heart size={14} className="text-foreground sm:hidden" />
              <Heart size={18} className="text-foreground hidden sm:block" />
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductGrid;