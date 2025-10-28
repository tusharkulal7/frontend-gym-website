# 🏋️‍♂️ Evolution Gym & Fitness - Frontend

A modern, responsive React.js frontend for gym website management featuring an interactive gallery, user administration, and comprehensive gym management features. Built with cutting-edge technologies and best practices for optimal performance and user experience.

## ✨ Features

### 🖼️ **Interactive Gallery**
- Beautiful photo and video gallery with modal viewing
- Admin controls for media management (upload, edit, delete, reorder)
- Drag-and-drop functionality for easy organization
- Support for multiple file formats (images and videos)
- Responsive grid layout with smooth animations

### 👥 **User Management**
- Clerk-based authentication with secure login/logout
- Role-based access control (Super Admin, Admin, User)
- User promotion/demotion capabilities
- Profile management and customization

### 🎨 **Modern UI/UX**
- Responsive design that works on all devices
- Dark theme with red accent colors
- Smooth animations and transitions using Framer Motion
- Professional typography and spacing
- Intuitive navigation and user flows

### 🔒 **Security & Performance**
- Secure authentication with Clerk
- Input validation and sanitization
- Optimized API calls with error handling
- Lazy loading and code splitting
- Performance monitoring and optimization

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1
- **Styling**: Tailwind CSS 3.4.17
- **Authentication**: Clerk React 5.0.0
- **Animations**: Framer Motion 12.23.6
- **Icons**: Lucide React 0.525.0
- **HTTP Client**: Axios 1.11.0
- **Routing**: React Router DOM 7.6.3
- **Build Tool**: Create React App 5.0.1
- **Testing**: React Testing Library

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API server running
- Clerk account for authentication

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd gym-website-frontend
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:

```env
# Backend API Configuration
REACT_APP_BACKEND_URL=http://localhost:5000

# Clerk Authentication
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here

# App Configuration
REACT_APP_NAME=Evolution Gym & Fitness
REACT_APP_VERSION=2.0.0

# Development Settings
NODE_ENV=development
REACT_APP_ENABLE_DEBUG=false

# Production URLs (Update after deployment)
# REACT_APP_BACKEND_URL=https://your-backend-domain.herokuapp.com
```

### 3. Start Development Server
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📜 Available Scripts

### `npm start`
Runs the app in development mode with hot reloading.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder with optimizations.

### `npm run eject`
⚠️ **One-way operation!** Ejects from Create React App for full configuration control.

## 🏗️ Project Structure

```
gym-website-frontend/
├── public/
│   ├── images/           # Static images and assets
│   └── index.html       # HTML template
├── src/
│   ├── components/      # Reusable React components
│   │   ├── Auth/        # Authentication components
│   │   ├── Header.jsx   # Navigation header
│   │   ├── Footer.jsx   # Site footer
│   │   └── ...
│   ├── pages/          # Page components
│   │   ├── Home.jsx    # Landing page
│   │   ├── Gallery.jsx # Gallery management
│   │   ├── About.jsx   # About page
│   │   └── ...
│   ├── utils/          # Utility functions
│   │   ├── api.js      # API helper functions
│   │   └── auth.js     # Authentication utilities
│   ├── App.js          # Main app component
│   └── index.js        # Entry point
├── tailwind.config.js  # Tailwind CSS configuration
└── package.json        # Dependencies and scripts
```

## 🎨 Styling & Theming

### Tailwind CSS Configuration
The app uses a custom Tailwind configuration with:
- **Primary Colors**: Red accent (#DC2626, #EF4444)
- **Background**: Dark theme with gradient overlays
- **Typography**: Agency FB font family
- **Responsive Breakpoints**: Mobile-first design

### Custom Styles
- Glassmorphism effects with backdrop blur
- Smooth hover transitions and animations
- Custom scrollbars and form elements
- Responsive grid layouts

## 🔐 Authentication Flow

### Clerk Integration
1. **Sign In**: Users authenticate through Clerk's secure system
2. **Role Assignment**: Users are assigned roles (User, Admin, Super Admin)
3. **Protected Routes**: Certain pages require authentication
4. **Token Management**: JWT tokens handled automatically by Clerk

### Role-Based Access
- **Public**: Gallery viewing, basic pages
- **User**: Profile management, basic features
- **Admin**: User management, content moderation
- **Super Admin**: Full system access, user promotion/demotion

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Features
- Mobile-first design approach
- Touch-friendly interface elements
- Optimized images and media queries
- Collapsible navigation menu

## 🚀 Deployment

### Netlify Deployment (Recommended)

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variables in Netlify dashboard

3. **Environment Variables**:
   ```
   REACT_APP_BACKEND_URL=https://your-backend-api.herokuapp.com
   REACT_APP_CLERK_PUBLISHABLE_KEY=pk_live_your_live_key
   ```

### Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

### Manual Deployment

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Serve static files**:
   ```bash
   npx serve -s build -l 3000
   ```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in CI mode
npm test -- --ci --coverage --watchAll=false
```

### Test Structure
- Component unit tests
- Integration tests for user flows
- API interaction tests
- Accessibility tests

## 🔧 Configuration

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_BACKEND_URL` | Backend API URL | Yes |
| `REACT_APP_CLERK_PUBLISHABLE_KEY` | Clerk public key | Yes |
| `REACT_APP_NAME` | Application name | No |
| `REACT_APP_VERSION` | App version | No |

### Build Optimization
- Code splitting with React.lazy()
- Image optimization and lazy loading
- Bundle size analysis with webpack-bundle-analyzer
- Service worker for offline functionality

## 🐛 Troubleshooting

### Common Issues

**1. Clerk Authentication Errors**
```bash
# Check environment variables
echo $REACT_APP_CLERK_PUBLISHABLE_KEY

# Verify Clerk configuration
```

**2. API Connection Issues**
```bash
# Check backend URL
curl $REACT_APP_BACKEND_URL/health

# Verify CORS settings
```

**3. Build Failures**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for dependency conflicts
npm audit
```

## 📊 Performance Optimization

### Implemented Optimizations
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP support, lazy loading
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: Service worker implementation
- **Minification**: Production build optimization

### Performance Metrics
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB (gzipped)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Follow the coding standards and conventions
4. Write tests for new functionality
5. Commit changes: `git commit -am 'Add new feature'`
6. Push to branch: `git push origin feature/new-feature`
7. Submit a pull request

### Coding Standards
- Use functional components with hooks
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Maintain responsive design principles

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support:
- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation

---

**Built with ❤️ for modern gym management**
