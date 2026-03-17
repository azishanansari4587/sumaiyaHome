"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { updateCatalogueAction } from "@/actions/catalogue";

const EditCatalogueModal = ({ isOpen, onClose, catalogue, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (catalogue) {
      setTitle(catalogue.title || "");
    }
  }, [catalogue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadStatus("Processing...");

    const formData = new FormData(e.target);
    const newImageFile = formData.get("image");
    const newPdfFile = formData.get("pdf");
    const updatedTitle = formData.get("title");

    try {
      let imageUrl = catalogue.imageUrl;
      let pdfUrl = catalogue.pdfUrl;

      // 1. Upload new Image if provided
      if (newImageFile && newImageFile.size > 0) {
        setUploadStatus("Uploading new image...");
        const imageRes = await uploadToCloudinary(newImageFile, "catalogues", "image");
        imageUrl = imageRes.secure_url;
      }

      // 2. Upload new PDF if provided
      if (newPdfFile && newPdfFile.size > 0) {
        setUploadStatus("Uploading new PDF (may take time for large files)...");
        const pdfRes = await uploadToCloudinary(newPdfFile, "catalogues", "raw");
        pdfUrl = pdfRes.secure_url;
      }

      // 3. Update Database
      setUploadStatus("Saving changes...");
      const result = await updateCatalogueAction({ 
        id: catalogue.id, 
        title: updatedTitle, 
        imageUrl, 
        pdfUrl 
      });
      
      if (!result.success) throw new Error(result.error);

      toast.success(result.message || "Catalogue updated successfully!");
      onUpdate(); // Refresh the list
      onClose();
    } catch (err) {
      console.error("Update process failed:", err);
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
      setUploadStatus("");
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

          <div className="flex flex-col gap-4 pt-4">
            {uploadStatus && (
              <p className="text-xs text-forest-600 animate-pulse font-medium text-center">
                {uploadStatus}
              </p>
            )}
            <DialogFooter className="sm:justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-primary hover:bg-forest-800">
                {loading ? "Processing..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCatalogueModal;
