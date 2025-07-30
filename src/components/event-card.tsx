import type { Event } from '@/lib/data';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag } from 'lucide-react';

export function EventCard({ event, onCardClick }: { event: Event; onCardClick: () => void; }) {
  return (
    <Card 
      className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card cursor-pointer"
      onClick={onCardClick}
    >
       <div className="relative w-full aspect-video">
        <Image
          src={event.images[0] || 'https://placehold.co/800x600.png'}
          alt={`Image for ${event.title}`}
          fill
          className="object-cover"
          data-ai-hint="event cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-xl capitalize">{event.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-1 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{event.date}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-foreground/80 line-clamp-3" style={{ maxWidth: '30ch' }}>{event.description}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 pt-4">
         <Badge variant="secondary" className="flex items-center gap-1.5">
           <Tag className="h-3 w-3" />
           {event.type}
         </Badge>
         <Badge variant="outline">{event.year}</Badge>
         <Badge variant="outline">{event.academicYear}</Badge>
      </CardFooter>
    </Card>
  );
}
