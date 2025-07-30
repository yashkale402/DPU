'use client';
import { ProjectForm } from "@/components/admin/project-form";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/lib/data";
import { createProject } from "../actions";

export default function NewProjectPage() {
    const { toast } = useToast();

    const handleFormSubmit = async (data: Project) => {
         try {
            await createProject(data);
            toast({
                title: "Project Created",
                description: "The new project has been successfully created.",
            });
        } catch (error) {
             toast({
                title: "Error",
                description: "Failed to create project. Please try again.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="container mx-auto py-8 max-w-7xl">
            <div className="max-w-2xl mx-auto">
                 <div className="mb-6">
                    <h1 className="text-3xl font-bold font-headline">Add New Project</h1>
                    <p className="text-muted-foreground">Fill in the details for the new project.</p>
                </div>
                <ProjectForm
                    onSubmit={handleFormSubmit}
                    onCancelPath="/admin"
                />
            </div>
        </div>
    );
}
