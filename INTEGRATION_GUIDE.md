# 🔗 Frontend-Backend Integration Guide

## ✅ Integration Completed

Your React frontend is now fully connected to the Express.js backend with proper API integration, authentication, and deployment configuration.

## 🔧 What Was Configured

### 1. ✅ Environment Configuration
- **Development**: `.env` - Points to `http://localhost:5000`
- **Production**: `.env.production` - Template for production backend URL
- **Clean Configuration**: Removed mixed Next.js variables, kept only React-specific ones

### 2. ✅ API Integration
- **Centralized API**: Created `src/utils/api.js` with all backend endpoints
- **Gallery API**: Upload, view, edit, delete, reorder functionality
- **User Management**: Admin controls for user roles and permissions
- **Error Handling**: Proper error handling and user feedback

### 3. ✅ Authentication Integration
- **Clerk Setup**: Properly configured with environment variables
- **Token Management**: Automatic token inclusion in API requests
- **Role-Based Access**: Admin/Super Admin role checking

### 4. ✅ Testing & Debugging
- **Connection Test**: Added `/test` route with comprehensive API testing
- **Real-time Status**: Backend connection status in header
- **Debug Tools**: Environment info and configuration display

## 🚀 Deployment Steps

### Backend Deployment (First)
1. **Deploy Backend to Vercel**:
   ```bash
   cd gym-website-server
   vercel --prod
   ```
2. **Note the deployment URL** (e.g., `https://gym-backend-xyz.vercel.app`)

### Frontend Deployment (Second)
1. **Update Production Environment**:
   ```bash
   # In gym-website-frontend/.env.production
   REACT_APP_BACKEND_URL=https://your-backend-deployment-url.vercel.app
   ```

2. **Deploy Frontend to Vercel**:
   ```bash
   cd gym-website-frontend
   vercel --prod
   ```

## 🔍 Testing the Integration

### Local Testing
1. **Start Backend**:
   ```bash
   cd gym-website-server
   npm start
   ```

2. **Start Frontend**:
   ```bash
   cd gym-website-frontend
   npm start
   ```

3. **Visit Test Page**: `http://localhost:3000/test`

### Production Testing
1. Visit your deployed frontend URL
2. Navigate to `/test` route
3. Check all API connections are working

## 📋 API Endpoints Integration

### Gallery Management
- ✅ `GET /api/gallery` - Fetch all gallery items
- ✅ `POST /api/gallery/upload` - Upload files to Cloudinary
- ✅ `PUT /api/gallery/:id` - Update gallery item
- ✅ `DELETE /api/gallery/:id` - Delete from Cloudinary and database
- ✅ `PATCH /api/gallery/reorder` - Reorder gallery items

### User Management (Admin Only)
- ✅ `GET /api/auth/all-users` - Fetch all users
- ✅ `PUT /api/auth/promote/:id` - Promote user to admin
- ✅ `PUT /api/auth/demote/:id` - Demote admin to user
- ✅ `DELETE /api/auth/delete/:id` - Delete user account

### System Endpoints
- ✅ `GET /health` - Backend health check
- ✅ `GET /api/docs` - API documentation

## 🔐 Authentication Flow

1. **User Signs In**: Clerk handles authentication
2. **Token Generation**: Clerk provides JWT token
3. **API Requests**: Frontend includes token in Authorization header
4. **Backend Validation**: Backend validates token with Clerk
5. **Role Checking**: Backend checks user roles for protected routes

## 🎯 Frontend Features

### Gallery Page (`/gallery`)
- **View Gallery**: Display images and videos from Cloudinary
- **Admin Controls**: Upload, edit, delete, reorder (Admin/Super Admin only)
- **File Upload**: Drag-and-drop or click to upload
- **Real-time Updates**: Immediate UI updates after operations

### User Management (`/allusers`)
- **User List**: Display all registered users
- **Role Management**: Promote/demote users (Super Admin only)
- **User Deletion**: Remove users (Super Admin only)
- **Search & Filter**: Find users by name or email

### Connection Test (`/test`)
- **API Health**: Test all backend endpoints
- **Authentication**: Verify token-based auth
- **Configuration**: Display environment settings
- **Real-time Testing**: Run tests on demand

## 🛠️ Utility Functions

### API Utils (`src/utils/api.js`)
```javascript
import { galleryAPI, userAPI, systemAPI } from './utils/api';

// Gallery operations
const items = await galleryAPI.getAll(token);
await galleryAPI.upload(files, token);
await galleryAPI.update(id, data, token);
await galleryAPI.delete(id, token);

// User operations
const users = await userAPI.getAll(token);
await userAPI.promote(userId, token);
await userAPI.demote(userId, token);
await userAPI.delete(userId, token);
```

### Auth Utils (`src/utils/auth.js`)
```javascript
import { useAuth, isAdmin, isSuperAdmin } from './utils/auth';

const { logout, getToken } = useAuth();
const adminAccess = isAdmin(user);
const superAdminAccess = isSuperAdmin(user);
```

## 🔧 Environment Variables

### Development (`.env`)
```env
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
REACT_APP_ENV=development
```

### Production (`.env.production`)
```env
REACT_APP_BACKEND_URL=https://your-backend-domain.vercel.app
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key_here
REACT_APP_ENV=production
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check backend `ALLOWED_ORIGINS` includes frontend domain
   - Verify frontend URL is correct

2. **Authentication Failures**
   - Verify Clerk publishable key is correct
   - Check backend Clerk secret key matches

3. **API Connection Issues**
   - Test backend health endpoint directly
   - Check network connectivity
   - Verify environment variables

4. **File Upload Problems**
   - Check Cloudinary configuration
   - Verify file size limits
   - Test with smaller files first

### Debug Steps
1. Visit `/test` route to run connection tests
2. Check browser console for errors
3. Verify environment variables are loaded
4. Test backend endpoints directly with Postman/curl

## 🎉 Integration Status

**✅ FULLY INTEGRATED**

Your frontend and backend are now:
- Properly connected with secure authentication
- Using Cloudinary for media storage
- Ready for production deployment
- Fully tested and documented

Follow the deployment steps to get both applications live!
