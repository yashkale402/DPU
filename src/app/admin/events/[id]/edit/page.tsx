import { getEventById } from '@/app/admin/events/actions';
import { EventForm } from '@/components/admin/event-form';
import { updateEvent } from '@/app/admin/events/actions';
import { notFound } from 'next/navigation';

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const eventId = params.id;
  const event = await getEventById(eventId);

  if (!event) {
    notFound();
  }

  const handleUpdateEvent = async (data: any) => {
    'use server';
    return updateEvent(eventId, data);
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-headline">Edit Event</h1>
          <p className="text-muted-foreground">Update the details for the event.</p>
        </div>
        <EventForm
          event={event}
          onSubmit={handleUpdateEvent}
          onCancelPath="/admin"
        />
      </div>
    </div>
  );
}
