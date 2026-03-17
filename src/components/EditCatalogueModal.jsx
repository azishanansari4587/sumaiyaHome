"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { updateCatalogueAction } from "@/actions/catalogue";

const EditCatalogueModal = ({ isOpen, onClose, catalogue, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (catalogue) {
      setTitle(catalogue.title || "");
    }
  }, [catalogue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    // Add current URLs as fallbacks
    formData.append("currentImageUrl", catalogue.imageUrl);
    formData.append("currentPdfUrl", catalogue.pdfUrl);

    try {
      const result = await updateCatalogueAction(catalogue.id, formData);
      
      if (!result.success) throw new Error(result.error);

      toast.success(result.message || "Catalogue updated successfully!");
      onUpdate(); // Refresh the list
      onClose();
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!catalogue) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Catalogue</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Catalogue Title</label>
            <Input 
              name="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Catalogue Title" 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block">
              Update Image <span className="text-xs text-gray-500">(Optional)</span>
            </label>
            <Input type="file" name="image" accept="image/*" />
            <p className="text-[10px] text-gray-500 leading-none">Current: {catalogue.imageUrl.split('/').pop()}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block">
              Update PDF <span className="text-xs text-gray-500">(Optional)</span>
            </label>
            <Input type="file" name="pdf" accept="application/pdf" />
             <p className="text-[10px] text-gray-500 leading-none">Current: {catalogue.pdfUrl.split('/').pop()}</p>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-forest-800">
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCatalogueModal;
