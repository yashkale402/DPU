import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({folder: "campus-connect"}, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }).end(buffer);
    });
    return result.secure_url;
  }

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const urls = await Promise.all(files.map(file => uploadImage(file)));

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
