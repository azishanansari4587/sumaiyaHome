"use client"
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ImageIcon, Plus, Trash2 } from "lucide-react";
import Spinner from '@/components/Spinner';
import Image from 'next/image';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog"; // ✅ DialogDescription add kiya
import { toast } from 'react-toastify';
import withAuth from '@/lib/withAuth';

const Banner = () => {
  
  // Mock collections data
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ Delete Dialog States
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); // Spinner dikhane ke liye button pe

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

  // ✅ 1. Yeh function ab sirf Dialog kholega
  const openDeleteModal = (id) => {
    setBannerToDelete(id);
    setDeleteDialogOpen(true);
  };

  // ✅ 2. Yeh function actual API call karega jab user "Confirm" karega
  const confirmDelete = async () => {
    if (!bannerToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/banners/${bannerToDelete}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Failed to delete banner");

      // UI update
      setBanners((prev) => prev.filter((banner) => banner.id !== bannerToDelete));
      toast.success("Banner deleted successfully");
      
      // Dialog close kar do
      setDeleteDialogOpen(false);
      setBannerToDelete(null);

    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsDeleting(false);
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
              className="relative w-full pt-[100%] rounded-md overflow-hidden border border-gray-300 group"
            >
              <Image
                src={banner.imageUrl || "/placeholder.jpg"}
                alt={`Banner ${banner.id}`}
                fill
                className="object-cover rounded-md"
              />

              {/* ✅ Button ab openDeleteModal call karega */}
              <button
                onClick={() => openDeleteModal(banner.id)}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* ✅ Shadcn Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Banner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this banner? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default withAuth(Banner, [1]);