# Base Project NodeJS

A clean, base NodeJS project with user authentication and real-time location broadcasting.

## ✨ Features

- **User Authentication**: Sign-up and Sign-in with JWT.
- **Location Broadcasting**: Real-time user location updates via Socket.io.
- **Angular Frontend**: Modern, premium UI with authentication guards and location tracking.
- **MongoDB Integration**: User data persistence with Mongoose.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 22.0.0
- MongoDB instance

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Environment Setup

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Running the Application

**Development:**
1. Start the backend: `npm run dev`
2. Start the frontend: `cd frontend && npm start`

**Production:**
1. Build and sync the frontend:
   ```bash
   npm run build
   ```
   This command builds the Angular app and automatically copies the output to the `public` directory using `sync-frontend.js`.
2. Start the server:
   ```bash
   npm start
   ```

## 📁 Project Structure

```
src/
├── app.js                 # Entry point
├── controllers/           # Auth and User controllers
├── models/                # User model and Server setup
├── routes/                # API routes
├── services/              # Socket.io service
└── middleware/            # Auth middleware

frontend/                  # Angular project
├── src/app/components/    # Auth and Home components
└── src/app/services/      # Auth service
```

## 📖 API Documentation

See [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for details.

## License
ISC