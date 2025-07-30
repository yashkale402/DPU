'use server'

import { connectToDb } from "@/lib/db";
import { AcademicYear, Project, ProjectCategory } from "@/lib/models";

export const getProjects = async () => {
    try {
        await connectToDb();
        const projects = await Project.find().sort({ date: -1 });
        return JSON.parse(JSON.stringify(projects));
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return [];
    }
}

export const getProjectCategories = async () => {
    try {
        await connectToDb();
        const categories = await ProjectCategory.find();
        return JSON.parse(JSON.stringify(categories));
    } catch (error) {
        console.error("Failed to fetch project categories:", error);
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
