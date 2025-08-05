# DPU Event Management - Troubleshooting Guide

## "Failed to add event" Error - Common Causes and Solutions

### 1. Environment Variables Not Configured ❌

**Problem**: Missing or incorrect environment variables
**Symptoms**: 
- "Database configuration missing" error
- "Image upload service not configured" error
- Console shows "MONGODB_URI: Not set"

**Solution**:
1. Create/edit `.env.local` file in project root
2. Add required variables:
```env
MONGODB_URI=mongodb://localhost:27017/dpu_events
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
3. Restart the development server: `npm run dev`

### 2. Database Connection Issues ❌

**Problem**: Cannot connect to MongoDB
**Symptoms**:
- "Error connecting to database" message
- "Network error connecting to database"

**Solutions**:
- **Local MongoDB**: Ensure MongoDB is running locally
- **MongoDB Atlas**: Check connection string format and credentials
- **Network**: Verify internet connection for cloud databases

### 3. Image Upload Failures ❌

**Problem**: Cloudinary not configured or file issues
**Symptoms**:
- "Image upload failed" error
- "Invalid file type" or "File too large" messages

**Solutions**:
- Configure Cloudinary credentials in `.env.local`
- Ensure image files are under 10MB
- Use supported formats: JPG, PNG, GIF, WebP

### 4. Form Validation Errors ❌

**Problem**: Required fields missing or invalid data
**Symptoms**:
- "Missing required fields" error
- "At least one image is required" message

**Solutions**:
- Fill all required fields: Title, Date, Description, Type, Academic Year
- Add at least one image (URL or upload)
- Ensure dates are valid
- Check that event type and academic year exist in database

### 5. Database Schema Issues ❌

**Problem**: Missing event types or academic years
**Symptoms**:
- Empty dropdowns for Type or Academic Year
- Validation errors on form submission

**Solutions**:
1. Access admin panel
2. Add Event Types and Academic Years first
3. Then create events

## Quick Diagnostic Steps

### Step 1: Check Environment Variables
```bash
node setup-env.js
```

### Step 2: Check Database Connection
1. Open browser developer tools
2. Go to Network tab
3. Try creating an event
4. Look for failed API calls

### Step 3: Check Console Logs
1. Open browser developer tools
2. Go to Console tab
3. Look for error messages

### Step 4: Check Server Logs
1. Look at terminal where `npm run dev` is running
2. Check for database connection errors
3. Look for Cloudinary configuration errors

## Common Error Messages and Solutions

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Database configuration missing" | MONGODB_URI not set | Add MONGODB_URI to .env.local |
| "Image upload service not configured" | Cloudinary not configured | Add Cloudinary credentials to .env.local |
| "At least one image is required" | No images provided | Add at least one image URL or upload |
| "Missing required fields" | Form validation failed | Fill all required form fields |
| "Failed to create event" | Generic error | Check console logs for specific error |

## Environment Setup Checklist

- [ ] `.env.local` file exists in project root
- [ ] `MONGODB_URI` is configured
- [ ] `CLOUDINARY_CLOUD_NAME` is configured  
- [ ] `CLOUDINARY_API_KEY` is configured
- [ ] `CLOUDINARY_API_SECRET` is configured
- [ ] MongoDB database is accessible
- [ ] Event Types exist in database
- [ ] Academic Years exist in database
- [ ] Development server restarted after env changes

## Getting Help

If you're still experiencing issues:

1. Run the setup script: `node setup-env.js`
2. Check the browser console for detailed error messages
3. Verify all environment variables are correctly set
4. Ensure MongoDB is running and accessible
5. Test Cloudinary credentials in their dashboard

## Development Commands

```bash
# Install dependencies
npm install

# Run setup check
node setup-env.js

# Start development server
npm run dev

# Check for TypeScript errors
npm run typecheck

# Run linting
npm run lint
```
