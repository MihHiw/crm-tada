# Vanilla Beauty CRM Frontend

Next.js-based Progressive Web App (PWA) for managing bookings, payments, and business operations.

## 🚀 Technology Stack

- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Deployment**: Cloudflare Pages

## 📁 Project Structure

```
frontend/vanilla-beauty-crm-app/
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js 14 App Router
│   ├── components/            # React components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and helpers
│   ├── services/              # API service layer
│   ├── store/                 # Zustand state management
│   └── types/                 # TypeScript types
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # TailwindCSS configuration
├── postcss.config.js          # PostCSS configuration
├── package.json
└── .env.local.example         # Environment variables template
```

## 🔧 Local Development

### Prerequisites

- Node.js 18+ and npm
- Backend API running (locally or production)

### Setup Steps

1. **Install dependencies:**
   ```bash
   cd frontend/vanilla-beauty-crm-app
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local:
   # NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   ```
   http://localhost:3000
   ```

5. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## 🌐 Features

### 🔐 Authentication
- User login/logout
- JWT token management
- Role-based access control

### 📅 Booking Management
- View all bookings
- Create new bookings
- Update booking status
- Cancel bookings
- Calendar view

### 💰 Payment Processing
- Payment recording
- Payment history
- Commission tracking
- Revenue reports

### 🏢 Business Management
- Multi-business support
- Business profile editing
- Box/room management
- Service configuration

### 📊 Dashboard
- Real-time statistics
- Revenue charts
- Booking analytics
- Performance metrics

### 📱 Progressive Web App (PWA)
- Installable on mobile devices
- Offline functionality
- Push notifications
- Fast loading

## 🎨 UI Components

Built with TailwindCSS and custom components:
- Buttons and Forms
- Cards and Modals
- Tables and Lists
- Charts and Graphs
- Loading States
- Toast Notifications

## 🔌 API Integration

API Base URL: `https://business-crm.tadagram.com/api`

### Example API Call

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch bookings
const getBookings = async () => {
  const response = await api.get('/bookings');
  return response.data;
};
```

## 📦 State Management

Using Zustand for global state:

```typescript
import create from 'zustand';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: async (email, password) => {
    // Login logic
  },
  logout: () => {
    set({ user: null, token: null });
  },
}));
```

## 🚀 Deployment

### Automatic Deployment

Pushes to `main` branch automatically deploy to Cloudflare Pages via GitHub Actions.

Workflow file: `.github/workflows/deploy-crm-frontend.yml`

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages publish out --project-name=vanilla-beauty-crm
```

### Production URLs

- **Live App**: https://vanilla-beauty-crm.pages.dev
- **API Backend**: https://business-crm.tadagram.com/api

## 🔐 Environment Variables

### Development (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Vanilla Beauty CRM
NEXT_PUBLIC_ENABLE_PWA=true
```

### Production (.env.production)
```bash
NEXT_PUBLIC_API_URL=https://business-crm.tadagram.com/api
NEXT_PUBLIC_APP_NAME=Vanilla Beauty CRM
NEXT_PUBLIC_ENABLE_PWA=true
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run linter
npm run lint
```

## 📱 PWA Configuration

### manifest.json
Located in `public/manifest.json`:
- App name and icons
- Theme colors
- Display mode
- Start URL

### Service Worker
Automatic caching and offline support via Next.js PWA plugin.

## 🎨 Styling Guide

### TailwindCSS Classes
```jsx
// Button example
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
  Submit
</button>

// Card example
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-xl font-bold mb-4">Card Title</h2>
  <p className="text-gray-600">Card content</p>
</div>
```

### Custom Colors
Defined in `tailwind.config.js`:
- Primary: Blue
- Success: Green
- Warning: Yellow
- Danger: Red

## 📊 Performance Optimization

- **Code Splitting**: Automatic via Next.js
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: React.lazy() for heavy components
- **Caching**: SWR for API data caching
- **Minification**: Automatic in production build

## 🐛 Troubleshooting

### Build errors
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### API connection issues
- Verify NEXT_PUBLIC_API_URL in .env.local
- Check CORS configuration on backend
- Ensure backend is running

### Styling not applying
- Restart dev server after TailwindCSS config changes
- Check PostCSS configuration
- Clear browser cache

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)

## 🔄 Development Workflow

1. **Create feature branch**: `git checkout -b feature/new-feature`
2. **Make changes**: Edit code and test locally
3. **Commit changes**: `git commit -m "Add new feature"`
4. **Push to GitHub**: `git push origin feature/new-feature`
5. **Create Pull Request**: Review and merge to main
6. **Automatic Deploy**: GitHub Actions deploys to production

## 📧 Support

For issues or questions, please contact the development team or create an issue in the repository.
