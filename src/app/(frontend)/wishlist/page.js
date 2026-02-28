"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ShoppingBag } from "lucide-react";
import { jwtDecode } from 'jwt-decode';
import useWishlistStore from "@/store/useWishlistStore";
import useCartStore from "@/store/cartStore";
import { toast } from "react-toastify";
import Image from "next/image";

export default function Wishlist() {

  const { wishlist: wishlistItems, setWishlist, removeFromWishlist, clearWishlist } = useWishlistStore();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false); // stop loading if no token
        return;
      }

      try {
        const res = await fetch("/api/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setWishlist(data.wishlistItems);
        } else {
          toast.error(data.error)
        }
      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false); // 2. stop loading after API call completes
      }
    };

    fetchWishlist();
  }, [setWishlist]);

  const handleRemoveItem = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`/api/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        // setWishlist((prev) => prev.filter((item) => item.id !== productId));
        // new
        removeFromWishlist(productId);

        toast.success("Item removed from wishlist.");
      } else {
        toast.error(data.error || "Failed to remove item.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };


  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login to add to cart");
      return;
    }

    // Attempt to determine color and size if they exist; otherwise provide fallbacks
    // The wishlist item might have `color` directly, or might need to use `colors[0].name` from product data if available
    const productSize = product.size || "Default";
    const productColor = product.color || "Default";

    const cartItem = {
      productId: product.id,
      quantity: 1, // Default quantity for adding from wishlist
      color: productColor,
      size: productSize,
      image: product.imageUrl || "/placeholder.jpg",
    };

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartItem),
      });

      const data = await res.json();

      if (res.ok) {
        // Add to local zustand store
        useCartStore.getState().addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.imageUrl || "/placeholder.jpg",
          color: productColor,
          size: productSize,
        });

        toast.success("Added to Cart Successfully");
      } else {
        toast.error(data.error || "Failed to add to cart");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleClearWishlist = () => {
    if (wishlistItems.length === 0) return;

    // new
    clearWishlist();
    toast.error("All items have been removed from your wishlist.");
  };


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="h-5 w-5 text-forest-700" />
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-800">My Wishlist</h1>
        </div>

        {wishlistItems.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <p className="text-forest-700">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist</p>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-forest-300 text-forest-700"
                onClick={handleClearWishlist}
              >
                <Trash2 className="h-4 w-4" /> Clear All
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item, index) => (
                <div key={index} className="border border-forest-200 rounded-md overflow-hidden group">
                  <div className="relative h-64">
                    <Image
                      // Agar imageUrl empty hai toh placeholder dikhao, warna browser download error dega
                      src={item.imageUrl || "/placeholder.jpg"}
                      alt={item.name || "Product Image"}
                      fill
                      className="object-cover transition-opacity duration-200 product-card-image"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      // Optional: Agar image loading mein time le toh ye error handle karega
                      onError={(e) => { e.target.src = "/placeholder.jpg" }}
                    />
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full hover:bg-white text-forest-700 hover:text-red-500 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    {!item.inStock && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gray-800/70 text-white py-2 px-3 text-sm font-medium">
                        Currently Out of Stock
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <Link href={`/product/${item.slug || item.id}`} className="block mb-2 hover:text-forest-600">
                      <h3 className="font-medium text-forest-800 truncate">{item.name}</h3>
                    </Link>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-primary hover:bg-forest-800 flex items-center justify-center gap-2"
                        disabled={!item.inStock}
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingCart className="h-4 w-4" /> Add to Cart
                      </Button>
                      <Button variant="outline" className="p-2 border-forest-300" asChild>
                        <Link href={`/product/${item.slug || item.id}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 border border-forest-200 rounded-lg">
            <Heart className="h-16 w-16 mx-auto text-forest-300 mb-4" />
            <h2 className="text-2xl font-medium text-forest-800 mb-3">Your wishlist is empty</h2>
            <p className="text-forest-600 mb-6 max-w-md mx-auto">
              Add items you love to your wishlist and revisit them anytime you want.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/products" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" /> Browse Products
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}