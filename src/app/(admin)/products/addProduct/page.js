"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator"; // Optional, for lines
import Link from "next/link";
import { ArrowLeft, Plus, Upload, X, Save, Layers, Tag, Image as ImageIcon, Box } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { uploadToCloudinary } from "@/lib/uploadCloudinary";
import withAuth from "@/lib/withAuth";

const AddProduct = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch("/api/collections?all=true");
        if (!response.ok) throw new Error("Failed to fetch collections");
        const data = await response.json();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  const initialProductState = {
    id: "",
    name: "",
    code: "",
    isActive: true,
    isFeatured: false,
    tags: [],
    images: [],
    imageUrls: [],
    colors: [],
    sizes: [],
    features: [],
    specifications: [],
    inStock: true,
    sku: "",
    quantity: "",
    collectionId: "",
    short_description: "",
    description: "",
    badges: "",
  };

  const [product, setProduct] = useState(initialProductState);

  const availableTags = ["Rugs", "Remnant", "OutDoor", "New Arrival", "Cushion", "Throws", "Pillows", "Poufs"];
  const availableBadges = [
    { id: "new", name: "New" },
    { id: "top_sell", name: "Top Sell" },
    { id: "none", name: "None" },
  ];

  // --- Handlers (Logic Same as before) ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, checked) => {
    setProduct((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      id: `${file.name}-${Date.now()}`,
      file,
      url: URL.createObjectURL(file),
      progress: 0,
      uploading: true,
      temp: true,
    }));

    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...previews],
    }));

    try {
      const uploaded = await Promise.all(
        files.map((file) =>
          uploadToCloudinary(file, "NurzatProducts", "image", (progress) => {
            setProduct((prev) => ({
              ...prev,
              images: prev.images.map((img) => (img.file === file ? { ...img, progress } : img)),
            }));
          })
        )
      );

      setProduct((prev) => ({
        ...prev,
        images: [
          ...prev.images.filter((img) => !img.temp).map((img) => img.url),
          ...uploaded.map((u) => u.secure_url),
        ],
      }));
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("❌ Failed to upload image");
    }
  };

  const handleRemoveImage = (index) => {
    const imgs = [...product.images];
    imgs.splice(index, 1);
    setProduct({ ...product, images: imgs });
  };

  const handleColorImageUpload = async (e, colorIndex) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setProduct((prev) => {
      const newColors = [...prev.colors];
      if (!Array.isArray(newColors[colorIndex].images)) newColors[colorIndex].images = [];

      const existingFileNames = newColors[colorIndex].images.filter((img) => img.file).map((img) => img.file.name);
      const uniqueFiles = files.filter((f) => !existingFileNames.includes(f.name));

      const previews = uniqueFiles.map((file) => ({
        id: `${file.name}-${Date.now()}`,
        file,
        url: URL.createObjectURL(file),
        progress: 0,
        uploading: true,
        temp: true,
      }));

      newColors[colorIndex].images.push(...previews);
      return { ...prev, colors: newColors };
    });

    for (const file of files) {
      if (!file) continue;
      try {
        const uploaded = await uploadToCloudinary(file, "SumaiyaHome/colors", "image", (progress) => {
          setProduct((prev) => {
            const newColors = [...prev.colors];
            newColors[colorIndex].images = newColors[colorIndex].images.map((img) =>
              img.file === file ? { ...img, progress, uploading: progress < 100 } : img
            );
            return { ...prev, colors: newColors };
          });
        });

        setProduct((prev) => {
          const newColors = [...prev.colors];
          newColors[colorIndex].images = newColors[colorIndex].images.map((img) =>
            img.file === file ? uploaded.secure_url : img
          );
          return { ...prev, colors: newColors };
        });
      } catch (err) {
        console.error("Color image upload error:", err);
        toast.error("❌ Failed to upload color image");
      }
    }
  };

  const handleRemoveColorImage = (colorIndex, imageIndex) => {
    const updatedColors = [...product.colors];
    if (updatedColors[colorIndex] && Array.isArray(updatedColors[colorIndex].images)) {
      updatedColors[colorIndex].images.splice(imageIndex, 1);
      setProduct({ ...product, colors: updatedColors });
    }
  };

  const handleTagChange = (tag, checked) => {
    setProduct((prev) => ({
      ...prev,
      tags: checked ? [...prev.tags, tag] : prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    Object.keys(product).forEach((key) => {
      if (key === 'tags' || key === 'sizes' || key === 'features' || key === 'specifications' || key === 'images' || key === 'colors') {
        formData.append(key, JSON.stringify(product[key]));
      } else {
        formData.append(key, product[key]);
      }
    });

    try {
      const res = await fetch("/api/product", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("✅ Product saved successfully!");
        setProduct(initialProductState);
      } else {
        toast.error(`❌ Error: ${result.message || "Failed to save product"}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(`❌ Error: ${err.message || "Something went wrong"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <form onSubmit={handleSubmit}>

        {/* --- Top Header Action Bar --- */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 mb-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-gray-100">
                <Link href="/products">
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-sm text-gray-500">Create a new item for your inventory</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin">Discard</Link>
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 min-w-[140px]" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Product
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* --- Left Column: Main Content (2/3 width) --- */}
          <div className="lg:col-span-2 space-y-8">

            {/* 1. General Info */}
            <Card className="border-gray-200 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-100 pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" /> General Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Product Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={product.name}
                    onChange={handleChange}
                    placeholder="e.g., Persian Royal Blue Carpet"
                    className="bg-gray-50 border-gray-200 focus:bg-white transition-colors h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">Short Description <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="short_description"
                    name="short_description"
                    value={product.short_description}
                    onChange={handleChange}
                    className="bg-gray-50 border-gray-200 min-h-[80px]"
                    placeholder="Brief summary for listings..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    value={product.description}
                    onChange={handleChange}
                    placeholder="Detailed product information..."
                    className="bg-gray-50 border-gray-200 min-h-[200px] focus:bg-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 2. Media Gallery */}
            <Card className="border-gray-200 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-100 pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" /> Media Gallery
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">

                {/* Upload Zone */}
                <div className="group relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center justify-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-gray-700 font-medium text-lg mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500 mb-6">SVG, PNG, JPG or GIF (max. 5MB)</p>
                    <Button type="button" variant="outline" className="pointer-events-none">Select Files</Button>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Image Grid */}
                {product.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                    {product.images.map((img, index) => (
                      <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        <Image
                          src={img.temp ? img.url : img}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        {/* Loading Overlay */}
                        {img.temp && (
                          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2">
                            <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${img.progress}%` }} />
                            </div>
                          </div>
                        )}
                        {/* Delete Button */}
                        {!img.temp && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 3. Variants (Colors & Sizes) */}
            <Card className="border-gray-200 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-100 pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Box className="h-5 w-5 text-primary" /> Product Variants
                </CardTitle>
                <CardDescription>Manage options like color and size</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">

                {/* Colors Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold text-gray-800">Available Colors</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setProduct({ ...product, colors: [...product.colors, { name: "", value: "#000000", inStock: true, images: [] }] })}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Color
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {product.colors.map((color, idx) => (
                      <div key={idx} className="relative p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary/30 transition-colors">
                        <button
                          type="button"
                          onClick={() => {
                            const updatedColors = [...product.colors];
                            updatedColors.splice(idx, 1);
                            setProduct({ ...product, colors: updatedColors });
                          }}
                          className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                        >
                          <X className="h-5 w-5" />
                        </button>

                        <div className="grid md:grid-cols-2 gap-4 mb-4 pr-8">
                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Color Name</Label>
                            <Input
                              placeholder="e.g. Midnight Blue"
                              className="bg-white"
                              value={color.name}
                              onChange={(e) => {
                                const colors = [...product.colors];
                                colors[idx].name = e.target.value;
                                setProduct({ ...product, colors });
                              }}
                            />
                          </div>
                          <div className="flex items-end gap-3">
                            <div className="flex-1">
                              <Label className="text-xs text-gray-500 mb-1 block">Hex Code</Label>
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-md border border-gray-200 shadow-sm shrink-0" style={{ backgroundColor: color.value }}></div>
                                <Input
                                  type="text"
                                  value={color.value}
                                  onChange={(e) => {
                                    const colors = [...product.colors];
                                    colors[idx].value = e.target.value;
                                    setProduct({ ...product, colors });
                                  }}
                                  className="bg-white font-mono"
                                />
                                <input
                                  type="color"
                                  className="sr-only"
                                  id={`color-picker-${idx}`}
                                  value={color.value}
                                  onChange={(e) => {
                                    const colors = [...product.colors];
                                    colors[idx].value = e.target.value;
                                    setProduct({ ...product, colors });
                                  }}
                                />
                                <label htmlFor={`color-picker-${idx}`} className="cursor-pointer p-2 bg-white border border-gray-200 rounded-md hover:bg-gray-100">
                                  <Layers className="h-4 w-4 text-gray-600" />
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Color Images Mini Uploader */}
                        <div className="mt-3 p-3 bg-white rounded-lg border border-dashed border-gray-300">
                          <div className="flex items-center gap-2 mb-2">
                            <Label className="text-xs font-medium text-gray-600">Variant Images</Label>
                            <label className="cursor-pointer text-xs text-primary font-medium hover:underline">
                              + Upload Images
                              <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleColorImageUpload(e, idx)} />
                            </label>
                          </div>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {color.images && color.images.length > 0 ? (
                              color.images.map((img, i) => (
                                <div key={i} className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden border border-gray-200 group">
                                  <Image src={img.temp ? img.url : img} alt="var" fill className="object-cover" />
                                  {!img.temp && (
                                    <button type="button" onClick={() => handleRemoveColorImage(idx, i)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                      <X className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400 italic py-1">No images selected</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Sizes Section */}
                <div>
                  <Label className="text-base font-semibold text-gray-800 mb-4 block">Available Sizes</Label>
                  <div className="flex gap-3 mb-4">
                    <Input
                      placeholder="e.g., 5' x 8' or XL"
                      value={product.newSize || ""}
                      onChange={(e) => setProduct({ ...product, newSize: e.target.value })}
                      className="max-w-xs"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (product.newSize && !product.sizes.includes(product.newSize)) {
                          setProduct({ ...product, sizes: [...product.sizes, product.newSize], newSize: "" });
                        }
                      }}
                    >
                      Add Size
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                        {size}
                        <button type="button" onClick={() => {
                          const updated = [...product.sizes];
                          updated.splice(i, 1);
                          setProduct({ ...product, sizes: updated });
                        }} className="text-gray-400 hover:text-red-500">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    {product.sizes.length === 0 && <p className="text-sm text-gray-500">No sizes added yet.</p>}
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* 4. Features & Specs (Simplifed visual) */}
            <Card className="border-gray-200 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-100 pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800">Product Features</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {product.features.map((f, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={f}
                      onChange={(e) => {
                        const features = [...product.features];
                        features[i] = e.target.value;
                        setProduct({ ...product, features });
                      }}
                      placeholder={`Feature #${i + 1}`}
                    />
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setProduct({ ...product, features: [...product.features, ""] })}>
                  + Add Feature
                </Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-100 pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800">Specifications</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {product.specifications.map((s, i) => (
                  <div key={i} className="flex gap-3">
                    <Input placeholder="Key (e.g. Material)" className="flex-1" value={s.key} onChange={(e) => {
                      const specs = [...product.specifications];
                      specs[i].key = e.target.value;
                      setProduct({ ...product, specifications: specs });
                    }} />
                    <Input placeholder="Value (e.g. Wool)" className="flex-1" value={s.value} onChange={(e) => {
                      const specs = [...product.specifications];
                      specs[i].value = e.target.value;
                      setProduct({ ...product, specifications: specs });
                    }} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => {
                      const specs = [...product.specifications];
                      specs.splice(i, 1);
                      setProduct({ ...product, specifications: specs });
                    }}>
                      <X className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setProduct({ ...product, specifications: [...product.specifications, { key: "", value: "" }] })}>
                  + Add Specification
                </Button>
              </CardContent>
            </Card>

          </div>

          {/* --- Right Column: Sidebar (1/3 width) --- */}
          <div className="space-y-8">

            {/* 1. Status & Visibility */}
            <Card className="border-gray-200 shadow-sm rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
                  <Checkbox id="isActive" checked={product.isActive} onCheckedChange={(c) => handleCheckboxChange("isActive", c === true)} />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <Label htmlFor="isFeatured" className="cursor-pointer">Featured</Label>
                  <Checkbox id="isFeatured" checked={product.isFeatured} onCheckedChange={(c) => handleCheckboxChange("isFeatured", c === true)} />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <Label htmlFor="inStock" className="cursor-pointer">In Stock</Label>
                  <Checkbox id="inStock" checked={product.inStock} onCheckedChange={(c) => handleCheckboxChange("inStock", c === true)} />
                </div>
              </CardContent>
            </Card>

            {/* 2. Organization (Collection & Badges) */}
            <Card className="border-gray-200 shadow-sm rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Collection</Label>
                  <select
                    name="collectionId"
                    value={product.collectionId}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  >
                    <option value="">Select Collection</option>
                    {collections.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Badge Overlay</Label>
                  <select
                    name="badges"
                    value={product.badges}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">No Badge</option>
                    {availableBadges.map((b) => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* 3. Inventory Details */}
            <Card className="border-gray-200 shadow-sm rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Product Code</Label>
                  <Input name="code" value={product.code} onChange={handleChange} placeholder="e.g. ROYAL-001" />
                </div>
                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Input name="sku" value={product.sku} onChange={handleChange} placeholder="Stock Keeping Unit" />
                </div>
              </CardContent>
            </Card>

            {/* 4. Tags */}
            <Card className="border-gray-200 shadow-sm rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <div key={tag} className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={product.tags.includes(tag)}
                        onCheckedChange={(c) => handleTagChange(tag, c === true)}
                        className="rounded-full data-[state=checked]:bg-primary data-[state=checked]:text-white border-gray-400"
                      />
                      <label htmlFor={`tag-${tag}`} className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                        {tag}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>

        </div>
      </form>
    </div>
  );
};

export default withAuth(AddProduct, [1]);