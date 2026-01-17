# Base Project NodeJS - AI Agent Instructions

Node.js + Express + MongoDB + Socket.io backend with Angular 21 + Tailwind CSS frontend. Features JWT authentication and real-time location broadcasting.

## Development Commands

```bash
# Backend
npm run dev              # Development (nodemon watches src/)
npm start                # Production server

# Frontend (cd frontend/)
npm start                # Dev server on localhost:4200
npm run build            # Production build → dist/frontend/browser/

# Build & Sync
npm run build            # Builds frontend AND syncs to public/
npm run sync-frontend    # Sync frontend/dist to public/ without rebuilding
```

## Critical Backend Patterns

### Server Constructor Starts Immediately
`src/models/server.js` constructor starts HTTP server and Socket.io. The `listen()` method is called but the server is already running from the constructor.

```javascript
// In src/app.js
const server = new Server(); // Server already started here
server.listen();              // Just logs "Server running on port X"
```

### Socket.io via req.io
Attached in `src/models/server.js` middleware. All controllers access `req.io.emit()`. Never remove this middleware.

```javascript
this.app.use(function (req, res, next) {
  req.io = io;
  next();
});
```

### Frontend Build Sync
The `sync-frontend.js` script copies `frontend/dist/frontend/browser/` to `public/`. It preserves the `public/uploads/` directory during sync.

## Request Flow Architecture

### Authentication Flow
1. User signs up/in via `/api/v1/auth/*`
2. Backend validates credentials, returns JWT token
3. Frontend stores token + user in localStorage
4. `auth.interceptor.ts` adds `Authorization: Bearer <token>` header to all requests
5. `authMiddleware.js` validates JWT on protected backend routes

### Real-time Location Broadcasting
1. Client authenticates Socket.io connection via `user_authenticate` event
2. Socket joins room `user_{userId}`
3. Client emits `update_location` with coordinates
4. `src/services/socket.js` updates User model in MongoDB
5. Server broadcasts `user_location_updated` to ALL connected clients
6. All clients receive location updates for all users in real-time

## Angular Frontend Architecture

### Structure (`frontend/src/app/`)
```
components/
  auth/login/          # JWT login form
  auth/signup/         # User registration form
  layout/main-layout/  # Sidebar + header wrapper
  home/                # Main authenticated view with location tracking
  shared/              # Reusable components (date-picker, status-badge, toast-container)
services/
  auth.ts              # JWT + localStorage, currentUser$ observable
  toast.ts             # Toast notifications
interceptors/
  auth.interceptor.ts  # Adds Authorization header to all HTTP requests
config/
  translation.config.ts # i18n setup (en-US, es-MX)
```

### Auth Pattern (`services/auth.ts`)
- Stores `token` and `user` in localStorage
- `currentUser$` BehaviorSubject drives UI state across components
- `auth.interceptor.ts` adds JWT to all HTTP requests
- On 401 response, clears auth and redirects to `/login`

### i18n Support
- Uses `@ngx-translate` with translation files in `frontend/src/assets/i18n/`
- Supported languages: `en-US`, `es-MX`

### API Calls
- All services use relative URLs (`/api/v1/*`) - works in dev proxy and production same-port
- `auth.interceptor.ts` adds `Authorization: Bearer <token>` header
- On 401, clears auth and redirects to `/login`

## Route Prefix Rules

- `/api/v1/auth/*` - Authentication routes (signup, signin)
- `/api/v1/users/*` - User routes (profile, location)
- `/*` (catch-all) - Serves Angular SPA from `public/index.html`

Register specific routes BEFORE the catch-all SPA route in `server.js` or they won't match.

## Key Files by Feature

| Feature | Files |
|---------|-------|
| Server setup | `src/app.js`, `src/models/server.js` |
| Authentication | `src/controllers/authController.js`, `src/routes/authRoutes.js`, `src/middleware/authMiddleware.js` |
| User management | `src/controllers/userController.js`, `src/routes/userRoutes.js`, `src/models/User.js` |
| Socket.io events | `src/services/socket.js` |
| Database config | `src/database/config.js` |
| Frontend auth | `frontend/src/app/services/auth.ts`, `frontend/src/app/interceptors/auth.interceptor.ts` |
| Frontend layout | `frontend/src/app/components/layout/main-layout/` |
| Frontend home | `frontend/src/app/components/home/` |

## Data Models

- **User**: `{ username, email, password (bcrypt hashed), firstName, lastName, avatar, address (street, city, state, country, postalCode, coordinates), location (latitude, longitude, updatedAt) }`

## Socket.io Events

### Client → Server
- `user_authenticate` - Join user room: `{ userId }`
- `update_location` - Update user location: `{ userId, latitude, longitude }`

### Server → Client
- `authenticated` - Confirmation of authentication: `{ success: true, userId }`
- `user_location_updated` - Broadcast location update: `{ userId, username, location }`

## Environment Variables

Required (see `.env.example`):
- `PORT` - Server port (default: 5001)
- `MONGODB` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing

Optional third-party integrations:
- `GOOGLE_CLIENT_ID`, `GOOGLE_SECRET_ID` - Google OAuth
- `CLOUDINARY_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_API_KEY` - Image upload
- `OPENAI_API_KEY`, `OPENAI_ASSISTANT_ID` - OpenAI integration
- `GOOGLE_MAPS_API_KEY`, `OPENCAGE_API_KEY` - Geocoding APIs

## Rules for AI Agents

1. **Server starts in constructor** - Don't expect `server.listen()` to start the server
2. **Keep `req.io` middleware** - Socket.io events used throughout app
3. **Register routes before SPA catch-all** - API routes must come before `/*`
4. **Build frontend locally before deployment** - Limited server resources
5. **No AI attribution in commits** - No "Generated by Claude", "Co-Authored-By", 🤖 emojis, or AI tool references

## Deployment Workflow for Frontend Changes

**⚠️ ALWAYS DO THIS AFTER MAKING FRONTEND CHANGES:**

When you modify ANY files in `frontend/src/`:

1. **Build the frontend**:
   ```bash
   cd frontend && npm run build && cd ..
   ```

2. **Sync to public directory**:
   ```bash
   npm run sync-frontend
   ```
   OR use the combined command:
   ```bash
   npm run build
   ```

3. **Commit ALL changes (including built files)**:
   ```bash
   git add -A
   git commit -m "your message"
   ```

4. **Push to repository**:
   ```bash
   git push
   ```

**WHY:** The production server has limited resources. Frontend MUST be built locally and committed. The deploy script detects built files and skips rebuild on the server.

If you only change backend files (`src/`), you can skip steps 1-2 and just commit/push.
