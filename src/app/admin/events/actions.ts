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
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      throw new Error('Database configuration missing. Please check environment variables.');
    }

    await connectToDb();
    
    // Validate required fields
    if (!data.title || !data.date || !data.description || !data.type || !data.academicYear) {
      throw new Error('Missing required fields. Please fill in all required information.');
    }

    // Convert form data to database format
    const eventData = {
      ...data,
      date: typeof data.date === 'string' ? data.date : data.date.toISOString(),
      images: Array.isArray(data.images) && data.images.length > 0 && typeof data.images[0] === 'object' 
        ? data.images.map((img: any) => img.url).filter(url => url && url.trim() !== '') 
        : (data.images || []).filter((url: string) => url && url.trim() !== '')
    };

    // Ensure at least one image is provided
    if (!eventData.images || eventData.images.length === 0) {
      throw new Error('At least one image is required for the event.');
    }
    
    console.log('Creating event with data:', eventData);
    const newEvent = new Event(eventData);
    await newEvent.save();
    console.log('Event created successfully:', newEvent._id);
  } catch (error) {
    console.error('Error creating event:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('validation failed')) {
        throw new Error('Validation failed. Please check all required fields are properly filled.');
      } else if (error.message.includes('duplicate key')) {
        throw new Error('An event with similar details already exists.');
      } else if (error.message.includes('connection')) {
        throw new Error('Database connection failed. Please try again later.');
      } else {
        throw error;
      }
    }
    
    throw new Error('Failed to create event. Please try again.');
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
