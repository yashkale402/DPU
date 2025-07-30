export interface EventType {
    _id?: string;
    id?: string; // for client-side usage if needed
    name: 'Workshop' | 'Seminar' | 'Social' | 'Sports' | 'PTM' | string;
}

export interface ProjectCategory {
    _id?: string;
    id?: string;
    name: 'Engineering' | 'Arts' | 'Business' | 'Science' | string;
}

export interface AcademicYear {
    _id?: string;
    id?: string;
    year: '2024-2025' | '2023-2024' | string;
}

export interface Event {
    _id?: string;
    id?: string;
    title: string;
    date: string;
    description: string;
    type: EventType['name'];
    academicYear: AcademicYear['year'];
    year: 'All' | 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'F.Y.Bsc(CA)' | 'S.Y.BCA(Sci.)' | 'T.Y.BCA(Sci.)' | string;
    images: string[];
    links?: { title: string; url: string }[];
  }
  
  export interface Project {
    _id?: string;
    id?: string;
    title: string;
    students: string[];
    description: string;
    images: string[];
    category: ProjectCategory['name'];
    class: string;
    academicYear: AcademicYear['year'];
    liveLink?: string;
    otherLinks?: { title: string; url: string }[];
    date: string;
  }
