import { Component, OnInit, OnDestroy, inject, signal, computed, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule, GoogleMap } from '@angular/google-maps';
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
  @ViewChild(GoogleMap) map!: GoogleMap;
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

  constructor() {
    // Auto-center map when users change
    effect(() => {
      const users = this.allUsers();
      if (users.length > 0 && this.map) {
        // Debounce slightly to allow map to init
        setTimeout(() => this.fitBoundsToUsers(), 500);
      }
    });
  }

  ngOnInit() {
    // Initial load
    setTimeout(() => this.fitBoundsToUsers(), 1000);
  }



  fitBoundsToUsers() {
    const users = this.allUsers();
    if (users.length === 0 || !this.map) return;

    const bounds = new google.maps.LatLngBounds();
    let hasPoints = false;

    users.forEach(user => {
      if (user.location.latitude && user.location.longitude) {
        bounds.extend({
          lat: user.location.latitude,
          lng: user.location.longitude
        });
        hasPoints = true;
      }
    });
    
    if (hasPoints) {
      this.map.fitBounds(bounds);
      
      // If only one user or very close points, fitBounds might zoom in too much
      // Adjust if needed logic could go here, but Google Maps handles it reasonably well usually
      // For single point it might stay at previous zoom or max zoom
      if (users.length === 1) {
         this.map.panTo({
           lat: users[0].location.latitude,
           lng: users[0].location.longitude
         });
         this.zoom.set(15);
      }
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

  // TODO: Remove this simulation logic before production release
  // Simulation Logic
  isSimulating = signal(false);
  private simulationInterval: any;

  toggleSimulation() {
    this.isSimulating.update(v => !v);
    
    if (this.isSimulating()) {
      this.startSimulation();
    } else {
      this.stopSimulation();
    }
  }

  private startSimulation() {
    let lat = this.center().lat;
    let lng = this.center().lng;
    
    // Find current user location to start from if available
    const currentUser = this.allUsers().find(u => u.userId === this.currentUser()?._id);
    if (currentUser) {
      lat = currentUser.location.latitude;
      lng = currentUser.location.longitude;
    }

    this.simulationInterval = setInterval(() => {
      // Move slightly (approx 10-20 meters)
      lat += (Math.random() - 0.5) * 0.002;
      lng += (Math.random() - 0.5) * 0.002;
      
      this.locationService.updateUserLocation(lat, lng);
    }, 2000);
  }

  private stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  ngOnDestroy() {
    this.stopSimulation();
  }
}
