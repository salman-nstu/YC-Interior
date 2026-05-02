# YC Interior - Unified Frontend Application

This is the unified frontend application that combines both the public website and admin panel into a single Angular application running on one server.

## 🏗️ Project Structure

```
Frontend/
├── src/
│   ├── app/
│   │   ├── website/          # Public website components
│   │   │   ├── home/
│   │   │   ├── about-page/
│   │   │   ├── services-page/
│   │   │   ├── projects-page/
│   │   │   ├── gallery-page/
│   │   │   ├── team-page/
│   │   │   ├── blogs-page/
│   │   │   ├── contact-page/
│   │   │   └── shared/       # Website shared components
│   │   │
│   │   ├── admin/            # Admin panel components
│   │   │   ├── dashboard/
│   │   │   ├── projects/
│   │   │   ├── services/
│   │   │   ├── gallery/
│   │   │   ├── media/
│   │   │   ├── posts/
│   │   │   ├── team/
│   │   │   ├── clients/
│   │   │   ├── reviews/
│   │   │   ├── faqs/
│   │   │   ├── about/
│   │   │   ├── statistics/
│   │   │   ├── messages/
│   │   │   ├── settings/
│   │   │   ├── auth/
│   │   │   └── shared/       # Admin shared components
│   │   │
│   │   ├── core/             # Core services, guards, interceptors
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── models/
│   │   │   └── services/
│   │   │
│   │   ├── app.routes.ts     # Unified routing configuration
│   │   ├── app.config.ts     # Application configuration
│   │   └── app.ts            # Root component
│   │
│   ├── assets/               # Static assets (fonts, images)
│   ├── index.html            # Main HTML file
│   ├── main.ts               # Application entry point
│   └── styles.scss           # Global styles (website + admin)
│
├── public/                   # Public static files
├── angular.json              # Angular CLI configuration
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript configuration
└── proxy.conf.json           # Backend proxy configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v11.6.2 or higher)

### Installation

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`

## 🌐 Access Points

### Public Website
- **Home**: `http://localhost:4200/`
- **About**: `http://localhost:4200/about`
- **Services**: `http://localhost:4200/services`
- **Projects**: `http://localhost:4200/projects`
- **Gallery**: `http://localhost:4200/gallery`
- **Team**: `http://localhost:4200/team`
- **Blogs**: `http://localhost:4200/blogs`
- **Contact**: `http://localhost:4200/contact`

### Admin Panel
- **Login**: `http://localhost:4200/admin/login`
- **Dashboard**: `http://localhost:4200/admin` (requires authentication)
- **All Admin Routes**: `http://localhost:4200/admin/*` (requires authentication)

## 🔐 Authentication

The admin panel is protected by authentication guards:
- **authGuard**: Protects admin routes, redirects to login if not authenticated
- **guestGuard**: Protects login route, redirects to dashboard if already authenticated

## 📦 Build Commands

### Development Build
```bash
npm run build
```

### Production Build
```bash
npm run build:prod
```

### Watch Mode
```bash
npm run watch
```

## 🎨 Styling

The application uses a unified SCSS stylesheet that includes:
- **Website styles**: Custom fonts (Sofia Sans, Ade Display), color palette, animations
- **Admin panel styles**: Material Design theme, Roboto font, admin-specific components
- **Shared utilities**: Common classes and mixins

## 🔄 Routing Strategy

The application uses lazy loading for optimal performance:
- Website components are loaded on-demand
- Admin components are loaded on-demand
- Shared services are eagerly loaded

## 🛠️ Development

### Adding New Website Pages
1. Create component in `src/app/website/`
2. Add route in `src/app/app.routes.ts` (public routes section)

### Adding New Admin Features
1. Create component in `src/app/admin/`
2. Add route in `src/app/app.routes.ts` (admin routes section, inside authGuard)

### Shared Services
Place shared services in `src/app/core/services/` for use across both website and admin.

## 🔧 Configuration

### Backend API
The application proxies API requests to the backend server running on `http://localhost:8080`.
Configuration is in `proxy.conf.json`:
- `/auth` - Authentication endpoints
- `/api` - API endpoints
- `/media` - Media endpoints
- `/files` - File endpoints

### Environment Variables
Environment configurations are in `src/app/environments/`:
- `environment.ts` - Development environment
- `environment.prod.ts` - Production environment

## 📝 Notes

- The website uses Sofia Sans and Ade Display fonts
- The admin panel uses Roboto and Material Icons
- Both applications share the same Angular Material theme (Matcha Green)
- Dark mode is supported in the admin panel
- The application uses standalone components (no NgModules)

## 🐛 Troubleshooting

### Port Already in Use
If port 4200 is already in use, you can specify a different port:
```bash
ng serve --port 4300
```

### Backend Connection Issues
Ensure the backend server is running on `http://localhost:8080` before starting the frontend.

### Build Errors
Clear the Angular cache and reinstall dependencies:
```bash
rm -rf .angular node_modules
npm install
```

## 📄 License

This project is part of the YC Interior application.
