"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, ArrowRight, Trash, Loader2 } from "lucide-react";
import useCartStore from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { cart: cartItems, setCart, removeFromCart, clearCart } = useCartStore();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setCart(data.cartItems || []);
      } else {
        toast.error(data.error || "Failed to fetch cart elements");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveItem = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`/api/cart/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        removeFromCart(productId);
        toast.success("Item removed from cart.");
      } else {
        toast.error(data.error || "Failed to remove item.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Cart cleared.");
  };

  const handleProceedToEnquiry = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to proceed");
        return;
      }

      if (!cartItems.length) {
        toast.error("Your cart is empty");
        return;
      }

      const res = await fetch("/api/myEnquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems,
          total: cartItems.reduce(
            (sum, item) => sum + (item.price || 0) * item.quantity,
            0
          ),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Enquiry sent successfully!");
        clearCart();
        router.push(`/enquirySuccess?ref=${data.enquiryId}`);
      } else {
        toast.error(data.error || "Failed to send enquiry");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground animate-pulse">
          Loading your cart...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>
        {cartItems.length > 0 && (
          <p className="mt-2 text-sm text-gray-500">
            You have {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart.
          </p>
        )}
      </div>

      {cartItems.length > 0 ? (
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-8">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-t border-b border-gray-200"
            >
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.li
                    key={item.cartId || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                    className="flex py-6 sm:py-8"
                  >
                    <div className="flex-shrink-0 relative h-24 w-24 sm:h-32 sm:w-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.name || "Product Image"}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-base font-medium text-gray-900 line-clamp-2 hover:text-primary transition-colors">
                              {item.name}
                            </h3>
                          </div>
                          <div className="mt-1 flex text-sm">
                            {item.color && (
                              <p className="text-gray-500">
                                {item.color}
                              </p>
                            )}
                            {item.size && (
                              <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                                Size {item.size}
                              </p>
                            )}
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <span className="font-medium mr-2">Qty:</span> {item.quantity}
                          </div>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <div className="absolute right-0 top-0 sm:right-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              onClick={() => handleRemoveItem(item.cartId)}
                            >
                              <span className="sr-only">Remove</span>
                              <Trash className="h-5 w-5" aria-hidden="true" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
            </div>
          </section>

          {/* Order summary */}
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            aria-labelledby="summary-heading"
            className="mt-16 rounded-xl bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-4 lg:mt-0 lg:p-8 border border-gray-200 shadow-sm sticky top-8"
          >
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-4 mb-4"
            >
              Order Summary
            </h2>

            <dl className="space-y-4 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <dt>Total Items</dt>
                <dd className="font-medium text-gray-900">{cartItems.length}</dd>
              </div>
            </dl>

            <div className="mt-8">
              <Button
                className="w-full text-base font-medium h-14 rounded-lg shadow-md hover:shadow-lg transition-all group"
                onClick={handleProceedToEnquiry}
                size="lg"
              >
                Proceed to Enquiry
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                or{" "}
                <Link
                  href="/collection"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </motion.section>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 px-4 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300"
        >
          <div className="bg-white p-6 rounded-full shadow-sm mb-6">
            <ShoppingBag className="h-16 w-16 text-gray-300" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 max-w-md mb-8">
            Looks like you haven&apos;t added any items to your cart yet. Discover our collection and find something you love.
          </p>
          <Button size="lg" asChild className="h-12 px-8 rounded-full shadow-md hover:shadow-lg transition-all">
            <Link href="/collection">Start Shopping</Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;