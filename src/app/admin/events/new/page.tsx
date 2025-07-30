'use client';
import { EventForm } from "@/components/admin/event-form";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/lib/data";
import { createEvent } from "../actions";


export default function NewEventPage() {
    const { toast } = useToast();

    const handleFormSubmit = async (data: Event) => {
        try {
            await createEvent(data);
            toast({
                title: "Event Created",
                description: "The new event has been successfully created.",
            });
        } catch (error) {
             toast({
                title: "Error",
                description: "Failed to create event. Please try again.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="container mx-auto py-8 max-w-7xl">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold font-headline">Add New Event</h1>
                    <p className="text-muted-foreground">Fill in the details for the new event.</p>
                </div>
                <EventForm 
                    onSubmit={handleFormSubmit}
                    onCancelPath="/admin"
                />
            </div>
        </div>
    );
}
