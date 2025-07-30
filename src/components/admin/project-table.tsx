'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { MoreHorizontal, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

import type { Project } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { deleteProject } from '@/app/admin/projects/actions';

const ITEMS_PER_PAGE = 10;

interface ProjectTableProps {
  initialProjects: Project[];
}

export function ProjectTable({ initialProjects }: ProjectTableProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, endIndex);

  const handleDelete = (projectId: string) => {
    startTransition(async () => {
      const result = await deleteProject(projectId);
      if (result.success) {
        setProjects(projects.filter(project => project._id !== projectId));
        toast({
            title: "Project Deleted",
            description: "The project has been successfully deleted.",
        });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  const handleEdit = (projectId: string) => {
    router.push(`/admin/projects/${projectId}/edit`);
  };

  return (
    <>
      <div className='text-right mb-4'>
        <Button size="sm" className="gap-1" onClick={() => router.push('/admin/projects/new')}>
          <PlusCircle className="h-4 w-4" />
          Add Project
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  Image
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">Year</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProjects.length === 0 && !isPending ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">No projects found.</TableCell>
                </TableRow>
              ) : isPending ? (
                 <TableRow><TableCell colSpan={6} className="text-center">Processing...</TableCell></TableRow>
              ) : (
                currentProjects.map(project => (
                  <TableRow key={project._id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt="Project image"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={project.images[0]}
                        width="64"
                        data-ai-hint="project thumbnail"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>{project.students.join(', ')}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{project.academicYear}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => handleEdit(project._id!)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleDelete(project._id!)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages || 1))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </>
  );
}
