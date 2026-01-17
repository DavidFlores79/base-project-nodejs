# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Backend
npm run dev              # Development with nodemon (watches src/)
npm start                # Production server

# Frontend (cd frontend/)
npm start                # Dev server on localhost:4200
npm run build            # Production build → dist/frontend/browser/

# Build & Sync
npm run build            # Builds frontend AND syncs to public/
npm run sync-frontend    # Sync frontend/dist to public/ without rebuilding
```

## Architecture Overview

This is a Node.js + Express backend with Angular 21 frontend, featuring JWT authentication and real-time location broadcasting via Socket.io.

### Server Architecture (Server Constructor Pattern)

**CRITICAL**: `src/models/server.js` constructor starts the HTTP server and Socket.io immediately upon instantiation. The `listen()` method is called but the server is already running from the constructor. This is an unusual pattern where construction has side effects.

```javascript
// In src/app.js
const server = new Server(); // Server already started here
server.listen();              // Just logs "Server running on port X"
```

### Socket.io Integration

Socket.io is attached to all Express requests via middleware in `src/models/server.js`:

```javascript
this.app.use(function (req, res, next) {
  req.io = io;
  next();
});
```

Controllers access Socket.io via `req.io.emit()`. Never remove this middleware.

### Frontend Build Sync

The `sync-frontend.js` script copies `frontend/dist/frontend/browser/` to `public/`. It preserves the `public/uploads/` directory during sync. The Express server serves the Angular SPA from `public/` for all non-API routes.

## API Routes

- `/api/v1/auth/*` - Authentication (signup, signin)
- `/api/v1/users/*` - User operations (profile, location)
- `/*` (catch-all) - Serves Angular SPA from `public/index.html`

Register specific routes BEFORE the catch-all SPA route or they won't match.

## Data Flow

### Authentication Flow
1. User signs up/in via `/api/v1/auth/*`
2. Backend returns JWT token
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

## Key Files by Feature

| Feature | Files |
|---------|-------|
| Server setup | `src/app.js`, `src/models/server.js` |
| Authentication | `src/controllers/authController.js`, `src/routes/authRoutes.js`, `src/middleware/authMiddleware.js` |
| User management | `src/controllers/userController.js`, `src/routes/userRoutes.js`, `src/models/User.js` |
| Socket.io events | `src/services/socket.js` |
| Frontend auth | `frontend/src/app/services/auth.ts`, `frontend/src/app/interceptors/auth.interceptor.ts` |
| Frontend layout | `frontend/src/app/components/layout/main-layout/` |

## Database Models

- **User**: `{ username, email, password (bcrypt), firstName, lastName, avatar, address (street, city, state, country, postalCode, coordinates), location (latitude, longitude, updatedAt) }`

## Environment Variables

Required variables (see `.env.example`):

- `PORT` - Server port (default: 5001 if not set)
- `MONGODB` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing

Optional third-party integrations:

- `GOOGLE_CLIENT_ID`, `GOOGLE_SECRET_ID` - Google OAuth
- `CLOUDINARY_*` - Image upload (cloud_name, api_key, api_secret, url)
- `OPENAI_API_KEY`, `OPENAI_ASSISTANT_ID` - OpenAI integration
- `GOOGLE_MAPS_API_KEY`, `OPENCAGE_API_KEY` - Geocoding APIs

## Angular Frontend Structure

```
frontend/src/app/
  components/
    auth/login/         # JWT login form
    auth/signup/        # Registration form
    layout/main-layout/ # Wrapper with navigation
    home/               # Main authenticated view
    shared/             # Reusable components (date-picker, status-badge, toast-container)
  services/
    auth.ts             # JWT + localStorage, currentUser$ observable
    toast.ts            # Toast notifications
  interceptors/
    auth.interceptor.ts # Adds Authorization header
  config/
    translation.config.ts # i18n setup (en-US, es-MX)
```

### Angular Auth Pattern

- `AuthService` stores `token` and `user` in localStorage
- `currentUser$` BehaviorSubject drives UI state
- `auth.interceptor.ts` adds JWT to all HTTP requests
- On 401 response, interceptor calls `clearAuth()` and redirects to `/login`

### i18n Setup

Uses `@ngx-translate` with translation files in `frontend/src/assets/i18n/`:
- `en-US.json`
- `es-MX.json`

## Critical Patterns

1. **Server Constructor Starts Immediately**: Don't expect `server.listen()` to start the server - it's already running after `new Server()`

2. **Socket.io via req.io**: All controllers access Socket.io through `req.io` middleware injection

3. **SPA Catch-All Route**: The `/*` route MUST be registered last in `src/models/server.js` or it will intercept API routes

4. **Frontend Sync**: After frontend changes, run `npm run build` (builds + syncs) or manually sync with `npm run sync-frontend`

## Notes from .github/copilot-instructions.md

The copilot instructions reference a WhatsApp bot architecture that appears to be from a different project or future development. Current codebase implements basic auth + location broadcasting only. If WhatsApp features exist in other branches, refer to those instructions for webhook processing, OpenAI integration, and conversation management patterns.
