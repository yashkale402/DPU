import mongoose from 'mongoose';

const eventTypeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
});

const projectCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
});

const academicYearSchema = new mongoose.Schema({
    year: { type: String, required: true, unique: true, match: /^\d{4}-\d{4}$/ },
});

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    academicYear: { type: String, required: true },
    year: { type: String, required: true },
    images: [{ type: String }],
    links: [{ title: String, url: String }],
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    students: [{ type: String, required: true }],
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    category: { type: String, required: true },
    class: { type: String, required: true },
    year: { type: Number, required: true },
    academicYear: { type: String, required: true },
    liveLink: { type: String },
    otherLinks: [{ title: String, url: String }],
    date: { type: String, required: true },
}, { timestamps: true });

export const EventType = mongoose.models.EventType || mongoose.model('EventType', eventTypeSchema);
export const ProjectCategory = mongoose.models.ProjectCategory || mongoose.model('ProjectCategory', projectCategorySchema);
export const AcademicYear = mongoose.models.AcademicYear || mongoose.model('AcademicYear', academicYearSchema);
export const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
