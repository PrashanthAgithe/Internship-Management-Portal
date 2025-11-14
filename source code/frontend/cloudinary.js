export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/raw/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (data.secure_url) {
    return data.secure_url; // correct URL for PDFs
  } else {
    throw new Error("Cloudinary upload failed: " + JSON.stringify(data));
  }
};
