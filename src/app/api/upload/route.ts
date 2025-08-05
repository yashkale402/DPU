import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "campus-connect",
          resource_type: "image",
          transformation: [
            { width: 1200, height: 800, crop: "limit" },
            { quality: "auto" }
          ]
        }, 
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
            return;
          }
          if (!result) {
            reject(new Error('Upload failed - no result returned'));
            return;
          }
          resolve(result);
        }
      ).end(buffer);
    });
    return result.secure_url;
}

export async function POST(request: Request) {
  try {
    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
      console.error('Cloudinary configuration missing');
      return NextResponse.json({ 
        error: 'Image upload service not configured. Please contact administrator.' 
      }, { status: 500 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Validate file types and sizes
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ 
          error: `Invalid file type: ${file.name}. Only images are allowed.` 
        }, { status: 400 });
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        return NextResponse.json({ 
          error: `File too large: ${file.name}. Maximum size is 10MB.` 
        }, { status: 400 });
      }
    }

    console.log(`Uploading ${files.length} file(s) to Cloudinary...`);
    const urls = await Promise.all(files.map(file => uploadImage(file)));
    console.log(`Successfully uploaded ${urls.length} file(s)`);

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Upload failed:', error);
    
    let errorMessage = 'Upload failed';
    if (error instanceof Error) {
      if (error.message.includes('Invalid image file')) {
        errorMessage = 'Invalid image file format';
      } else if (error.message.includes('File size')) {
        errorMessage = 'File size too large';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error during upload';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
