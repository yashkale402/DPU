'use client';

import { useState, useTransition } from 'react';
import { MoreHorizontal, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import type { ProjectCategory } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { addProjectCategory, deleteProjectCategory } from './data-actions';

interface ProjectCategoryTableProps {
  initialProjectCategories: ProjectCategory[];
}

export function ProjectCategoryTable({ initialProjectCategories }: ProjectCategoryTableProps) {
  const { toast } = useToast();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<ProjectCategory[]>(initialProjectCategories);

  const handleDelete = (categoryId: string) => {
    startTransition(async () => {
      const result = await deleteProjectCategory(categoryId);
      if (result.success) {
        setCategories(categories.filter(cat => cat._id !== categoryId));
        toast({
            title: "Project Category Deleted",
            description: "The project category has been successfully deleted.",
        });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  const handleAdd = () => {
    if (newCategoryName.trim() === '') {
        toast({
            title: "Error",
            description: "Category name cannot be empty.",
            variant: "destructive"
        });
        return;
    }
    startTransition(async () => {
      try {
        const newCategory = await addProjectCategory(newCategoryName.trim());
        setCategories([...categories, newCategory]);
        setNewCategoryName('');
        toast({
            title: "Project Category Added",
            description: "The new project category has been successfully added.",
        });
      } catch (error) {
        toast({ title: "Error", description: "Failed to add project category.", variant: "destructive" });
      }
    });
  };


  return (
    <>
      <div className='text-right mb-4'>
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="sm" className="gap-1">
                    <PlusCircle className="h-4 w-4" />
                    Add Category
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Add New Project Category</AlertDialogTitle>
                <AlertDialogDescription>
                    Enter the name for the new project category.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <Input 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Health & Wellness"
                />
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleAdd} disabled={isPending}>
                  {isPending ? "Adding..." : "Add"}
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">No project categories found.</TableCell>
                </TableRow>
              ) : (
                categories.map(category => (
                  <TableRow key={category._id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
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
                          <DropdownMenuItem onSelect={() => handleDelete(category._id!)} disabled={isPending}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
      </div>
    </>
  );
}
