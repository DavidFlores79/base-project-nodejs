import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { LocationService, UserLocation } from '../../services/location.service';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  protected locationService = inject(LocationService);
  private authService = inject(AuthService);

  // Map configuration
  center = signal<google.maps.LatLngLiteral>({ lat: 19.4326, lng: -99.1332 }); // Mexico City default
  zoom = signal<number>(12);
  mapOptions = signal<google.maps.MapOptions>({
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 20,
    minZoom: 3,
    styles: [
      {
        "elementType": "geometry",
        "stylers": [{ "color": "#212121" }]
      },
      {
        "elementType": "labels.icon",
        "stylers": [{ "visibility": "off" }]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#212121" }]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "color": "#38414e" }]
      },
      {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{ "color": "#212a37" }]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#000000" }]
      }
    ]
  });

  // User data
  currentUser = signal(this.authService.getCurrentUser());
  allUsers = this.locationService.allUsers;
  selectedUser = signal<UserLocation | null>(null);
  
  // Computed markers
  markers = computed(() => {
    return this.allUsers().map(user => ({
      position: {
        lat: user.location.latitude,
        lng: user.location.longitude
      },
      title: user.username,
      options: {
        icon: {
          url: user.userId === this.currentUser()?._id 
            ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new google.maps.Size(40, 40)
        }
      },
      user: user
    }));
  });

  ngOnInit() {
    // Auto-center map on users
    this.centerMapOnUsers();
    
    // Re-center when users update
    this.locationService.allUsers.set = new Proxy(this.locationService.allUsers.set, {
      apply: (target, thisArg, args) => {
        const result = Reflect.apply(target, thisArg, args);
        this.centerMapOnUsers();
        return result;
      }
    });
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  centerMapOnUsers() {
    const users = this.allUsers();
    if (users.length === 0) return;

    if (users.length === 1) {
      this.center.set({
        lat: users[0].location.latitude,
        lng: users[0].location.longitude
      });
      this.zoom.set(15);
    } else {
      // Calculate bounds to fit all markers
      const bounds = new google.maps.LatLngBounds();
      users.forEach(user => {
        bounds.extend({
          lat: user.location.latitude,
          lng: user.location.longitude
        });
      });
      
      const center = bounds.getCenter();
      this.center.set({ lat: center.lat(), lng: center.lng() });
      this.zoom.set(12); // Will auto-adjust based on bounds
    }
  }

  onMarkerClick(user: UserLocation) {
    this.selectedUser.set(user);
  }

  closeInfoWindow() {
    this.selectedUser.set(null);
  }

  getUserDisplayName(user: UserLocation): string {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username;
  }

  getLastUpdateTime(user: UserLocation): string {
    const date = new Date(user.location.updatedAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  isCurrentUser(user: UserLocation): boolean {
    return user.userId === this.currentUser()?._id;
  }
}
