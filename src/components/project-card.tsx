import type { Project } from '@/lib/data';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Folder, BookOpen } from 'lucide-react';

export function ProjectCard({ project, onCardClick }: { project: Project; onCardClick: () => void; }) {
  return (
    <Card 
        className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card cursor-pointer"
        onClick={onCardClick}
    >
      <div className="relative w-full aspect-video">
        <Image
          src={project.images[0] || 'https://placehold.co/800x600.png'}
          alt={`Image for ${project.title}`}
          fill
          className="object-cover"
          data-ai-hint="student project"
        />
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-xl capitalize">{project.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-1 text-muted-foreground">
          <User className="h-4 w-4" />
          <span className='capitalize'>{project.students.join(', ')}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-foreground/80 line-clamp-3" style={{ maxWidth: '30ch' }}>{project.description}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between gap-2 pt-4">
        <Badge variant="secondary" className="flex items-center gap-1.5">
          <Folder className="h-3 w-3" />
          {project.category}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1.5">
          <BookOpen className="h-3 w-3" />
          {project.class} - {project.academicYear}
        </Badge>
      </CardFooter>
    </Card>
  );
}
