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


import type { EventType } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { addEventType, deleteEventType } from './data-actions';

interface EventTypeTableProps {
  initialEventTypes: EventType[];
}

export function EventTypeTable({ initialEventTypes }: EventTypeTableProps) {
  const { toast } = useToast();
  const [newTypeName, setNewTypeName] = useState('');
  const [isPending, startTransition] = useTransition();
  const [eventTypes, setEventTypes] = useState<EventType[]>(initialEventTypes);

  const handleDelete = (typeId: string) => {
    startTransition(async () => {
      const result = await deleteEventType(typeId);
      if (result.success) {
        setEventTypes(eventTypes.filter(et => et._id !== typeId));
        toast({
            title: "Event Type Deleted",
            description: "The event type has been successfully deleted.",
        });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  const handleAdd = () => {
    if (newTypeName.trim() === '') {
        toast({
            title: "Error",
            description: "Event type name cannot be empty.",
            variant: "destructive"
        });
        return;
    }
    startTransition(async () => {
      try {
        const newEventType = await addEventType(newTypeName.trim());
        setEventTypes([...eventTypes, newEventType]);
        setNewTypeName('');
        toast({
            title: "Event Type Added",
            description: "The new event type has been successfully added.",
        });
      } catch (error) {
        toast({ title: "Error", description: "Failed to add event type.", variant: "destructive" });
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
                    Add Event Type
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Add New Event Type</AlertDialogTitle>
                <AlertDialogDescription>
                    Enter the name for the new event type.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <Input 
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    placeholder="e.g. Conference"
                />
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleAdd} disabled={isPending}>
                  {isPending ? 'Adding...' : 'Add'}
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
              {eventTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center h-24">No event types found.</TableCell>
                </TableRow>
              ) : (
                eventTypes.map(eventType => (
                  <TableRow key={eventType._id}>
                    <TableCell className="font-medium">{eventType.name}</TableCell>
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
                          <DropdownMenuItem onSelect={() => handleDelete(eventType._id!)} disabled={isPending}>Delete</DropdownMenuItem>
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
