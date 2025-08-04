'use server';

import { connectToDb } from '@/lib/db';
import { Event } from '@/lib/models';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createEvent(data: any) {
  try {
    await connectToDb();
    
    // Convert form data to database format
    const eventData = {
      ...data,
      date: typeof data.date === 'string' ? data.date : data.date.toISOString(),
      images: Array.isArray(data.images) && data.images.length > 0 && typeof data.images[0] === 'object' 
        ? data.images.map((img: any) => img.url) 
        : data.images
    };
    
    const newEvent = new Event(eventData);
    await newEvent.save();
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create event');
  }

  revalidatePath('/admin');
  revalidatePath('/events');
  redirect('/admin');
}

export async function updateEvent(id: string, data: any) {
    try {
        await connectToDb();
        
        // Convert form data to database format
        const eventData = {
          ...data,
          date: typeof data.date === 'string' ? data.date : data.date?.toISOString(),
          images: Array.isArray(data.images) && data.images.length > 0 && typeof data.images[0] === 'object' 
            ? data.images.map((img: any) => img.url) 
            : data.images
        };
        
        await Event.findByIdAndUpdate(id, eventData);
    } catch (error) {
        console.error(error);
        throw new Error('Failed to update event');
    }

    revalidatePath('/admin');
    revalidatePath('/events');
    revalidatePath(`/admin/events/${id}/edit`);
    redirect('/admin');
}


export async function getEventById(id: string) {
    try {
        await connectToDb();
        const event = await Event.findById(id);
        if (!event) return null;
        return JSON.parse(JSON.stringify(event));
    } catch (error) {
        console.error("Failed to fetch event:", error);
        return null;
    }
}


export async function deleteEvent(eventId: string) {
    try {
        await connectToDb();
        await Event.findByIdAndDelete(eventId);
        revalidatePath('/admin');
        revalidatePath('/events');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to delete event' };
    }
}
