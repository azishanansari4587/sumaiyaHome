// "use client"
// import React from 'react'
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableHead, 
//   TableHeader, 
//   TableRow 
// } from "@/components/ui/table";
// import Link from 'next/link';
// import { FolderOpen, Pencil, Plus, Trash2 } from "lucide-react";
// import { Dialog, DialogOverlay, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import Spinner from '@/components/Spinner';
// import { toast } from 'react-toastify';
// import { Input } from '@/components/ui/input';
// import { Switch } from '@/components/ui/switch';
// import { Textarea } from '@/components/ui/textarea';
// import withAuth from '@/lib/withAuth';
// import Image from 'next/image';


// const ViewCollections = () => {
//   const [collections, setCollections] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Dialog states
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedCollection, setSelectedCollection] = useState(null);

//   // States
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [editForm, setEditForm] = useState({
//     id: null,
//     name: "",
//     description:"",
//     image: "",
//     isActive: false,
//     isFeatured: false,
//   });

//   const fetchCollections = async () => {
//     try {
//       const res = await fetch("/api/collections"); // 🔁 your API route here
//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Failed to fetch collections");
//       setCollections(data || []);
//       console.log("Fetched collections:", data);

//     } catch (err) {
//       console.error("Error:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch collections from backend
//   useEffect(() => {
//     fetchCollections();
//   }, []);

//   // Open edit modal and pre-fill data
//   const handleEditOpen = (collection) => {
//     setEditForm({
//       id: collection.id,
//       slug: collection.slug,
//       name: collection.name,
//       description: collection.description,
//       image: collection.image || "/placeholder.jpg",
//       isActive: collection.isActive === 1,     // ✅
//       isFeatured: collection.isFeatured === 1, // ✅

//     });
//     setEditDialogOpen(true);
//   };

//   // Handle form update
//   const handleEditChange = (field, value) => {
//     setEditForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleUpdate = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("name", editForm.name);
//       formData.append("description", editForm.description);
//       formData.append("isActive", editForm.isActive);     // already 1/0 ✅
//       formData.append("isFeatured", editForm.isFeatured); // already 1/0 ✅


//       if (editForm.file) {
//         formData.append("image", editForm.file); // new image file
//       }

//       const res = await fetch(`/api/collections/${editForm.slug}`, {
//         method: "PUT",
//         body: formData,
//       });

//       if (!res.ok) throw new Error("Update failed");

//       toast.success("Collection updated successfully");
//       setEditDialogOpen(false);
//       fetchCollections();
//     } catch (err) {
//       toast.error(err.message);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       const res = await fetch(`/api/collections/${selectedCollection.slug}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Delete failed");

//       toast.success("Collection deleted successfully");
//       setDeleteDialogOpen(false);
//       fetchCollections();
//     } catch (err) {
//       toast.error(err.message);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-12">
//       <div className="max-w-6xl mx-auto">

//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-2">
//             <FolderOpen className="h-5 w-5 text-forest-700" />
//             <h1 className="text-3xl font-serif font-bold text-forest-800">Collections</h1>
//           </div>
//           <Button asChild className="bg-primary hover:bg-forest-800">
//             <Link href="/collections/addCollection" className="flex items-center gap-2">
//               <Plus className="h-4 w-4" /> Add Collection
//             </Link>
//           </Button>
//         </div>

//         {loading ? (
//             <Spinner />
//         ) : (
//         <div className="bg-white border border-forest-200 rounded-lg overflow-hidden">
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-[80px]">Image</TableHead>
//                   <TableHead>Collection Name</TableHead>
//                   <TableHead className="text-center">Products</TableHead>
//                   <TableHead className="text-center">Status</TableHead>
//                   <TableHead className="text-center">Featured</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {collections.map((collection) => (
//                   <TableRow key={collection.id}>
//                     <TableCell>
//                       <Image
//                         src={collection.image || "/placeholder.jpg"} // 1. Fallback image (agar url null ho)
//                         alt={collection.name}
//                         width={48}   // 2. w-12 = 48px
//                         height={48}  // 3. h-12 = 48px
//                         className="object-cover rounded" // 4. w-12 h-12 hata diya kyunki width/height prop de diya hai
//                       />
//                     </TableCell>
//                     <TableCell className="font-medium">{collection.name}</TableCell>
//                     <TableCell className="text-center">{collection.productCount}</TableCell>
//                     <TableCell className="text-center">
//                       {collection.isActive ? 'Active' : 'Inactive'}
//                     </TableCell>
//                     <TableCell className="text-center">
//                       {collection.isFeatured ? 'Featured' : 'Not Featured'}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex justify-end items-center gap-2">
//                         <Button variant="ghost" size="sm" onClick={() => handleEditOpen(collection)}>
//                         <Pencil className="h-4 w-4" />
//                       </Button>
//                       <Button variant="ghost" size="sm" onClick={() => { setSelectedCollection(collection); setDeleteDialogOpen(true); }}>
//                         <Trash2 className="h-4 w-4 text-red-500" />
//                       </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>

//           {collections.length === 0 && (
//             <div className="text-center py-8 text-forest-600">
//               No collections found. Create your first collection to get started.
//             </div>
//           )}
//         </div>
//         )}
//       </div>


//       {/* *** Edit Collection Dialog ****/}
//       <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen} className="mx-auto max-w-7xl fixed inset-0 z-50 flex items-center justify-center overflow-auto">
//         <DialogOverlay className="bg-black/50 backdrop-blur-sm fixed inset-0" />
//         <DialogContent className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
//           <DialogHeader>
//             <DialogTitle>Edit Collection</DialogTitle>
//           </DialogHeader>

//           {/* Image Upload */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Collection Image</label>

//             {/* Preview */}
//             <div className="relative w-24 h-24 mb-2">
//               <Image
//                 src={editForm.image || "/placeholder.jpg"}
//                 alt="Preview"
//                 fill
//                 className="object-cover rounded"
//               />
//             </div>

//             {/* File Input */}
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => {
//                 const file = e.target.files[0];
//                 if (file) {
//                   // Preview image
//                   const previewUrl = URL.createObjectURL(file);
//                   setEditForm((prev) => ({
//                     ...prev,
//                     image: previewUrl,
//                     file, // actual file for upload
//                   }));
//                 }
//               }}
//               className="block text-sm text-gray-600"
//             />
//           </div>


//           {/* Collection Name */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Name</label>
//             <Input
//               value={editForm.name}
//               onChange={(e) => handleEditChange("name", e.target.value)}
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Description</label>
//             <Textarea
//               rows={4}
//               value={editForm.description}
//               onChange={(e) => handleEditChange("description", e.target.value)}
//             />
//           </div>

//           {/* Status Switch */}
//           <div className="flex items-center justify-between mb-4">
//             <span className="text-sm font-medium text-gray-700">Active</span>
//             <Switch
//               checked={editForm.isActive}
//               onCheckedChange={(val) => handleEditChange("isActive", val ? 1 : 0)} // ✅ force 1/0
//             />
//           </div>

//           {/* Featured Switch */}
//           <div className="flex items-center justify-between mb-6">
//             <span className="text-sm font-medium text-gray-700">Featured</span>
//             <Switch
//               checked={editForm.isFeatured}
//               onCheckedChange={(val) => handleEditChange("isFeatured", val ? 1 : 0)} // ✅ force 1/0
//             />
//           </div>

//           <DialogFooter>
//             <Button onClick={handleUpdate} className="bg-primary">Save Changes</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Dialog */}
//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogOverlay className="bg-black/50 backdrop-blur-sm fixed inset-0" />
//         <DialogContent className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
//           <DialogHeader>
//             <DialogTitle>Delete Collection</DialogTitle>
//           </DialogHeader>
//           <p>Are you sure you want to delete &quot;{selectedCollection?.name}&quot;?</p>
//           <DialogFooter>
//             <Button variant="destructive" onClick={handleDelete}>Delete</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//     </div>
//   );
// }

// export default withAuth(ViewCollections, [1]);

"use client"
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import Link from 'next/link';
import {
  FolderOpen, Pencil, Plus, Trash2, Search, Upload, X
} from "lucide-react";
import {
  Dialog, DialogOverlay, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import Spinner from '@/components/Spinner';
import { toast } from 'react-toastify';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from "@/components/ui/badge"; // Make sure you have this component or use div
import withAuth from '@/lib/withAuth';
import Image from 'next/image';

const ViewCollections = () => {
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog States
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit Form State
  const [editForm, setEditForm] = useState({
    slug: "",
    name: "",
    description: "",
    image: "",
    file: null,
    isActive: false,
    isFeatured: false,
  });

  // 1. Fetch Data
  const fetchCollections = async () => {
    try {
      const res = await fetch("/api/collections?all=true");
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch");
      setCollections(data || []);
      setFilteredCollections(data || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // 2. Search Logic
  useEffect(() => {
    const lowerQ = searchQuery.toLowerCase();
    const filtered = collections.filter(c =>
      c.name.toLowerCase().includes(lowerQ)
    );
    setFilteredCollections(filtered);
  }, [searchQuery, collections]);

  // 3. Handlers
  const handleEditOpen = (collection) => {
    setEditForm({
      slug: collection.slug, // ID for update
      name: collection.name,
      description: collection.description || "",
      image: collection.image,
      file: null,
      isActive: collection.isActive,
      isFeatured: collection.isFeatured,
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("description", editForm.description);
      // Backend expects "1" or "0"
      formData.append("isActive", editForm.isActive ? "1" : "0");
      formData.append("isFeatured", editForm.isFeatured ? "1" : "0");

      if (editForm.file) {
        formData.append("image", editForm.file);
      }

      const res = await fetch(`/api/collections/${editForm.slug}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Updated successfully!");
      setEditDialogOpen(false);
      fetchCollections();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/collections/${selectedCollection.slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      setCollections(prev => prev.filter(c => c.slug !== selectedCollection.slug));
      toast.success("Deleted successfully");
      setDeleteDialogOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FolderOpen className="h-8 w-8 text-primary" />
            Collections
          </h1>
          <p className="text-gray-500 mt-1">Manage your product categories and catalogs</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 shadow-md">
          <Link href="/collections/addCollection">
            <Plus className="h-4 w-4 mr-2" /> Add New
          </Link>
        </Button>
      </div>

      {/* Filter & Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search collections..."
              className="pl-9 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center"><Spinner /></div>
        ) : filteredCollections.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <FolderOpen className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p>No collections found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[100px]">Thumbnail</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-center">Products</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCollections.map((col) => (
                <TableRow key={col.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      <Image
                        src={col.image || "/placeholder.jpg"}
                        alt={col.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-gray-900">{col.name}</div>
                    {col.isFeatured && (
                      <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-medium mt-1 inline-block">
                        Featured
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center bg-gray-100 text-gray-700 h-6 px-2 rounded-full text-xs font-medium">
                      {col.productCount}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {col.isActive ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600" onClick={() => handleEditOpen(col)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600"
                        onClick={() => { setSelectedCollection(col); setDeleteDialogOpen(true); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* --- Edit Dialog --- */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        {/* ✅ Change 1: max-h-[85vh] aur flex layout add kiya */}
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">

          {/* 1. Header (Fixed at Top) */}
          <div className="bg-gray-50 px-6 py-4 border-b shrink-0">
            <DialogHeader>
              <DialogTitle className="text-xl text-gray-900">Edit Collection</DialogTitle>
              <DialogDescription className="text-gray-500">
                Update the visual and status details for this collection.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* ✅ Change 2: overflow-y-auto add kiya taaki sirf ye part scroll ho */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">

            {/* 2. Modern Image Uploader */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Collection Thumbnail
              </label>

              <div className="flex flex-col gap-3">
                {/* Image Preview Banner */}
                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group shrink-0">
                  <Image
                    src={editForm.image || "/placeholder.jpg"}
                    alt="Preview"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Overlay Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label htmlFor="edit-upload-img" className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-gray-100 flex items-center gap-2 transition-transform hover:scale-105">
                      <Upload className="h-4 w-4" /> Change Image
                    </label>
                  </div>
                </div>

                {/* Hidden Input */}
                <input
                  id="edit-upload-img"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setEditForm(prev => ({
                        ...prev,
                        image: URL.createObjectURL(file),
                        file
                      }));
                    }
                  }}
                />
                <p className="text-[11px] text-gray-500 text-right">
                  Recommended size: 800x600px (JPG, PNG)
                </p>
              </div>
            </div>

            {/* 3. Form Fields */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-700">Collection Name</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="h-10"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Textarea
                  rows={6}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="resize-none min-h-[80px]"
                  placeholder="What is this collection about?"
                />
              </div>
            </div>

            {/* 4. Status Grid (Control Panel Look) */}
            <div className="grid grid-cols-2 gap-4">

              {/* Active Switch Card */}
              <div className={`
                flex flex-col gap-2 p-3 rounded-xl border transition-colors
                ${editForm.isActive ? 'border-green-200 bg-green-50/50' : 'border-gray-200 bg-gray-50'}
              `}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Visibility</span>
                  <Switch
                    checked={editForm.isActive}
                    onCheckedChange={(val) => setEditForm({ ...editForm, isActive: val })}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {editForm.isActive ? "Visible on store" : "Hidden from store"}
                </p>
              </div>

              {/* Featured Switch Card */}
              <div className={`
                flex flex-col gap-2 p-3 rounded-xl border transition-colors
                ${editForm.isFeatured ? 'border-purple-200 bg-purple-50/50' : 'border-gray-200 bg-gray-50'}
              `}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    Featured
                  </span>
                  <Switch
                    checked={editForm.isFeatured}
                    onCheckedChange={(val) => setEditForm({ ...editForm, isFeatured: val })}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {editForm.isFeatured ? "Promoted on Home" : "Standard listing"}
                </p>
              </div>

            </div>
          </div>

          {/* 5. Footer (Fixed at Bottom) */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t shrink-0">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="bg-white">
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isSaving} className="bg-primary hover:bg-primary/90 min-w-[100px]">
              {isSaving ? (
                <>Saving...</>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>

        </DialogContent>
      </Dialog>

      {/* --- Delete Dialog --- */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedCollection?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete Collection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default withAuth(ViewCollections, [1]);