import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookMarked, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center justify-center mb-8">
            <Icons.logo className="h-56 w-56" />
             <h1 className="font-headline text-2xl font-bold tracking-tight text-primary sm:text-3xl lg:text-4xl ">
                Dr. D. Y. Patil Arts, Commerce & Science College
             </h1>
          </div>
          <p className="mt-6 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
            Your central hub for college events and student achievements. Discover what's happening and celebrate the brilliant work of your peers.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-4">
            <Button asChild size="lg">
              <Link href="/events">
                Explore Events <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent/90 hover:text-accent-foreground">
              <Link href="/student-corner">See Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
                  <Card className="bg-card">
                      <CardHeader>
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <CalendarDays className="h-6 w-6" />
                          </div>
                          <CardTitle className="font-headline mt-4">Discover Events</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="text-foreground/80">
                              Find workshops, seminars, and social gatherings. Filter by your interests and academic year to get involved.
                          </p>
                      </CardContent>
                  </Card>
                  <Card className="bg-card">
                      <CardHeader>
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <BookMarked className="h-6 w-6" />
                          </div>
                          <CardTitle className="font-headline mt-4">Student Showcase</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="text-foreground/80">
                              Explore innovative projects from students across all disciplines. See what your peers are creating and achieving.
                          </p>
                      </CardContent>
                  </Card>
              </div>
          </div>
      </section>
    </div>
  );
}
