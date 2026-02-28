// "use client"
// import { Heart, ShoppingCart } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Spinner from "./Spinner";
// import { useState, useEffect, useRef } from "react";
// import useWishlistStore from '@/store/useWishlistStore';
// import { toast } from 'react-toastify';
// import { jwtDecode } from 'jwt-decode';
// import { useRouter } from 'next/navigation';
// import Link from "next/link";
// import Image from "next/image";

// const BestSellers = () => {
//   const [products, setProducts] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [api, setApi] = useState()
//   const router = useRouter();
//   // const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }))

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch("/api/product")
//         const data = await res.json()
//         const products = data?.products || []

//         const filtered = products.filter((product) => {
//           let tags = []
//           try {
//             tags = Array.isArray(product.tags)
//               ? product.tags
//               : JSON.parse(product.tags || "[]")
//           } catch {}
//           return tags.includes("New Arrival")
//         })

//         setProducts(filtered)
//       } catch (err) {
//         console.error(err)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchProducts()
//   }, [])

//   const addToWishlistLocal = useWishlistStore((state) => state.addToWishlist);

//       const handleAddToWishlist = async (productId) => {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("Please login to add to wishlist");
//           router.push("/signin");
//           return;
//         }

//         const decoded = jwtDecode(token);;// ✅ This will now work
//         const userId = decoded.id;

//         const res = await fetch("/api/wishlist/add", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ userId, productId, image: products.image || null,
//           color: selectedColor?.name || null, }),
//         });

//         const result = await res.json();

//         if (res.ok) {
//           // addToWishlistLocal(productId);
//           addToWishlistLocal({
//           productId,
//           image: image || "",
//           color: selectedColor?.name || "",
//         }); // ✅ Store locally with color & image
//           toast.success("Added to Wishlist");
//         } else {
//           // If already exists
//           if (res.status === 409) {
//               toast.warning("Already in Wishlist");
//           } else {
//               toast.error( result.error);
//           }
//         }
//       };



//   if (isLoading)
//     return (
//       <div className="flex items-center justify-center py-24">
//         <Spinner />
//       </div>
//     )
//   return (
//     <section className="section-padding">
//       <div className="container mx-auto">
//         <div className="text-center mb-12">
//           <h2 className="relative text-3xl md:text-4xl font-serif font-semibold mb-4 text-center">
//             <span className="after:content-[''] after:block after:mx-auto after:mt-2 after:w-[100px] after:h-[2px] after:bg-primary">
//               NEW ARRIVALS
//             </span>
//           </h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             Our most popular rugs loved by customers for their quality, design, and comfort.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {products.map((product) => {
//             let images = []
//               try {
//                 if (Array.isArray(product.images)) images = product.images
//                 else if (typeof product.images === "string") {
//                   images = product.images.trim().startsWith("[")
//                     ? JSON.parse(product.images)
//                     : [product.images]
//                 }
//               } catch {}
//               return (
//             <div key={product.id} className="product-card">
//               <Link href={`/product/${product.slug}`} className="group block">
//                 <div className="relative aspect-square overflow-hidden">
//                   <Image
//                     src={ images[0] || "/placeholder.jpg"}
//                     alt={product.name || "Product Image"}
//                     fill
//                     className="object-cover transition-opacity duration-200 product-card-image"
//                     sizes="(max-width: 768px) 100vw, 33vw"
//                   />
//                   {/* <img 
//                     src={images[0] || "/placeholder.svg"} 
//                     alt={product.name}
//                     className="w-full h-full object-cover"
//                   /> */}
//                   {product.tag && (
//                     <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
//                       {product.tag}
//                     </div>
//                   )}
//                   {/*   */}
//                 </div>
//               </Link>
//               <div className="p-4">
//                 <h3 className="font-medium mb-2">{product.name}</h3>
//                 {/* <Button className="w-full flex items-center justify-center gap-2"
//                 onClick={() => handleAddToWishlist(product.id)}>
//                   <Heart size={18} />
//                   Add to Wishlist
//                 </Button> */}
//               </div>
//             </div>
//               )}
//           )}
//         </div>

//         {/* <div className="text-center mt-10">
//           <Button variant="outline" size="lg">
//             View All Products
//           </Button>
//         </div> */}
//       </div>
//     </section>
//   );
// };

// export default BestSellers;
"use client"
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Spinner from "./Spinner";
import ProductGrid from "@/components/ProductGrid"; // ✅ Import ProductGrid

const BestSellers = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/product")
        const data = await res.json()
        const allProducts = data?.products || []

        // ✅ Step 1: Filter only "New Arrival" products
        const filtered = allProducts.filter((product) => {
          let tags = []
          try {
            tags = Array.isArray(product.tags)
              ? product.tags
              : JSON.parse(product.tags || "[]")
          } catch (err) {
            console.error("Tag parsing error", err);
          }
          return tags.includes("New Arrival")
        })

        setProducts(filtered)
      } catch (err) {
        console.error("Fetch error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // ✅ Step 2: Flatten products color-wise (Same as Shop & Collection page)
  const expandedProducts = products.flatMap((product) => {
    let images = [];
    try {
      images = Array.isArray(product.images)
        ? product.images
        : JSON.parse(product.images || "[]");
    } catch (e) {
      images = [product.images];
    }

    if (Array.isArray(product.colors) && product.colors.length > 0) {
      return product.colors.map((color, idx) => ({
        ...product,
        uniqueKey: `${product.id}-${idx}`,
        displayName: `${product.name} - ${color.name}`,
        displayImage: color.images?.[0] || images[0],
        hoverImage: color.images?.[1] || images[1] || null,
        selectedColor: color,
      }));
    }

    return [{
      ...product,
      uniqueKey: product.id,
      displayName: product.name,
      displayImage: images[0],
      hoverImage: images[1] || null,
    }];
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    )
  }

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="relative text-3xl md:text-4xl font-serif font-semibold mb-4 text-center">
            <span className="after:content-[''] after:block after:mx-auto after:mt-2 after:w-[100px] after:h-[2px] after:bg-primary">
              NEW ARRIVALS
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our latest collection of rugs designed to bring elegance and warmth to your space.
          </p>
        </div>

        {/* ✅ Step 3: Use the ProductGrid component */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {expandedProducts.length > 0 ? (
            expandedProducts.map((product) => (
              <ProductGrid
                key={product.uniqueKey}
                productId={product.id}
                id={product.slug}
                name={product.displayName}
                image={product.displayImage}
                hoverImage={product.hoverImage}
                category={product.category}
                colors={product.colors || []}
                badges={product.badges}
                sizes={product.sizes || []}
                selectedColor={product.selectedColor}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              No new arrivals at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;