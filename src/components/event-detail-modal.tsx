import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "@/lib/data";
import Image from "next/image";
import { Calendar, Tag, Link as LinkIcon } from "lucide-react";

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailModal({ event, isOpen, onClose }: EventDetailModalProps) {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl text-primary capitalize">{event.title}</DialogTitle>
           <div className="flex items-center gap-4 text-muted-foreground pt-2">
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{event.date}</span>
            </div>
            <span>&bull;</span>
            <span>{event.academicYear}</span>
           </div>
        </DialogHeader>

        <Carousel className="w-full">
          <CarouselContent>
            {event.images.map((img, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                  <Image src={img} alt={`${event.title} image ${index + 1}`} fill className="object-cover" data-ai-hint="event photo" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
           {event.images.length > 1 && (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          )}
        </Carousel>

        <div className="grid gap-4 py-4">
            <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center gap-1.5">
                    <Tag className="h-3 w-3" />
                    {event.type}
                </Badge>
                <Badge variant="outline">{event.year}</Badge>
            </div>
            <DialogDescription className="text-base text-foreground/80">
                {event.description}
            </DialogDescription>

            {event.links && event.links.length > 0 && (
                <div>
                    <h3 className="font-semibold text-lg mb-2">More Info</h3>
                    <div className="flex flex-col gap-2 items-start">
                        {event.links.map(link => (
                            <Button asChild variant="link" key={link.url} className="p-0 h-auto">
                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                    <LinkIcon className="mr-2" />
                                    {link.title}
                                </a>
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
