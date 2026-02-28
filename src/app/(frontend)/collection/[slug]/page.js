// "use client";
// import React from "react";
// import { useParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { ChevronRight } from "lucide-react";
// import { useEffect, useState } from "react";
// import Spinner from "@/components/Spinner";






// const Collection = () => {

//   const { slug } = useParams(); // ✅ Correct param name
// // const normalizedId = slug?.toString().toLowerCase();
// // const collection = normalizedId && collectionsData[normalizedId];

// // const { slug } = useParams();
// const [collection, setCollection] = useState(null);
// const [products, setProducts] = useState([]);
// const [loading, setLoading] = useState(true);

// useEffect(() => {
//   if (slug) {
//     const fetchData = async () => {
//       try {
//         const res = await fetch(`/api/collections/${slug}`);
//         const data = await res.json();

//         if (res.ok) {
//           setCollection(data.collection);
//           setProducts(data.products);
//         } else {
//           setCollection(null);
//         }
//       } catch (error) {
//         console.error("Fetch collection error:", error);
//         setCollection(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }
// }, [slug]);

// if (loading) {
//   return (
//     <Spinner/>
//   );
// }

//   // const { collectionId } = useParams();
  
//   // // Get collection data
//   // const collection = collectionId && collectionsData[collectionId ];
  
//   if (!collection) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
//           <div className="text-center">
//             <h1 className="text-3xl font-serif font-bold mb-4">Collection Not Found</h1>
//             <p className="mb-8">The collection you&apos;re looking for doesn&apos;t exist.</p>
//             <Button asChild>
//               <Link href="/shop">Browse All Rugs</Link>
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }
  
//   // Filter products for this collection
//   // const collectionProducts = products.filter(product => 
//   //   slug && product.collections.includes(slug)
//   // );

//   const collectionProducts = products; // already filtered from API


//   return (
//     <div className="min-h-screen flex flex-col">
//       <main className="flex-grow">
//         {/* Collection Banner */}
//         {/* <div 
//           className="w-full bg-cover bg-center h-80 flex items-center justify-center relative"
//           // style={{ backgroundImage: `url(${collection.image})` }}
//         > */}
//           {/* <div className="absolute inset-0 bg-black/50"></div> */}
//           <div className="container mx-auto px-4 relative z-10 text-center text-white">
//             <h1 className="text-4xl md:text-5xl text-white font-serif font-bold mb-4">{collection.title}</h1>
//             <p className="text-lg md:text-xl max-w-2xl mx-auto">{collection.bannerText}</p>
//           </div>
//         {/* </div> */}
        
//         {/* Breadcrumb */}
//         <div className="container mx-auto px-4 py-4 flex items-center text-sm">
//           <Link href="/" className="text-muted-foreground hover:text-primary">Home</Link>
//           <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
//           <Link href="/shop" className="text-muted-foreground hover:text-primary">Shop</Link>
//           <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
//           <span className="font-medium">{collection.title}</span>
//         </div>
        
//         {/* Collection Info */}
//         <div className="container mx-auto px-4 py-8">
//           <div className="max-w-3xl mx-auto text-center mb-12">
//             <p className="text-lg text-muted-foreground">
//               {collection.description}
//             </p>
//           </div>
          
//           {/* Products Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {collectionProducts.length > 0 ? (
//               collectionProducts.map(product => (
//                 <div key={product.id} className="product-card">
//                   <div className="overflow-hidden">
//                     <Link href={`/product/${product.slug}`}>
//                       <img 
//                         src={product.images?.[0]} 
//                         alt={product.name} 
//                         className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
//                       />
//                     </Link>
//                   </div>
//                   <div className="p-4">
//                     <h3 className="font-medium text-lg mb-1">{product.name}</h3>
//                     {/* <div className="flex justify-between items-center">
                     
//                       <Button size="sm" variant="outline" asChild>
//                         <Link href={`/product/${product.slug}`}>View Details</Link>
//                       </Button>
//                     </div> */}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-3 text-center py-16">
//                 <h3 className="text-xl font-medium mb-2">No products found in this collection</h3>
//                 <p className="text-muted-foreground mb-6">Check out our other collections</p>
//                 <Button asChild>
//                   <Link href="/shop">Browse All Rugs</Link>
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Collection;


"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Spinner from "@/components/Spinner";
import ProductGrid from "@/components/ProductGrid"; // ✅ Import ProductGrid

const Collection = () => {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const fetchData = async () => {
        try {
          const res = await fetch(`/api/collections/${slug}`);
          const data = await res.json();

          if (res.ok) {
            setCollection(data.collection);
            setProducts(data.products);
          } else {
            setCollection(null);
          }
        } catch (error) {
          console.error("Fetch collection error:", error);
          setCollection(null);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [slug]);

  // ✅ Step: Flatten products color-wise (Exactly like Shop page)
  const expandedProducts = products.flatMap((product) => {
    let images = [];
    try {
      images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || "[]");
    } catch (e) {
      console.error("Failed to parse images:", e);
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

  if (loading) return <Spinner />;

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Collection Not Found</h1>
          <Button asChild><Link href="/shop">Browse All Rugs</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4 flex items-center text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
          <Link href="/shop" className="text-muted-foreground hover:text-primary">Shop</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
          <span className="font-medium">{collection.name || collection.title}</span>
        </div>

        {/* Collection Info */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-serif font-bold mb-4">{collection.name || collection.title}</h1>
            <p className="text-lg text-muted-foreground">{collection.description}</p>
          </div>

          {/* ✅ Products Grid - Using the same ProductGrid component */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="col-span-full text-center py-16">
                <h3 className="text-xl font-medium mb-2">No products found in this collection</h3>
                <Button asChild><Link href="/shop">Browse All Rugs</Link></Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Collection;