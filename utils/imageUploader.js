import { v2 as cloudinary } from "cloudinary";

export const uploadImageToCloudinary = async (
  file,
  folder,
  height,
  quality
) => {
  const options = { folder };

  if (quality) {
    options.quality = quality;
  }

  // Use the original temporary file path for upload
  options.resource_type = "auto";
  return await cloudinary.uploader.upload(file.tempFilePath, options);
};
