"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import withAuth from "@/lib/withAuth";

import { saveCatalogueAction } from "@/actions/catalogue";
import { uploadToCloudinary } from "@/lib/uploadCloudinary";

const  AddCatalogue = () => {
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadStatus("Uploading image...");

    const formData = new FormData(e.target);
    const title = formData.get("title");
    const imageFile = formData.get("image");
    const pdfFile = formData.get("pdf");

    try {
      // 1. Upload Image
      const imageRes = await uploadToCloudinary(imageFile, "catalogues", "image");
      const imageUrl = imageRes.secure_url;
      
      // 2. Upload PDF
      setUploadStatus("Uploading PDF (this may take a while for large files)...");
      const pdfRes = await uploadToCloudinary(pdfFile, "catalogues", "raw");
      const pdfUrl = pdfRes.secure_url;

      // 3. Save to Database
      setUploadStatus("Saving to database...");
      const result = await saveCatalogueAction({ title, imageUrl, pdfUrl });
      
      if (!result.success) throw new Error(result.error);

      toast.success(result.message || "Catalogue uploaded successfully!");
      e.target.reset();
    } catch (err) {
      console.error("Upload process failed:", err);
      toast.error(err.message || "Upload failed");
    } finally {
      setLoading(false);
      setUploadStatus("");
    }
  };

  return (
    <div className="container mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-4">Add Catalogue</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="title" placeholder="Catalogue Title" required />

        <label className="block">
          <span className="text-sm">Upload Catalogue Image</span>
          <Input type="file" name="image" accept="image/*" required />
        </label>

        <label className="block">
          <span className="text-sm">Upload Catalogue PDF</span>
          <Input type="file" name="pdf" accept="application/pdf" required />
        </label>

        {uploadStatus && (
          <p className="text-sm text-forest-600 animate-pulse font-medium">
            {uploadStatus}
          </p>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Upload Catalogue"}
        </Button>
      </form>
    </div>
  );
}

export default withAuth(AddCatalogue, [1]);
