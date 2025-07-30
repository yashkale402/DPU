'use server';

import { connectToDb } from "@/lib/db";
import { AcademicYear, Event, EventType, Project, ProjectCategory } from "@/lib/models";
import { revalidatePath } from "next/cache";

// Academic Year Actions
export const getAcademicYears = async () => {
    try {
        await connectToDb();
        const years = await AcademicYear.find();
        return JSON.parse(JSON.stringify(years));
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const addAcademicYear = async (year: string) => {
    try {
        await connectToDb();
        const newYear = new AcademicYear({ year });
        await newYear.save();
        revalidatePath('/admin');
        return JSON.parse(JSON.stringify(newYear));
    } catch (error) {
        console.error(error);
        throw new Error('Failed to add academic year');
    }
}

export const deleteAcademicYear = async (id: string) => {
    try {
        await connectToDb();
        await AcademicYear.findByIdAndDelete(id);
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to delete academic year' };
    }
}


// Event Type Actions
export const getEventTypes = async () => {
    try {
        await connectToDb();
        const types = await EventType.find();
        return JSON.parse(JSON.stringify(types));
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const addEventType = async (name: string) => {
    try {
        await connectToDb();
        const newType = new EventType({ name });
        await newType.save();
        revalidatePath('/admin');
        return JSON.parse(JSON.stringify(newType));
    } catch (error) {
        console.error(error);
        throw new Error('Failed to add event type');
    }
}

export const deleteEventType = async (id: string) => {
    try {
        await connectToDb();
        await EventType.findByIdAndDelete(id);
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to delete event type' };
    }
}


// Project Category Actions
export const getProjectCategories = async () => {
    try {
        await connectToDb();
        const categories = await ProjectCategory.find();
        return JSON.parse(JSON.stringify(categories));
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const addProjectCategory = async (name: string) => {
    try {
        await connectToDb();
        const newCategory = new ProjectCategory({ name });
        await newCategory.save();
        revalidatePath('/admin');
        return JSON.parse(JSON.stringify(newCategory));
    } catch (error) {
        console.error(error);
        throw new Error('Failed to add project category');
    }
}

export const deleteProjectCategory = async (id: string) => {
    try {
        await connectToDb();
        await ProjectCategory.findByIdAndDelete(id);
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to delete project category' };
    }
}

// Event Actions
export const getEvents = async () => {
    try {
        await connectToDb();
        const events = await Event.find().sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(events));
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Project Actions
export const getProjects = async () => {
    try {
        await connectToDb();
        const projects = await Project.find().sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(projects));
    } catch (error) {
        console.error(error);
        return [];
    }
}