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

import type { AcademicYear } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { addAcademicYear, deleteAcademicYear } from './data-actions';

interface AcademicYearTableProps {
  initialAcademicYears: AcademicYear[];
}

export function AcademicYearTable({ initialAcademicYears }: AcademicYearTableProps) {
  const { toast } = useToast();
  const [newYear, setNewYear] = useState('');
  const [isPending, startTransition] = useTransition();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(initialAcademicYears);
  
  const handleDelete = (yearId: string) => {
    startTransition(async () => {
      const result = await deleteAcademicYear(yearId);
      if (result.success) {
        setAcademicYears(academicYears.filter(ay => ay._id !== yearId));
        toast({
            title: "Academic Year Deleted",
            description: "The academic year has been successfully deleted.",
        });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive"})
      }
    });
  };

  const handleAdd = () => {
    if (!/^\d{4}-\d{4}$/.test(newYear)) {
        toast({
            title: "Error",
            description: "Please enter a valid year format (e.g., 2025-2026).",
            variant: "destructive"
        });
        return;
    }
    startTransition(async () => {
      try {
        const newAcademicYear = await addAcademicYear(newYear);
        setAcademicYears([...academicYears, newAcademicYear]);
        setNewYear('');
        toast({
            title: "Academic Year Added",
            description: "The new academic year has been successfully added.",
        });
      } catch (error) {
        toast({ title: "Error", description: "Failed to add academic year.", variant: "destructive" });
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
                    Add Academic Year
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Add New Academic Year</AlertDialogTitle>
                <AlertDialogDescription>
                    Enter the year in YYYY-YYYY format.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <Input 
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    placeholder="e.g. 2025-2026"
                />
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleAdd} disabled={isPending}>{isPending ? "Adding..." : "Add"}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {academicYears.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">No academic years found.</TableCell>
                </TableRow>
              ) : (
                academicYears.map(academicYear => (
                  <TableRow key={academicYear._id}>
                    <TableCell className="font-medium">{academicYear.year}</TableCell>
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
                          <DropdownMenuItem onSelect={() => handleDelete(academicYear._id!)} disabled={isPending}>Delete</DropdownMenuItem>
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
