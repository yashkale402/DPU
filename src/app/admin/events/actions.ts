'use server';

import { connectToDb } from '@/lib/db';
import { Event } from '@/lib/models';
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface EventFormData {
  title: string;
  date: string | Date;
  description: string;
  type: string;
  academicYear: string;
  year?: string;
  images: string[] | { url: string }[];
  links?: { title: string; url: string }[];
}

export async function createEvent(data: EventFormData): Promise<{ success: boolean; message: string }> {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      return {
        success: false,
        message: 'Database configuration missing. Please check environment variables.',
      };
    }

    await connectToDb();
    
    // Validate required fields
    if (!data.title || !data.date || !data.description || !data.type || !data.academicYear) {
      return {
        success: false,
        message: 'Missing required fields. Please fill in all required information.',
      };
    }

    // Convert form data to database format
    const rawImages = Array.isArray(data.images) && data.images.length > 0 && typeof data.images[0] === 'object'
      ? (data.images as { url: string }[]).map((img) => img.url)
      : (data.images as string[] | undefined) ?? [];
    const images = rawImages.filter((url): url is string => typeof url === 'string' && url.trim() !== '');

    const eventData = {
      ...data,
      date: typeof data.date === 'string' ? data.date : data.date.toISOString(),
      images,
    };

    // Ensure at least one image is provided
    if (!eventData.images || eventData.images.length === 0) {
      return {
        success: false,
        message: 'At least one image is required for the event.',
      };
    }
    
    console.log('Creating event with data:', eventData);
    const newEvent = new Event(eventData);
    await newEvent.save();
    console.log('Event created successfully:', newEvent._id);

    // Revalidate caches after successful creation
    revalidatePath('/admin');
    revalidatePath('/events');

    return {
      success: true,
      message: 'Event created successfully.',
    };
  } catch (error) {
    console.error('Error creating event:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('validation failed')) {
        return {
          success: false,
          message: 'Validation failed. Please check all required fields are properly filled.',
        };
      } else if (error.message.includes('duplicate key')) {
        return {
          success: false,
          message: 'An event with similar details already exists.',
        };
      } else if (error.message.includes('connection')) {
        return {
          success: false,
          message: 'Database connection failed. Please try again later.',
        };
      } else {
        return {
          success: false,
          message: error.message || 'Failed to create event. Please try again.',
        };
      }
    }
    
    return {
      success: false,
      message: 'Failed to create event. Please try again.',
    };
  }
}

export async function updateEvent(id: string, data: EventFormData) {
    try {
        await connectToDb();

        // Convert form data to database format
        const eventData = {
          ...data,
          date: typeof data.date === 'string' ? data.date : data.date?.toISOString?.() ?? '',
          images: Array.isArray(data.images) && data.images.length > 0 && typeof data.images[0] === 'object'
            ? (data.images as { url: string }[]).map((img) => img.url)
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
