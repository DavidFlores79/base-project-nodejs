import { Component, inject, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private socket: Socket | null = null;
  private watchId: number | null = null;
  
  user = signal<User | null>(this.authService.getCurrentUser());
  otherUsers = signal<any[]>([]);
  isConnected = signal<boolean>(false);
  locationError = signal<string | null>(null);

  constructor() {
    // Sync signal with auth service if it changes
    effect(() => {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser && !this.user()) {
        this.user.set(currentUser);
      }
    });
  }

  ngOnInit() {
    this.initSocket();
    this.startLocationTracking();
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  private initSocket() {
    // Use relative path for socket.io
    this.socket = io();
    
    this.socket.on('connect', () => {
      console.log('Socket connected!');
      this.isConnected.set(true);
      const currentUser = this.user();
      if (currentUser) {
        this.socket?.emit('user_authenticate', { userId: currentUser._id });
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected.set(false);
    });

    this.socket.on('user_location_updated', (data: any) => {
      console.log('Location update received from server:', data);
      const currentUser = this.user();
      if (data.userId === currentUser?._id) {
        this.user.update(u => u ? { ...u, location: data.location } : null);
      } else {
        this.otherUsers.update(users => {
          const index = users.findIndex(u => u.userId === data.userId);
          if (index > -1) {
            const newUsers = [...users];
            newUsers[index] = data;
            return newUsers;
          } else {
            return [...users, data];
          }
        });
      }
    });

    this.socket.on('error', (err) => {
      console.error('Socket error:', err);
    });
  }

  private startLocationTracking() {
    console.log('Starting location tracking...');
    if (!navigator.geolocation) {
      this.locationError.set('Geolocation is not supported by your browser');
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('New position:', latitude, longitude);
        this.locationError.set(null);
        
        // Update local UI
        this.user.update(u => u ? {
          ...u,
          location: {
            latitude,
            longitude,
            updatedAt: new Date()
          }
        } : null);

        // Emit to server
        const currentUser = this.user();
        if (this.socket?.connected && currentUser) {
          this.socket.emit('update_location', {
            userId: currentUser._id,
            latitude,
            longitude
          });
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let msg = 'Unknown error';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'Permission denied. Please allow location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'Position unavailable.';
            break;
          case error.TIMEOUT:
            msg = 'Location request timed out.';
            break;
        }
        this.locationError.set(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  simulateLocation() {
    console.log('Simulating location...');
    const lat = 19.4326 + (Math.random() - 0.5) * 0.01;
    const lng = -99.1332 + (Math.random() - 0.5) * 0.01;
    
    this.locationError.set(null);
    this.user.update(u => u ? {
      ...u,
      location: {
        latitude: lat,
        longitude: lng,
        updatedAt: new Date()
      }
    } : null);

    const currentUser = this.user();
    if (this.socket?.connected && currentUser) {
      this.socket.emit('update_location', {
        userId: currentUser._id,
        latitude: lat,
        longitude: lng
      });
    }
  }

  retryLocation() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
    }
    this.locationError.set('Requesting location...');
    this.startLocationTracking();
  }
}
