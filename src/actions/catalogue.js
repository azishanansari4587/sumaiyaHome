"use server";

import connection from "@/lib/connection";
import { uploadToCloudinary } from "@/lib/uploadCloudinary";
import { revalidatePath } from "next/cache";

export async function uploadCatalogueAction(formData) {
  try {
    const title = formData.get("title");
    const image = formData.get("image");
    const pdf = formData.get("pdf");

    if (!title || !image || !pdf) {
      return { success: false, error: "All fields are required" };
    }

    // ✅ Upload image
    const imageUpload = await uploadToCloudinary(image, "catalogues", "image");

    // ✅ Upload PDF
    const pdfUpload = await uploadToCloudinary(pdf, "catalogues", "raw"); // 👈 raw for PDF

    // ✅ Insert into DB
    await connection.execute(
      "INSERT INTO catalogues (title, image, pdf) VALUES (?, ?, ?)",
      [title, imageUpload.secure_url, pdfUpload.secure_url]
    );

    revalidatePath("/(admin)/catalogue");
    revalidatePath("/catalogue");

    return { success: true, message: "Catalogue uploaded successfully" };
  } catch (err) {
    console.error("Catalogue upload error:", err);
    return { success: false, error: "Internal server error" };
  }
}

export async function updateCatalogueAction(id, formData) {
  try {
    const title = formData.get("title");
    const image = formData.get("image");
    const pdf = formData.get("pdf");
    const currentImageUrl = formData.get("currentImageUrl");
    const currentPdfUrl = formData.get("currentPdfUrl");

    let imageUrl = currentImageUrl;
    let pdfUrl = currentPdfUrl;

    // ✅ If new image provided, upload it
    if (image && image.size > 0) {
      const imageUpload = await uploadToCloudinary(image, "catalogues", "image");
      imageUrl = imageUpload.secure_url;
    }

    // ✅ If new PDF provided, upload it
    if (pdf && pdf.size > 0) {
      const pdfUpload = await uploadToCloudinary(pdf, "catalogues", "raw");
      pdfUrl = pdfUpload.secure_url;
    }

    // ✅ Update in DB
    await connection.execute(
      "UPDATE catalogues SET title = ?, image = ?, pdf = ? WHERE id = ?",
      [title, imageUrl, pdfUrl, id]
    );

    revalidatePath("/(admin)/catalogue");
    revalidatePath("/catalogue");

    return { success: true, message: "Catalogue updated successfully" };
  } catch (err) {
    console.error("Catalogue update error:", err);
    return { success: false, error: "Internal server error" };
  }
}
