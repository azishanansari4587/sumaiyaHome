"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, CloudUpload, FolderPlus, Loader2, Sparkles, X } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import withAuth from "@/lib/withAuth";

const AddCollection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    isActive: true, // Default Active
    isFeatured: false,
    image: null,
    imageUrl: "",
  });

  // ✅ Slug Generator Function
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Alphanumeric ke alawa sab "-"
      .replace(/(^-|-$)/g, "");    // Shuru aur end ke "-" hatao
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // ✅ Auto-generate slug when Name changes
      if (name === "name") {
        newData.slug = generateSlug(value);
      }
      
      return newData;
    });
  };

  // ✅ Manual Slug Edit (Agar user khud slug change kare)
  const handleSlugChange = (e) => {
    setFormData(prev => ({ ...prev, slug: e.target.value }));
  };

  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const url = URL.createObjectURL(file);
    
    setFormData(prev => ({
      ...prev,
      image: file,
      imageUrl: url
    }));
  };

  const handleRemoveImage = () => {
    if (formData.imageUrl) URL.revokeObjectURL(formData.imageUrl);
    setFormData(prev => ({
      ...prev,
      image: null,
      imageUrl: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    
    // ✅ FIX: Boolean ko "1" aur "0" mein convert karke bhejo
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("slug", formData.slug);
    data.append("isActive", formData.isActive ? "1" : "0");     // Fix here
    data.append("isFeatured", formData.isFeatured ? "1" : "0"); // Fix here
    
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Unknown error");

      toast.success("Collection Created Successfully");

      // Reset form
      setFormData({
        name: "",
        description: "",
        slug: "",
        isActive: true,
        isFeatured: false,
        image: null,
        imageUrl: "",
      });

    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <Link 
              href="/collections/view_collection" 
              className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Collections
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="p-2 bg-primary/10 rounded-lg">
                <FolderPlus className="h-8 w-8 text-primary" />
              </span>
              Create Collection
            </h1>
            <p className="text-gray-500">Add a new category to organize your products.</p>
          </div>
          
          <div className="hidden md:block">
            <Button variant="outline" asChild>
              <Link href="/collections/view_collection">Cancel</Link>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Main Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Basic Details</CardTitle>
                  <CardDescription>
                    Enter the essential information for this collection.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Name Input */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700">Collection Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., Summer Essentials"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-white"
                    />
                  </div>

                  {/* Slug Input */}
                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-gray-700">URL Slug</Label>
                    <div className="flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        /collections/
                      </span>
                      <Input
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleSlugChange} // Alag handler taki user manually bhi edit kar sake
                        className="rounded-l-none"
                        placeholder="summer-essentials"
                      />
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Auto-generated from name. You can also edit it manually.
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-700">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Write a brief description..."
                      className="min-h-[120px] resize-none bg-white"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Status & Media */}
            <div className="space-y-6">
              
              {/* Status Card */}
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Visibility & Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Active Switch */}
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                    <div className="space-y-0.5">
                      <Label htmlFor="isActive" className="text-base cursor-pointer">Active</Label>
                      <p className="text-xs text-gray-500">Show on store</p>
                    </div>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(c) => handleSwitchChange("isActive", c)}
                    />
                  </div>

                  {/* Featured Switch */}
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                    <div className="space-y-0.5">
                      <Label htmlFor="isFeatured" className="text-base flex items-center gap-1 cursor-pointer">
                        Featured <Sparkles className="h-3 w-3 text-yellow-500" />
                      </Label>
                      <p className="text-xs text-gray-500">Promote on home</p>
                    </div>
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(c) => handleSwitchChange("isFeatured", c)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Image Upload Card */}
              <Card className="border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Thumbnail Image</CardTitle>
                </CardHeader>
                <CardContent>
                  {!formData.imageUrl ? (
                    <label 
                      htmlFor="image-upload"
                      className={`
                        relative flex flex-col items-center justify-center w-full h-48 
                        border-2 border-dashed rounded-lg cursor-pointer transition-all
                        ${isDragOver ? 'border-primary bg-primary/5' : 'border-gray-300 hover:bg-gray-50'}
                      `}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={(e) => { 
                        e.preventDefault(); 
                        setIsDragOver(false);
                        if (e.dataTransfer.files?.[0]) {
                           handleImageUpload({ target: { files: e.dataTransfer.files } });
                        }
                      }}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                        <CloudUpload className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-1 text-sm text-gray-500">
                          <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                      </div>
                      <input 
                        id="image-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload} 
                      />
                    </label>
                  ) : (
                    <div className="relative group w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={formData.imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm" 
                          onClick={handleRemoveImage}
                          className="shadow-lg"
                        >
                          <X className="h-4 w-4 mr-2" /> Remove
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>

          {/* Desktop Save Button (Bottom Right) */}
          <div className="flex justify-end mt-8 border-t pt-6">
             <Button 
              type="submit" 
              size="lg"
              className="bg-primary hover:bg-primary/90 min-w-[150px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                "Create Collection"
              )}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default withAuth(AddCollection, [1]);