'use client';
import { useState, useMemo, useEffect, useTransition } from 'react';
import { EventCard } from '@/components/event-card';
import type { Event, EventType, AcademicYear } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EventDetailModal } from '@/components/event-detail-modal';
import { Button } from '@/components/ui/button';
import { getEvents, getEventTypes, getAcademicYears } from './data-actions';

const studentYears = ['All', 'Freshman', 'Sophomore', 'Junior', 'Senior'];
const ITEMS_PER_PAGE = 6;

export default function EventsPage() {
  const [eventType, setEventType] = useState('All');
  const [studentYear, setStudentYear] = useState('All');
  const [academicYear, setAcademicYear] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isPending, startTransition] = useTransition();

  const [events, setEvents] = useState<Event[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  
  useEffect(() => {
    startTransition(async () => {
      const [fetchedEvents, fetchedTypes, fetchedYears] = await Promise.all([
        getEvents(),
        getEventTypes(),
        getAcademicYears()
      ]);
      setEvents(fetchedEvents);
      setEventTypes(fetchedTypes);
      setAcademicYears(fetchedYears);
    });
  }, []);

  const { filteredEvents, availableEventTypes, availableAcademicYears } = useMemo(() => {
    const availableEventTypes = ['All', ...eventTypes.map(e => e.name)];
    const availableAcademicYears = ['All', ...academicYears.map(e => e.year)];

    const filtered = events.filter(event => {
      const typeMatch = eventType === 'All' || event.type === eventType;
      const studentYearMatch = studentYear === 'All' || event.year === studentYear;
      const academicYearMatch = academicYear === 'All' || event.academicYear === academicYear;
      const searchMatch = searchTerm === '' || event.title.toLowerCase().includes(searchTerm.toLowerCase()) || event.description.toLowerCase().includes(searchTerm.toLowerCase());
      return typeMatch && studentYearMatch && academicYearMatch && searchMatch;
    });

    return { filteredEvents: filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), availableEventTypes, availableAcademicYears };
  }, [eventType, studentYear, academicYear, searchTerm, events, eventTypes, academicYears]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [eventType, studentYear, academicYear, searchTerm]);

  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + ITEMS_PER_PAGE);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary">
            College Events
          </h1>
          <p className="mt-4 text-lg text-foreground/80 max-w-3xl mx-auto">
            Stay updated with the latest workshops, seminars, and social gatherings on campus.
          </p>
        </div>

        <div className="mb-10 p-4 bg-card border rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <Label htmlFor="search-events">Search Events</Label>
              <Input 
                id="search-events"
                placeholder="e.g. React Workshop"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger><SelectValue placeholder="Filter by type" /></SelectTrigger>
                <SelectContent>
                  {availableEventTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Student Year</Label>
              <Select value={studentYear} onValueChange={setStudentYear}>
                <SelectTrigger><SelectValue placeholder="Filter by year" /></SelectTrigger>
                <SelectContent>
                  {studentYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Academic Year</Label>
              <Select value={academicYear} onValueChange={setAcademicYear}>
                <SelectTrigger><SelectValue placeholder="Filter by academic year" /></SelectTrigger>
                <SelectContent>
                  {availableAcademicYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {isPending ? (
          <div className="text-center py-16">
            <p>Loading events...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.slice(0, visibleCount).map(event => (
                <EventCard key={event._id} event={event} onCardClick={() => setSelectedEvent(event)} />
              ))}
            </div>
            {visibleCount < filteredEvents.length && (
              <div className="text-center mt-12">
                <Button onClick={loadMore} size="lg">Load More</Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 rounded-lg bg-muted/50">
            <h2 className="text-2xl font-semibold font-headline text-foreground/80">No events found</h2>
            <p className="mt-2 text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      <EventDetailModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
}
