'use server'

import { connectToDb } from "@/lib/db";
import { AcademicYear, Event, EventType } from "@/lib/models";

export const getEvents = async () => {
    try {
        await connectToDb();
        const events = await Event.find().sort({ date: -1 });
        return JSON.parse(JSON.stringify(events));
    } catch (error) {
        console.error("Failed to fetch events:", error);
        return [];
    }
}

export const getEventTypes = async () => {
    try {
        await connectToDb();
        const eventTypes = await EventType.find();
        return JSON.parse(JSON.stringify(eventTypes));
    } catch (error) {
        console.error("Failed to fetch event types:", error);
        return [];
    }
}

export const getAcademicYears = async () => {
    try {
        await connectToDb();
        const academicYears = await AcademicYear.find();
        return JSON.parse(JSON.stringify(academicYears));
    } catch (error) {
        console.error("Failed to fetch academic years:", error);
        return [];
    }
}
