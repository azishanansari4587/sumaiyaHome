"use client"
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ImageIcon, Plus, Trash2, Pencil, Upload, X } from "lucide-react";
import Spinner from '@/components/Spinner';
import Image from 'next/image';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { toast } from 'react-toastify';
import withAuth from '@/lib/withAuth';
import { uploadToCloudinary } from "@/lib/uploadCloudinary";

const Banner = () => {
  
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ─── Delete states ───────────────────────────────────────
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Edit states ─────────────────────────────────────────
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [bannerToEdit, setBannerToEdit] = useState(null); // { id, name, imageUrl }
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState(null); // { url, uploading, progress }
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch("/api/banners");
        const data = await res.json();
        setBanners(Array.isArray(data) ? data : data.banners || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBanners();
  }, []);

  // ─── Delete handlers ──────────────────────────────────────
  const openDeleteModal = (id) => {
    setBannerToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!bannerToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/banners/${bannerToDelete}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to delete banner");
      setBanners((prev) => prev.filter((b) => b.id !== bannerToDelete));
      toast.success("Banner deleted successfully");
      setDeleteDialogOpen(false);
      setBannerToDelete(null);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Edit handlers ────────────────────────────────────────
  const openEditModal = (banner) => {
    setBannerToEdit(banner);
    setEditName(banner.name || "");
    setEditImage(null); // reset — keep current image unless user uploads new one
    setEditDialogOpen(true);
  };

  const handleEditImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = { url: URL.createObjectURL(file), uploading: true, progress: 0 };
    setEditImage(preview);

    try {
      const uploaded = await uploadToCloudinary(file, "SumaiyaHome", "image", (progress) => {
        setEditImage((prev) => ({ ...prev, progress, uploading: progress < 100 }));
      });
      setEditImage({ url: uploaded.secure_url, uploading: false, progress: 100 });
      URL.revokeObjectURL(preview.url);
    } catch (err) {
      console.error("Image upload error:", err);
      setEditImage(null);
      toast.error("❌ Image upload failed");
    }
  };

  const confirmEdit = async () => {
    if (!editName.trim()) {
      toast.error("⚠️ Banner name cannot be empty");
      return;
    }
    if (editImage?.uploading) {
      toast.error("⏳ Please wait, image is still uploading");
      return;
    }

    setIsSaving(true);
    try {
      const body = {
        name: editName.trim(),
        ...(editImage?.url ? { imageUrl: editImage.url } : {}),
      };

      const res = await fetch(`/api/banners/${bannerToEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update banner");

      // Update local state
      setBanners((prev) =>
        prev.map((b) =>
          b.id === bannerToEdit.id
            ? { ...b, name: editName.trim(), imageUrl: editImage?.url || b.imageUrl }
            : b
        )
      );

      toast.success("✅ Banner updated successfully!");
      setEditDialogOpen(false);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-forest-700" />
            <h1 className="text-3xl font-serif font-bold text-forest-800">Banners</h1>
          </div>
          <Button asChild className="bg-primary hover:bg-forest-800">
            <Link href="/banners/add_banners" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Banner
            </Link>
          </Button>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="relative w-full rounded-md overflow-hidden border border-gray-300 group bg-white shadow-sm"
              >
                {/* Image */}
                <div className="relative w-full pt-[75%]">
                  <Image
                    src={banner.imageUrl || "/placeholder.jpg"}
                    alt={banner.name || `Banner ${banner.id}`}
                    fill
                    className="object-cover"
                  />

                  {/* Hover action buttons */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => openEditModal(banner)}
                      className="bg-white/90 hover:bg-white p-2 rounded-full text-primary shadow-sm"
                      title="Edit Banner"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(banner.id)}
                      className="bg-white/90 hover:bg-white p-2 rounded-full text-red-500 shadow-sm"
                      title="Delete Banner"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Banner Name */}
                <div className="px-3 py-2 bg-white border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {banner.name || <span className="text-gray-400 italic">No name</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Delete Confirmation Dialog ─────────────────── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Banner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this banner? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Edit Banner Dialog ──────────────────────────── */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>
              Update the banner name or replace the image.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Name input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g. Summer Sale Banner"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>

            {/* Current image preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Image
              </label>

              {/* Show new upload or existing image */}
              <div className="relative w-full aspect-[16/6] rounded-md border border-gray-200 overflow-hidden bg-gray-50">
                <Image
                  src={editImage?.url || bannerToEdit?.imageUrl || "/placeholder.jpg"}
                  alt="Banner preview"
                  fill
                  className="object-cover rounded-md"
                />

                {/* Upload progress overlay */}
                {editImage?.uploading && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                    <div className="w-3/4 bg-gray-200 h-2 rounded-full">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${editImage.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Remove new upload */}
                {editImage && !editImage.uploading && (
                  <button
                    type="button"
                    onClick={() => setEditImage(null)}
                    className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Upload new image button */}
              <div className="mt-2 relative inline-block overflow-hidden">
                <Button type="button" variant="outline" size="sm" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" /> Replace Image
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageUpload}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={editImage?.uploading}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Leave unchanged to keep the current image</p>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="button" onClick={confirmEdit} disabled={isSaving || editImage?.uploading}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default withAuth(Banner, [1]);