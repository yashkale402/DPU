'use server';

import { connectToDb } from '@/lib/db';
import { Project } from '@/lib/models';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { v2 as cloudinary } from 'cloudinary';
import type { Project as ProjectType } from '@/lib/data';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to extract year from academic year string
function extractYearFromAcademicYear(academicYear: string): number {
  if (!academicYear) return new Date().getFullYear();
  
  // Extract the first year from formats like "2024-2025" or "2024-25"
  const match = academicYear.match(/(\d{4})/);
  return match ? parseInt(match[1]) : new Date().getFullYear();
}

// Validation function for project data
function validateProjectData(data: Record<string, unknown>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (!data.description || typeof data.description !== 'string' || data.description.trim() === '') {
    errors.push('Description is required');
  }
  
  // Check for academicYear instead of year
  if (!data.academicYear || typeof data.academicYear !== 'string' || data.academicYear.trim() === '') {
    errors.push('Academic Year is required');
  } else {
    // Validate academic year format
    const yearMatch = data.academicYear.match(/(\d{4})/);
    if (!yearMatch) {
      errors.push('Academic Year must contain a valid year (e.g., 2024-2025)');
    } else {
      const year = parseInt(yearMatch[1]);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear + 10) {
        errors.push(`Academic Year must be between 1900 and ${currentYear + 10}`);
      }
    }
  }
  
  // Validate students array
  if (!data.students || !Array.isArray(data.students) || data.students.length === 0) {
    errors.push('At least one student is required');
  }
  
  // Validate category
  if (!data.category || typeof data.category !== 'string' || data.category.trim() === '') {
    errors.push('Category is required');
  }
  
  // Validate class
  if (!data.class || typeof data.class !== 'string' || data.class.trim() === '') {
    errors.push('Class is required');
  }
  
  // Validate date
  if (!data.date || typeof data.date !== 'string' || data.date.trim() === '') {
    errors.push('Date is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

interface FormStudent {
  name?: string;
}

interface FormImage {
  url?: string;
}

export type CreateProjectInput = ProjectType | (Omit<ProjectType, 'students' | 'images' | 'date'> & { students?: (FormStudent | string)[]; images?: (FormImage | string)[]; date?: string | Date });

export async function createProject(data: CreateProjectInput) {
  try {
    console.log('Received project data:', data);
    
    const dateValue = data.date;
    const dateStr = typeof dateValue === 'string' ? dateValue : (dateValue instanceof Date ? dateValue.toISOString() : new Date().toISOString());

    // Convert form data to database format
    const projectData = {
      ...data,
      students: Array.isArray(data.students) && data.students.length > 0 && typeof data.students[0] === 'object'
        ? (data.students as FormStudent[]).map((s) => s.name ?? '')
        : (data.students ?? []) as string[],
      images: Array.isArray(data.images) && data.images.length > 0 && typeof data.images[0] === 'object'
        ? (data.images as FormImage[]).map((img) => img.url ?? '')
        : (data.images ?? []) as string[],
      date: dateStr,
    };
    
    // Validate data before processing
    const validation = validateProjectData(projectData as Record<string, unknown>);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    // Ensure data is properly formatted and map academicYear to year for database
    const processedData = {
      ...projectData,
      title: projectData.title?.trim(),
      description: projectData.description?.trim(),
      category: projectData.category?.trim(),
      class: projectData.class?.trim(),
      academicYear: projectData.academicYear?.trim(),
      year: extractYearFromAcademicYear(projectData.academicYear), // Extract year for database
      date: projectData.date?.trim(),
      students: projectData.students || [],
      images: projectData.images || [],
      otherLinks: projectData.otherLinks || [],
      liveLink: projectData.liveLink?.trim() || '',
    };
    
    console.log('Processed project data:', processedData);
    
    await connectToDb();
    const newProject = new Project(processedData);
    const savedProject = await newProject.save();
    
    console.log('Project created successfully:', savedProject._id);
    
  } catch (error: unknown) {
    console.error('Create project error:', error);
    
    const err = error as Error & { name?: string; errors?: Record<string, { message?: string }> };
    if (error && typeof error === 'object' && 'name' in error) {
      if (err.name === 'ValidationError' && err.errors) {
        const validationErrors = Object.values(err.errors).map((e) => e?.message ?? '');
        throw new Error(`Database validation failed: ${validationErrors.join(', ')}`);
      }
      
      if (err.name === 'MongoError' || err.name === 'MongoServerError') {
        throw new Error('Database connection error. Please try again.');
      }
    }
    
    if (error && typeof error === 'object' && 'message' in error && typeof err.message === 'string' && err.message.includes('Validation failed:')) {
      throw error;
    }
    
    if (error && typeof error === 'object' && 'message' in error && typeof err.message === 'string') {
      throw new Error(`Failed to create project: ${err.message}`);
    }
    
    throw new Error('Failed to create project: Unknown error');
  }

  // Revalidate paths and redirect
  revalidatePath('/admin');
  revalidatePath('/student-corner');
  redirect('/admin');
}

export async function getProjectById(id: string) {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid project ID');
    }
    
    await connectToDb();
    const project = await Project.findById(id);
    
    if (!project) {
      console.log(`Project not found with ID: ${id}`);
      return null;
    }
    
    return JSON.parse(JSON.stringify(project));
  } catch (error: unknown) {
    console.error("Failed to fetch project:", error);
    
    if (error && typeof error === 'object' && 'name' in error && (error as Error & { name: string }).name === 'CastError') {
      console.error("Invalid project ID format:", id);
      return null;
    }
    
    return null;
  }
}

export type UpdateProjectInput = Partial<ProjectType> | (Partial<Omit<ProjectType, 'students' | 'images' | 'date'>> & { students?: (FormStudent | string)[]; images?: (FormImage | string)[]; date?: string | Date });

export async function updateProject(id: string, data: UpdateProjectInput) {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid project ID');
    }
    
    console.log('Updating project:', id, 'with data:', data);
    
    // Normalize form data to DB shape
    const normalized = {
      ...data,
      students: Array.isArray(data.students) && data.students.length > 0 && typeof data.students[0] === 'object'
        ? (data.students as FormStudent[]).map((s) => s.name ?? '')
        : data.students,
      images: Array.isArray(data.images) && data.images.length > 0 && typeof data.images[0] === 'object'
        ? (data.images as FormImage[]).map((img) => img.url ?? '')
        : data.images,
      date: data.date instanceof Date ? data.date.toISOString() : data.date,
    };
    
    // Validate partial data
    const errors: string[] = [];
    
    if (normalized.title !== undefined && (!normalized.title || normalized.title.trim() === '')) {
      errors.push('Title cannot be empty');
    }
    
    if (normalized.description !== undefined && (!normalized.description || normalized.description.trim() === '')) {
      errors.push('Description cannot be empty');
    }
    
    if (normalized.academicYear !== undefined && (!normalized.academicYear || normalized.academicYear.trim() === '')) {
      errors.push('Academic Year cannot be empty');
    }
    
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    
    // Process the data
    const processedData: Record<string, unknown> = {};
    Object.keys(normalized).forEach(key => {
      const val = normalized[key as keyof ProjectType];
      if (val !== undefined) {
        if (key === 'academicYear' || key === 'title' || key === 'description' || key === 'category' || key === 'class' || key === 'date' || key === 'liveLink') {
          processedData[key] = (val as string)?.trim();
        } else {
          processedData[key] = val;
        }
      }
    });
    
    await connectToDb();
    const updatedProject = await Project.findByIdAndUpdate(
      id, 
      processedData, 
      { new: true, runValidators: true }
    );
    
    if (!updatedProject) {
      throw new Error('Project not found');
    }
    
    console.log('Project updated successfully:', updatedProject._id);
    
  } catch (error: unknown) {
    console.error('Update project error:', error);
    
    const err = error as Error & { name?: string; errors?: Record<string, { message?: string }>; message?: string };
    if (error && typeof error === 'object' && 'name' in error) {
      if (err.name === 'ValidationError' && err.errors) {
        const validationErrors = Object.values(err.errors).map((e) => e?.message ?? '');
        throw new Error(`Database validation failed: ${validationErrors.join(', ')}`);
      }
      
      if (err.name === 'CastError') {
        throw new Error('Invalid project ID format');
      }
    }
    
    if (error && typeof error === 'object' && 'message' in error && typeof err.message === 'string' && err.message.includes('Validation failed:')) {
      throw error;
    }
    
    throw new Error(`Failed to update project: ${err.message ?? 'Unknown error'}`);
  }
  
  revalidatePath('/admin');
  revalidatePath('/student-corner');
  revalidatePath(`/admin/projects/${id}/edit`);
  redirect('/admin');
}

export async function deleteProject(projectId: string) {
  try {
    if (!projectId || typeof projectId !== 'string') {
      return { success: false, message: 'Invalid project ID' };
    }
    
    console.log('Deleting project:', projectId);
    
    await connectToDb();
    const deletedProject = await Project.findByIdAndDelete(projectId);
    
    if (!deletedProject) {
      return { success: false, message: 'Project not found' };
    }
    
    console.log('Project deleted successfully:', projectId);
    
    revalidatePath('/admin');
    revalidatePath('/student-corner');
    return { success: true, message: 'Project deleted successfully' };
    
  } catch (error: unknown) {
    console.error('Delete project error:', error);
    
    const err = error as Error & { name?: string; message?: string };
    if (error && typeof error === 'object' && 'name' in error && err.name === 'CastError') {
      return { success: false, message: 'Invalid project ID format' };
    }
    
    return { success: false, message: `Failed to delete project: ${error && typeof error === 'object' && 'message' in error ? err.message : 'Unknown error'}` };
  }
}

// Helper function to handle form data conversion
export async function createProjectFromFormData(formData: FormData) {
  try {
    const projectData: ProjectType = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      academicYear: formData.get('academicYear') as string,
      category: formData.get('category') as string,
      class: formData.get('class') as string,
      date: formData.get('date') as string,
      students: JSON.parse(formData.get('students') as string || '[]'),
      images: JSON.parse(formData.get('images') as string || '[]'),
      liveLink: formData.get('liveLink') as string || '',
      otherLinks: JSON.parse(formData.get('otherLinks') as string || '[]'),
      // Add other fields as needed based on your ProjectType interface
    };
    
    return await createProject(projectData);
  } catch (error) {
    console.error('Form data processing error:', error);
    throw error;
  }
}