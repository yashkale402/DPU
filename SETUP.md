# DPU Event Management System - Setup Guide

## Quick Fix for "Failed to add event" Error

The main issue is **missing environment variables**. Follow these steps to fix it:

### Step 1: Configure Environment Variables

1. The `.env.local` file has been created in your project root
2. You need to add your actual database and image upload service credentials

### Step 2: Set up MongoDB Database

**Option A: MongoDB Atlas (Recommended - Free)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user
5. Get your connection string
6. Add it to `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dpu_events
```

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use local connection:
```env
MONGODB_URI=mongodb://localhost:27017/dpu_events
```

### Step 3: Set up Cloudinary (Image Upload Service)

1. Go to [Cloudinary](https://cloudinary.com)
2. Create a free account
3. Go to your dashboard
4. Copy your credentials and add to `.env.local`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 4: Complete .env.local File

Your `.env.local` should look like this:
```env
# Database Configuration
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/dpu_events

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here
```

### Step 5: Restart the Application

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 6: Initialize Database Data

Before creating events, you need to add some basic data:

1. Go to `http://localhost:3000/admin`
2. Add Event Types (e.g., "Workshop", "Seminar", "Competition")
3. Add Academic Years (e.g., "2023-2024", "2024-2025")
4. Now you can create events!

## Verification Steps

Run this command to check your setup:
```bash
node setup-env.js
```

All items should show ✅ (green checkmarks).

## Common Issues and Solutions

### Issue 1: "Database configuration missing"
- **Cause**: MONGODB_URI not set or incorrect
- **Solution**: Add correct MongoDB connection string to `.env.local`

### Issue 2: "Image upload service not configured"  
- **Cause**: Cloudinary credentials missing
- **Solution**: Add Cloudinary credentials to `.env.local`

### Issue 3: Empty dropdowns for Event Type/Academic Year
- **Cause**: No data in database
- **Solution**: Go to admin panel and add Event Types and Academic Years first

### Issue 4: "At least one image is required"
- **Cause**: No images provided in the form
- **Solution**: Either upload images or provide image URLs

## Testing the Fix

1. Make sure all environment variables are set
2. Restart the development server
3. Go to `http://localhost:3000/admin`
4. Click "Add Event"
5. Fill out the form completely
6. Add at least one image
7. Submit the form

The event should now be created successfully!

## Need Help?

If you're still having issues:
1. Check the browser console (F12 → Console tab)
2. Check the terminal where `npm run dev` is running
3. Run `node setup-env.js` to verify configuration
4. Make sure you've restarted the server after changing `.env.local`

## Free Service Recommendations

- **Database**: MongoDB Atlas (500MB free)
- **Image Storage**: Cloudinary (25GB free)
- Both services are more than sufficient for development and small projects.
