import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { env } from "@/lib/config/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const cloudinaryClient = cloudinary;

export function cloudinaryTransformationUrl(publicId: string, options: Record<string, string | number | boolean>) {
  return cloudinary.url(publicId, { secure: true, ...options });
}

export async function uploadImageBuffer(input: {
  buffer: Buffer;
  folder: string;
  filename: string;
}): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: input.folder,
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        filename_override: input.filename,
        colors: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve(result);
      },
    );
    stream.end(input.buffer);
  });
}
