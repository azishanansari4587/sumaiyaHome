"use client"
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { useParams, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RelatedProducts from "@/components/RelatedProducts";
import { Check, Heart, Minus, Plus, ShoppingBag, ZoomIn } from "lucide-react";
import Spinner from "@/components/Spinner";
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

import { useSearchParams } from "next/navigation";
import useWishlistStore from '@/store/useWishlistStore';
import useCartStore from '@/store/cartStore';



const ProductDetail = () => {

  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const { slug } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);


  const searchParams = useSearchParams();
  const initialColor = searchParams.get("color");


  const addToWishlistLocal = useWishlistStore((state) => state.addToWishlist);
  const lightGalleryRef = useRef(null);

  const handleOpenGallery = (index) => {
    if (lightGalleryRef.current) {
      lightGalleryRef.current.instance.openGallery(index);
    }
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleColorChange = (colorName) => {
    setSelectedColor(colorName);
    setSelectedImage(0);
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login to add to cart");
      router.push("/signin");
      return;
    }

    const currentColorObj = product?.colors?.find(c => c.name === selectedColor) || product?.colors?.[0] || null;
    const currentImages = currentColorObj?.images ?? [];

    const cartItem = {
      productId: product.id,
      quantity: quantity,
      color: currentColorObj?.name,
      size: selectedSize,
      image: currentImages[selectedImage],
    };

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
      useCartStore.getState().addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: currentImages[selectedImage],
        color: currentColorObj?.name,
        size: selectedSize,
      });

      // ✅ Custom Popup at Bottom Right
      toast(
        <div className="flex gap-4 items-center">
          <img
            src={currentImages[selectedImage]}
            alt={product.name}
            width={64}
            height={64}
            className="object-cover rounded-md"
          />
          <div>
            <h4 className="text-md font-bold text-black">{product.name}</h4>
            <p className="text-sm text-gray-700">
              Quantity: {quantity},
            </p>
            <p className='text-sm text-gray-700'> Size: {selectedSize},</p>
            <p className='text-sm text-gray-700'>Color: {selectedColor}</p>
            <button
              onClick={() => router.push("/cart")}
              className="mt-1 text-xs px-3 py-1 bg-black text-white rounded"
            >
              View Cart
            </button>
          </div>
        </div>,

        {
          position: "bottom-right",
          autoClose: 10000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

    } else {
      toast.error(data.error);
    }

  };

  const handleAddToWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add to wishlist");
      router.push("/signin");
      return;
    }

    const decoded = jwtDecode(token);
    const userId = decoded.id;

    const res = await fetch("/api/wishlist/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, productId }),
    });

    const result = await res.json();

    if (res.ok) {
      addToWishlistLocal(product);
      toast.success("Added to Wishlist");
    } else {
      if (res.status === 409) {
        toast.warning("Already in Wishlist");
      } else {
        toast.error(result.error);
      }
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/${slug}`);
        const data = await res.json();

        if (res.ok) {
          setProduct(data);

          const validColor = data.colors.find(c => c.name.toLowerCase() === initialColor?.toLowerCase());

          setSelectedColor(validColor ? validColor.name : data.colors[0]?.name);
          // setSelectedColor(data.colors[0]?.name);
          setSelectedSize(data.sizes[0]?.value || data.sizes[0]);
        } else {
          toast.warning(`Product Not Found, ${data.error || "Unable to fetch product."}`);
        }
      } catch (err) {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading || !product) return <Spinner />;

  // const currentColorObj = product?.colors?.find(c => c.name === selectedColor) || product?.colors?.[0] || null;
  const currentColorObj = product?.colors?.find(c => c.name === selectedColor) || product?.colors?.[0];
  const currentImages = currentColorObj?.images ?? [];


  const handleImageHover = (e) => {
    if (!isZoomed) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link href="/rugs" className="text-sm font-medium text-muted-foreground hover:text-primary">Rugs</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{product.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-16">

          <div className="space-y-4">
            <div
              className={`relative aspect-square overflow-hidden bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-primary/20 transition-all duration-300 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              onClick={() => setIsZoomed(!isZoomed)}
              onMouseMove={handleImageHover}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <img
                src={currentImages[selectedImage]}
                alt={`${product.name} in ${currentColorObj.name}`}
                className={`w-full h-full object-contain transition-all duration-300 ${isZoomed ? 'scale-150' : 'hover:scale-105'}`}
                style={isZoomed ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                } : {}}
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                <ZoomIn size={20} className="text-muted-foreground" />
              </div>
              {product.originalPrice > product.price && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
              )}
            </div>

            {/* Enhanced Thumbnail Grid */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {currentImages.map((img, index) => (
                <button
                  key={index}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200 ${selectedImage === index
                      ? 'border-primary shadow-lg scale-105'
                      : 'border-border hover:border-primary/50 hover:scale-102'
                    }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">

                </div>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <p>{product.description}</p>
            </div>

            {/* Color */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Color</h3>
              <span className="text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">{currentColorObj?.name}</span>
            </div>

            <div className="flex flex-wrap gap-4">
              {product.colors.map(color => (
                <button key={color.name} onClick={() => color.inStock && handleColorChange(color.name)}
                  disabled={!color.inStock}
                  title={color.name}
                  aria-label={`Select color: ${color.name}`}
                  className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden transition-all duration-200
                    ${!color.inStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}
                    ${selectedColor === color.name ? 'ring-4 ring-primary ring-offset-2 scale-110 shadow-lg' : 'ring-2 ring-border hover:ring-primary/50'}`}>
                  {/* <Image src={`${color.images?.[0]}?height=100&width=100`} alt={color.name} fill className="object-cover w-full h-full rounded-full" /> */}
                  <img
                    src={color.images?.[0]}
                    alt={color.name}
                    className="object-contain w-full h-full rounded-full"
                  />
                  {selectedColor === color.name && <Check size={20} className="absolute inset-0 m-auto text-white drop-shadow-lg" />}
                  {!color.inStock && <div className="absolute inset-0 bg-gray-400/50 rounded-full flex items-center justify-center">
                    <div className="w-6 h-0.5 bg-red-500 rotate-45"></div>
                  </div>}
                </button>
              ))}
            </div>


            {/* Size Selection */}
            <div>
              <h3 className="font-medium mb-3">Size</h3>
              <RadioGroup
                value={selectedSize}
                onValueChange={setSelectedSize}
                className="grid grid-cols-2 sm:grid-cols-4 gap-2"
              >
                {product.sizes.map((size) => (
                  <div key={size} className="flex items-center">
                    <RadioGroupItem value={size} id={size} className="peer sr-only" />
                    <label
                      htmlFor={size}
                      className="flex w-full cursor-pointer items-center justify-center rounded-md border border-muted bg-popover p-2 text-center text-sm font-medium ring-offset-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:text-primary"
                    >
                      {size}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-medium mb-3">Quantity</h3>
              <div className="flex items-center">
                <button
                  className="w-10 h-10 border rounded-l-md flex items-center justify-center"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="w-12 h-10 border-t border-b flex items-center justify-center text-center">
                  {quantity}
                </div>
                <button
                  className="w-10 h-10 border rounded-r-md flex items-center justify-center"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>


            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full">
              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-primary text-white font-semibold shadow-lg hover:opacity-90 transition-all duration-300"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </Button>

              {/* Add to Wishlist Button */}
              <Button
                onClick={() => handleAddToWishlist(product.id)}
                variant="outline"
                size="lg"
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-black text-primary font-semibold hover:bg-white hover:text-black"
              >
                <Heart size={18} />
                <span>Add to Wishlist</span>
              </Button>
            </div>



            {/* Share */}
            <div className="flex items-center">
              <span className="text-sm font-medium mr-4">Share:</span>
              <div className="flex space-x-3">
                <button aria-label="Share on Facebook" className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </button>
                <button aria-label="Share on Twitter" className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </button>
                <button aria-label="Share on Pinterest" className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 12h8m-4-4v8" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </button>
                <button aria-label="Share via Email" className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <section className="container-custom mb-16">
          <Tabs defaultValue="details">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-6 overflow-x-auto">
              <TabsTrigger
                value="details"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-8 py-3"
              >
                Details
              </TabsTrigger>

              <TabsTrigger
                value="features"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-8 py-3"
              >
                Features
              </TabsTrigger>

            </TabsList>
            <TabsContent value="features">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                <div>
                  <h3 className="text-xl font-medium mb-4">Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="details">
              <h3 className="text-xl font-medium mb-4">Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {product.specifications.map((item, index) => (
                  <div key={index} className="border-b pb-3">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.key}</span>
                      <span className="text-muted-foreground">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

          </Tabs>
        </section>
        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-semibold mb-8">You May Also Like</h2>
          <RelatedProducts />
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
