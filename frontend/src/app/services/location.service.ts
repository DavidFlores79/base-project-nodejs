import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth';

export interface UserLocation {
  userId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  location: {
    latitude: number;
    longitude: number;
    updatedAt: Date;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private socket: Socket | null = null;

  // Signals for reactive state
  allUsers = signal<UserLocation[]>([]);
  isConnected = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor() {
    this.initSocket();
  }

  private initSocket() {
    this.socket = io();

    this.socket.on('connect', () => {
      console.log('LocationService: Socket connected');
      this.isConnected.set(true);
      
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.socket?.emit('user_authenticate', { userId: currentUser._id });
        // Request all locations on connect
        this.socket?.emit('get_all_locations');
      }
    });

    this.socket.on('disconnect', () => {
      console.log('LocationService: Socket disconnected');
      this.isConnected.set(false);
    });

    // Handle all locations response
    this.socket.on('all_locations', (data: any) => {
      if (data.success && data.users) {
        this.allUsers.set(data.users);
      }
    });

    // Handle real-time location updates
    this.socket.on('user_location_updated', (data: UserLocation) => {
      this.allUsers.update(users => {
        const index = users.findIndex(u => u.userId === data.userId);
        if (index > -1) {
          const newUsers = [...users];
          newUsers[index] = data;
          return newUsers;
        } else {
          return [...users, data];
        }
      });
    });

    this.socket.on('error', (err) => {
      console.error('LocationService: Socket error:', err);
      this.error.set('Connection error');
    });
  }

  getAllUsersLocations() {
    return this.http.get<{ success: boolean; count: number; data: UserLocation[] }>(
      '/api/v1/locations/users'
    );
  }

  getUserHistory(userId: string) {
    return this.http.get<any>(`/api/v1/locations/history/${userId}`);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
