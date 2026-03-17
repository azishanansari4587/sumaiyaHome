"use server";

import connection from "@/lib/connection";
import { revalidatePath } from "next/cache";

/**
 * Saves a new catalogue record to the database.
 * The files (image and PDF) should be uploaded on the client side first.
 */
export async function saveCatalogueAction({ title, imageUrl, pdfUrl }) {
  try {
    if (!title || !imageUrl || !pdfUrl) {
      return { success: false, error: "Title, Image, and PDF are all required" };
    }

    // ✅ Insert into DB
    await connection.execute(
      "INSERT INTO catalogues (title, image, pdf) VALUES (?, ?, ?)",
      [title, imageUrl, pdfUrl]
    );

    revalidatePath("/(admin)/catalogue");
    revalidatePath("/catalogue");

    return { success: true, message: "Catalogue saved successfully" };
  } catch (err) {
    console.error("Save Catalogue Error:", err);
    return { success: false, error: "Internal server error" };
  }
}

/**
 * Updates an existing catalogue record in the database.
 * If new files were provided, they should be uploaded on the client side first.
 */
export async function updateCatalogueAction({ id, title, imageUrl, pdfUrl }) {
  try {
    if (!id || !title || !imageUrl || !pdfUrl) {
      return { success: false, error: "Missing required fields" };
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
    console.error("Update Catalogue Error:", err);
    return { success: false, error: "Internal server error" };
  }
}
