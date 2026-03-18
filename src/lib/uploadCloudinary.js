// utils/uploadToCloudinary.js
import axios from "axios";

export async function uploadToCloudinary(file, folder ="SumaiyaHome", resourceType="image", onProgress) {

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dp5e3rgbl";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "NuzratCarpet";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset); // Cloudinary unsigned preset
    formData.append("folder", folder);


    const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    console.log(`Uploading to Cloudinary: ${url}`);
    
    try {
      const res = await axios.post(url, formData, {
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        // Remove manual Content-Type to let axios set it with boundary
        onUploadProgress: (event) => {
          if (onProgress && event.total) {
            const progress = Math.round((event.loaded * 100) / event.total);
            onProgress(progress);
          }
        },
      });
      console.log("Cloudinary upload successful:", res.data.secure_url);
      return res.data;
    } catch (error) {
      console.error("Cloudinary upload error details:", error.response?.data || error.message);
      throw error;
    }
}
  