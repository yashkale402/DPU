import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/data";
import Image from "next/image";
import { Calendar, Tag, Users, Folder, BookOpen, ExternalLink, Link as LinkIcon } from "lucide-react";

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl text-primary">{project.title}</DialogTitle>
           <div className="flex items-center gap-2 text-muted-foreground pt-2">
                <Users className="h-4 w-4" />
                <span>{project.students.join(', ')}</span>
            </div>
        </DialogHeader>

        <Carousel className="w-full">
          <CarouselContent>
            {project.images.map((img, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                  <Image src={img} alt={`${project.title} image ${index + 1}`} fill className="object-cover" data-ai-hint="project screenshot" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {project.images.length > 1 && (
            <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
            </>
          )}
        </Carousel>

        <div className="grid gap-6 py-4">
            <DialogDescription className="text-base text-foreground/80">
                {project.description}
            </DialogDescription>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2"><Folder className="h-4 w-4 text-primary" /> <strong>Category:</strong> <Badge variant="secondary">{project.category}</Badge></div>
                <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /> <strong>Class:</strong> {project.class}</div>
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> <strong>Date:</strong> {project.date}</div>
                <div className="flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /> <strong>Year:</strong> {project.academicYear}</div>
            </div>

            <div className="flex flex-wrap gap-4">
                {project.liveLink && (
                    <Button asChild>
                        <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2" />
                            View Live Project
                        </a>
                    </Button>
                )}
                {project.otherLinks && project.otherLinks.map(link => (
                    <Button asChild variant="outline" key={link.url}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                            <LinkIcon className="mr-2" />
                            {link.title}
                        </a>
                    </Button>
                ))}
            </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
