# Real-Time Location Tracking Map - Context Session

**Feature Name**: Real-Time Location Tracking Map  
**Branch**: `feat/real-time-location-map`  
**Base Branch**: `develop`  
**Created**: 2026-01-17  
**Status**: Feature Branch Created - Ready for Implementation

## Overview

Implementation of an interactive map feature that displays all authenticated users' locations in real-time, leveraging existing Google Maps API credentials and Socket.IO infrastructure.

## Technology Stack

**Backend:**
- Node.js v22+
- Express.js
- MongoDB with Mongoose
- Socket.IO v4.7.2
- JWT Authentication

**Frontend:**
- Angular 21 (standalone components)
- TypeScript 5.9+
- Tailwind CSS
- Socket.IO Client v4.8.1
- Angular Google Maps
- RxJS Signals

**APIs & Services:**
- Google Maps JavaScript API (credentials configured)
- Geolocation API
- WebSockets (Socket.IO)

## Current State Analysis

### Existing Infrastructure ✅
- ✅ User authentication with JWT (AuthService, auth guards)
- ✅ Socket.IO server configured and running
- ✅ User model with `location` field (latitude, longitude, updatedAt)
- ✅ Geolocation tracking in HomeComponent
- ✅ Real-time location broadcasting via Socket.IO (`update_location`, `user_location_updated`)
- ✅ REST API endpoint for location updates (`POST /api/v1/users/location`)
- ✅ Google Maps API key configured in `.env`

### What's Missing ❌
- ❌ Visual map interface (currently only text cards in HomeComponent)
- ❌ Google Maps integration in frontend
- ❌ REST API endpoint to fetch all users' locations
- ❌ Location history tracking
- ❌ Enhanced Socket.IO events for initial state sync
- ❌ Offline/online user status tracking

## Implementation Approach

### Backend Changes

1. **Enhanced User Model**
   - Add `locationHistory` array (max 50 entries)
   - Keep existing `location` for current position
   
2. **New Location Controller & Routes**
   - `GET /api/v1/locations/users` - Fetch all active users' locations
   - `GET /api/v1/locations/history/:userId` - Get user location history
   
3. **Enhanced Socket.IO Service**
   - Add `get_all_locations` event for initial state
   - Include user metadata in broadcasts
   - Track online/offline status

### Frontend Changes

1. **Dependencies**
   - Add `@angular/google-maps` package
   - Add `@types/google.maps` for TypeScript support
   - Include Google Maps script in index.html

2. **New Location Service**
   - Centralized location state management with signals
   - HTTP methods for REST API
   - Socket.IO integration for real-time updates
   
3. **New Map View Component**
   - Google Maps integration with custom markers
   - Real-time marker position updates
   - Info windows with user details
   - User list sidebar
   - Map controls (zoom, fit bounds, toggle features)
   - Dark theme matching app design

4. **Routing & Navigation**
   - Add `/map` route
   - Add navigation link in main layout

## Agent Team Selection

Based on the technology stack and implementation scope:

### 1. Backend Architect (nodejs-backend-architect)
**Consultation Areas:**
- Database schema design for location history
- REST API endpoint design and best practices
- Socket.IO event architecture and optimization
- Performance considerations for location queries
- Error handling and validation

### 2. Frontend Developer (angular-frontend-developer)
**Consultation Areas:**
- Angular Google Maps integration patterns
- State management with signals for real-time data
- Component architecture and reusability
- RxJS operators for Socket.IO streams
- Performance optimization for marker updates

### 3. UI/UX Analyzer (ui-ux-analyzer)
**Consultation Areas:**
- Map interface design and user experience
- Mobile responsiveness for map components
- User feedback for location permission handling
- Visual indicators for online/offline users
- Dark theme consistency

## Branch Strategy

- **Branch Name**: `feat/real-time-location-map`
- **Base Branch**: `develop` (will create if doesn't exist)
- **Target Branch**: `develop`
- **Review Requirements**: 1 reviewer required before merging
- **Commit Convention**: Conventional commits (feat:, fix:, docs:, etc.)

## Key Design Decisions

1. **Map Library**: Using official Google Maps with `@angular/google-maps` for native Angular integration
2. **Real-time Strategy**: Leverage existing Socket.IO infrastructure, add REST endpoint for initial state
3. **Location History**: Store last 50 positions per user for potential trail feature
4. **Privacy**: All authenticated users can see each other (no privacy controls in MVP)
5. **Performance**: Auto-zoom and marker clustering can be added in future iterations
6. **Offline Handling**: Mark users as offline after 30 minutes of inactivity

## Questions for User

Need clarification on the following:

**A) Privacy & Visibility**
- Should all authenticated users see each other, or do we need permission-based visibility?
- Should users be able to opt-out of location sharing?

**B) Map Features**
- Do you want to show location history as trails/paths on the map?
- Should we add marker clustering for many users?
- Any specific map styling preferences (terrain, satellite, hybrid)?

**C) Naming**
- You mentioned not knowing what to call this feature. Options:
  - A) "Live Map" or "Map View"
  - B) "User Tracker" or "Location Tracker"
  - C) "Team Map" or "Fleet Tracking"
  - D) Other suggestion?

## Next Steps

1. ✅ Codebase exploration - COMPLETED
2. ✅ Create implementation plan - COMPLETED
3. ⏳ Get user feedback on questions above
4. ⏳ Get implementation plan approval
5. ✅ Create feature branch `feat/real-time-location-map` - COMPLETED
6. ⏳ Begin implementation (backend first, then frontend)

## Iteration History

### Iteration 1 (2026-01-17)
- Initial codebase exploration completed
- Technology stack identified
- Existing infrastructure analyzed
- Implementation plan created
- Awaiting user review and clarification

### Iteration 2 (2026-01-17)
- Feature branch `feat/real-time-location-map` created from `develop`
- Branch ready for implementation
- Next: Begin implementation with backend changes
