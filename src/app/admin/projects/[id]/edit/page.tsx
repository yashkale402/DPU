import { getProjectById, updateProject } from '@/app/admin/projects/actions';
import { ProjectForm } from '@/components/admin/project-form';
import { notFound } from 'next/navigation';
import type { Project } from '@/lib/data';

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const projectId = params.id;
  const project = await getProjectById(projectId);

  if (!project) {
    notFound();
  }

  const handleUpdateProject = async (data: Project) => {
    'use server';
    return updateProject(projectId, data);
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-headline">Edit Project</h1>
          <p className="text-muted-foreground">Update the details for this student project.</p>
        </div>
        <ProjectForm
          project={project}
          onSubmit={handleUpdateProject}
          onCancelPath="/admin"
        />
      </div>
    </div>
  );
}
