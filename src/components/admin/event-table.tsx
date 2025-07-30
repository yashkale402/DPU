'use client';

import { useState, useTransition } from 'react';
import { MoreHorizontal, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
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

import type { Event } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { deleteEvent } from '@/app/admin/events/actions';

const ITEMS_PER_PAGE = 10;

interface EventTableProps {
  initialEvents: Event[];
}

export function EventTable({ initialEvents }: EventTableProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEvents = events.slice(startIndex, endIndex);

  const handleDelete = (eventId: string) => {
    startTransition(async () => {
      const result = await deleteEvent(eventId);
      if (result.success) {
        setEvents(events.filter(event => event._id !== eventId));
        toast({
            title: "Event Deleted",
            description: "The event has been successfully deleted.",
        });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  const handleEdit = (eventId: string) => {
    router.push(`/admin/events/${eventId}/edit`);
  };

  return (
    <>
      <div className='text-right mb-4'>
        <Button size="sm" className="gap-1" onClick={() => router.push('/admin/events/new')}>
          <PlusCircle className="h-4 w-4" />
          Add Event
        </Button>
      </div>
      <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentEvents.length === 0 && !isPending ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">No events found.</TableCell>
                </TableRow>
              ) : isPending ? (
                <TableRow><TableCell colSpan={4} className="text-center">Processing...</TableCell></TableRow>
              ) : (
                currentEvents.map(event => (
                  <TableRow key={event._id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{event.type}</Badge>
                    </TableCell>
                    <TableCell>{format(new Date(event.date), 'PPP')}</TableCell>
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
                          <DropdownMenuItem onSelect={() => handleEdit(event._id!)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleDelete(event._id!)}>Delete</DropdownMenuItem>
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
