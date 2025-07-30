"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon, PlusCircle, X, Upload } from "lucide-react"
import Image from "next/image"
import React, { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"


import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { Event, EventType, AcademicYear } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { getEventTypes, getAcademicYears } from "./data-actions"
import { useToast } from "@/hooks/use-toast"

const eventFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters.").max(100),
  date: z.date({ required_error: "A date is required." }),
  description: z.string().max(10000, "Description must be 10,000 characters or less.").min(10, "Description must be at least 10 characters."),
  type: z.string({required_error: "Please select an event type."}),
  year: z.enum(["All", "Freshman", "Sophomore", "Junior", "Senior"]),
  academicYear: z.string({required_error: "Please select an academic year."}),
  images: z.array(z.object({ url: z.string().url("Must be a valid URL or data URI.") })).min(1, "At least one image is required."),
  links: z.array(z.object({ title: z.string().min(1, "Link title cannot be empty."), url: z.string().url("Must be a valid URL.") })).optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>

interface EventFormProps {
  event?: Event;
  onSubmit: (data: any) => Promise<void>;
  onCancelPath: string;
}

export function EventForm({ event, onSubmit, onCancelPath }: EventFormProps) {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    startTransition(async () => {
      const [fetchedTypes, fetchedYears] = await Promise.all([
        getEventTypes(),
        getAcademicYears()
      ]);
      setEventTypes(fetchedTypes);
      setAcademicYears(fetchedYears);
    });
  }, []);

  const defaultValues: Partial<EventFormValues> = event
    ? { 
        ...event,
        date: new Date(event.date),
        images: event.images.map(url => ({ url })),
      }
    : {
        title: "",
        description: "",
        year: "All",
        images: [],
        links: [],
      };

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    name: "images",
    control: form.control,
  });

  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
    name: "links",
    control: form.control,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const formData = new FormData();
      for (const file of files) {
          formData.append('files', file);
      }
      
      startTransition(async () => {
        try {
          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          const data = await res.json();
          if (data.urls) {
            data.urls.forEach((url: string) => appendImage({ url }));
          }
          toast({ title: 'Success', description: 'Images uploaded successfully.'})
        } catch (error) {
          toast({ title: 'Error', description: 'Image upload failed.', variant: 'destructive'})
        }
      });
    }
  };


  const handleSubmit = (data: EventFormValues) => {
    startTransition(async () => {
      const payload = {
        ...data,
        date: format(data.date, "MMMM d, yyyy"),
        images: data.images.map(img => img.url),
      };
      await onSubmit(payload);
    })
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="capitalize">Event Details</CardTitle>
            <CardDescription>Provide the core information about the event.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Annual Tech Summit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about the event"
                      className="resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {eventTypes.map(type => (
                            <SelectItem key={type._id} value={type.name}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Year</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select target audience" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Freshman">Freshman</SelectItem>
                        <SelectItem value="Sophomore">Sophomore</SelectItem>
                        <SelectItem value="Junior">Junior</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="academicYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a year" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {academicYears.map(year => (
                            <SelectItem key={year._id} value={year.year}>{year.year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="capitalize">Event Images</CardTitle>
            <CardDescription>Add images by URL or upload them from your device.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imageFields.map((field, index) => (
                <div key={field.id} className="relative group aspect-video">
                    <FormField
                        control={form.control}
                        name={`images.${index}.url`}
                        render={({ field: imageField }) => (
                        <FormItem className="h-full">
                            <FormControl>
                                <div className="h-full w-full">
                                    <Input {...imageField} value={imageField.value || ''} placeholder="https://placehold.co/800x600.png" className="h-full" />
                                    {imageField.value && (
                                        <Image
                                            src={imageField.value}
                                            alt={`Preview ${index + 1}`}
                                            fill
                                            className="object-cover rounded-md pointer-events-none"
                                        />
                                    )}
                                </div>
                            </FormControl>
                        </FormItem>
                        )}
                    />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex flex-col gap-2 aspect-video">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full h-1/2 flex flex-col items-center justify-center"
                    onClick={() => appendImage({ url: '' })}
                    >
                    <PlusCircle className="h-6 w-6 text-muted-foreground" />
                    <span className="mt-1 text-xs text-muted-foreground">Add by URL</span>
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                />
                <Button
                    type="button"
                    variant="outline"
                    className="w-full h-1/2 flex flex-col items-center justify-center"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isPending}
                    >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="mt-1 text-xs text-muted-foreground">{isPending ? "Uploading..." : "Upload"}</span>
                </Button>
              </div>
            </div>
             {form.formState.errors.images && <p className="text-sm font-medium text-destructive">{form.formState.errors.images?.root?.message || form.formState.errors.images.message}</p>}
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="capitalize">More Info Links</CardTitle>
                <CardDescription>Add any relevant links for the event (e.g., registration, brochure).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {linkFields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-4">
                         <FormField
                            control={form.control}
                            name={`links.${index}.title`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel className="sr-only">Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Link Title (e.g. Registration)" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`links.${index}.url`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel className="sr-only">URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="mt-2"
                            onClick={() => removeLink(index)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendLink({ title: '', url: '' })}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Link
                </Button>
            </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => router.push(onCancelPath)} disabled={isPending}>Cancel</Button>
            <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : (event ? "Save Changes" : "Create Event")}</Button>
        </div>
      </form>
    </Form>
  )
}
