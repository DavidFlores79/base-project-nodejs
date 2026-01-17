# API Documentation

## Authentication

### Sign Up
- **URL**: `/api/v1/auth/signup`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Response**: `201 Created` with user data and token.

### Sign In
- **URL**: `/api/v1/auth/signin`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: `200 OK` with user data and token.

## Users

### Get Profile
- **URL**: `/api/v1/users/profile`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` with user profile.

### Update Location
- **URL**: `/api/v1/users/location`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "latitude": 19.4326,
    "longitude": -99.1332
  }
  ```
- **Response**: `200 OK`.

## WebSockets

### Events

- `user_authenticate`: Sent by client to authenticate the socket.
  ```json
  { "userId": "user_id" }
  ```
- `update_location`: Sent by client to update their location.
  ```json
  { "userId": "user_id", "latitude": 19.4326, "longitude": -99.1332 }
  ```
- `user_location_updated`: Broadcasted by server when a user updates their location.
  ```json
  {
    "userId": "user_id",
    "username": "johndoe",
    "location": { "latitude": 19.4326, "longitude": -99.1332 }
  }
  ```
