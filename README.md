# Dr. D. Y. Patil Arts, Commerce & Science College Portal

A modern web application built with Next.js 15 for managing college events and showcasing student projects at Dr. D. Y. Patil Arts, Commerce & Science College.

## 🎯 Project Overview

This portal serves as a central hub for college activities, providing students and faculty with easy access to:
- **Event Management**: Discover and manage college events, workshops, seminars, and social gatherings
- **Student Showcase**: Browse and showcase student projects across different categories and academic years
- **Administrative Tools**: Comprehensive admin panel for content management

## ✨ Features

### 🎪 Event Management
- **Event Discovery**: Browse events filtered by type, academic year, and date
- **Event Details**: Comprehensive event information with images and external links
- **Event Types**: Categorized events (workshops, seminars, cultural events, etc.)
- **Academic Year Filtering**: Filter events by specific academic years

### 📚 Student Projects
- **Project Showcase**: Display student projects with detailed descriptions
- **Category-based Organization**: Projects organized by categories (Web Development, AI/ML, etc.)
- **Multi-media Support**: Support for project images and live demo links
- **Student Attribution**: Proper crediting of student contributors
- **Class and Year Filtering**: Filter projects by class and academic year

### 🔧 Admin Panel
- **Event Management**: Create, edit, and delete events
- **Project Management**: Manage student project submissions
- **Category Management**: Manage event types and project categories
- **Academic Year Management**: Manage academic year configurations
- **Image Upload**: Cloudinary integration for image management

### 🎨 User Experience
- **Responsive Design**: Mobile-first responsive design using Tailwind CSS
- **Modern UI**: Built with Radix UI components and shadcn/ui
- **Dark/Light Theme**: Theme switching capability
- **Interactive Components**: Modals, dropdowns, and form validations
- **Toast Notifications**: User feedback for actions

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library

### Backend & Database
- **MongoDB**: NoSQL database with Mongoose ODM
- **Next.js API Routes**: Server-side API endpoints
- **Cloudinary**: Image storage and optimization

### Development Tools
- **ESLint**: Code linting and formatting
- **TypeScript**: Static type checking
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation
- **Date-fns**: Date manipulation utilities

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel pages
│   │   ├── events/        # Event management
│   │   └── projects/      # Project management
│   ├── api/               # API routes
│   ├── events/            # Public event pages
│   ├── login/             # Authentication
│   └── student-corner/    # Student project showcase
├── components/            # Reusable components
│   ├── admin/            # Admin-specific components
│   └── ui/               # UI component library
├── lib/                  # Utilities and configurations
│   ├── models.ts         # Database models
│   ├── db.ts            # Database connection
│   └── utils.ts         # Utility functions
└── hooks/               # Custom React hooks
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yashkale402/DPU.git
   cd DPU
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📊 Database Schema

### Events
- Title, date, description
- Event type and academic year
- Multiple images and external links
- Timestamps for creation/updates

### Projects
- Title, student names, description
- Project category and class information
- Multiple images and demo links
- Academic year and submission date

### Configuration
- Event types (workshops, seminars, etc.)
- Project categories (web dev, AI/ML, etc.)
- Academic years (2023-2024, 2024-2025, etc.)

## 🎨 UI Components

The project uses a comprehensive design system built on:
- **Radix UI**: Accessible, unstyled components
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Pre-built component variants
- **Custom Components**: College-specific UI elements

### Key Components
- Event and Project Cards
- Admin Forms with Validation
- Image Upload Components
- Data Tables with Sorting/Filtering
- Modal Dialogs
- Toast Notifications

## 🔐 Admin Features

### Authentication
- Secure login system
- Protected admin routes
- Session management

### Content Management
- CRUD operations for events and projects
- Bulk image upload and management
- Category and type management
- Academic year configuration

### Data Validation
- Form validation using Zod schemas
- Type-safe API endpoints
- Error handling and user feedback

## 🌐 Deployment

The application is designed to be deployed on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Traditional hosting** with Node.js support

### Environment Variables for Production
Ensure all environment variables are properly configured in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint configuration provided
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## 🐛 Known Issues & Troubleshooting

### Common Issues
1. **MongoDB Connection**: Ensure your MongoDB URI is correct and accessible
2. **Image Upload**: Verify Cloudinary credentials are properly configured
3. **Build Errors**: Run `npm run typecheck` to identify TypeScript issues

### Performance Optimization
- Images are optimized through Cloudinary
- Components are lazy-loaded where appropriate
- Database queries are optimized with proper indexing

## 📄 License

This project is developed for Dr. D. Y. Patil Arts, Commerce & Science College. All rights reserved.

## 👥 Team

- **Developer**: Yash Kale
- **Institution**: Dr. D. Y. Patil Arts, Commerce & Science College

## 📞 Support

For technical support or feature requests, please:
1. Open an issue on GitHub
2. Contact the development team
3. Check the documentation for common solutions

---

**Built with ❤️ for Dr. D. Y. Patil Arts, Commerce & Science College**
