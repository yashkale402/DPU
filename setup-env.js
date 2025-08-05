#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 DPU Event Management Setup');
console.log('================================');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('❌ .env.local file not found');
  console.log('✅ Created .env.local template');
} else {
  console.log('✅ .env.local file exists');
}

// Check environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

console.log('\n📋 Environment Variables Status:');
console.log('================================');

let allConfigured = true;
requiredEnvVars.forEach(varName => {
  const isSet = process.env[varName] && process.env[varName].trim() !== '';
  console.log(`${isSet ? '✅' : '❌'} ${varName}: ${isSet ? 'Configured' : 'Not configured'}`);
  if (!isSet) allConfigured = false;
});

console.log('\n📝 Setup Instructions:');
console.log('======================');

if (!allConfigured) {
  console.log('1. Edit the .env.local file with your actual values:');
  console.log('   - MONGODB_URI: Your MongoDB connection string');
  console.log('   - CLOUDINARY_*: Your Cloudinary credentials');
  console.log('');
  console.log('2. For MongoDB:');
  console.log('   - Local: mongodb://localhost:27017/dpu_events');
  console.log('   - Atlas: mongodb+srv://username:password@cluster.mongodb.net/database');
  console.log('');
  console.log('3. For Cloudinary:');
  console.log('   - Sign up at https://cloudinary.com');
  console.log('   - Get your credentials from the dashboard');
  console.log('');
  console.log('4. Restart the development server after updating .env.local');
} else {
  console.log('✅ All environment variables are configured!');
  console.log('🎉 You can now run: npm run dev');
}

console.log('\n🔧 Troubleshooting:');
console.log('==================');
console.log('- Make sure .env.local is in the project root');
console.log('- Restart the dev server after changing environment variables');
console.log('- Check the browser console and terminal for error messages');
console.log('- Ensure MongoDB is running (if using local database)');
