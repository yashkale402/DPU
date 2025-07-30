'use server';

import { connectToDb } from '@/lib/db';
import { Event } from '@/lib/models';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { v2 as cloudinary } from 'cloudinary';
import type { Event as EventType } from '@/lib/data';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createEvent(data: Omit<EventType, '_id' | 'id'>) {
  try {
    await connectToDb();
    const newEvent = new Event(data);
    await newEvent.save();
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create event');
  }

  revalidatePath('/admin');
  revalidatePath('/events');
  redirect('/admin');
}

export async function updateEvent(id: string, data: Partial<EventType>) {
    try {
        await connectToDb();
        await Event.findByIdAndUpdate(id, data);
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
