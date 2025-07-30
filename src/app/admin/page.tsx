import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventTable } from '@/components/admin/event-table';
import { ProjectTable } from '@/components/admin/project-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EventTypeTable } from '@/components/admin/event-type-table';
import { ProjectCategoryTable } from '@/components/admin/project-category-table';
import { AcademicYearTable } from '@/components/admin/academic-year-table';
import { getAcademicYears, getEvents, getEventTypes, getProjectCategories, getProjects } from '@/components/admin/data-actions';

export default async function AdminPage() {
  const [
    events,
    projects,
    eventTypes,
    projectCategories,
    academicYears,
  ] = await Promise.all([
    getEvents(),
    getProjects(),
    getEventTypes(),
    getProjectCategories(),
    getAcademicYears(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight capitalize font-headline text-primary">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your campus events and student projects.</p>
      </div>
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="flex w-full overflow-scroll justify-between">
          <TabsTrigger value="events">Manage Events</TabsTrigger>
          <TabsTrigger value="projects">Manage Student Corner</TabsTrigger>
          <TabsTrigger value="event-types">Event Types</TabsTrigger>
          <TabsTrigger value="project-categories">Project Categories</TabsTrigger>
          <TabsTrigger value="academic-years">Academic Years</TabsTrigger>
        </TabsList>
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle className="capitalize">Events</CardTitle>
              <CardDescription>Manage your campus events.</CardDescription>
            </CardHeader>
            <CardContent>
              <EventTable initialEvents={events} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle className="capitalize">Student Corner</CardTitle>
              <CardDescription>Manage student projects.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectTable initialProjects={projects} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="event-types">
            <Card>
                <CardHeader>
                    <CardTitle className="capitalize">Event Types</CardTitle>
                    <CardDescription>Manage the types of events available.</CardDescription>
                </CardHeader>
                <CardContent>
                    <EventTypeTable initialEventTypes={eventTypes} />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="project-categories">
            <Card>
                <CardHeader>
                    <CardTitle className="capitalize">Project Categories</CardTitle>
                    <CardDescription>Manage the categories for student projects.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProjectCategoryTable initialProjectCategories={projectCategories} />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="academic-years">
            <Card>
                <CardHeader>
                    <CardTitle className="capitalize">Academic Years</CardTitle>
                    <CardDescription>Manage the academic years for events and projects.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AcademicYearTable initialAcademicYears={academicYears} />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
