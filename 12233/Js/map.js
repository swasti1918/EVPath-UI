// Map Initialization
let map;
let directionsService;
let directionsRenderer;
let markers = [];
let infoWindow;
let userLocation = null;

function initMap() {
  // Create the map
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 0, lng: 0 },
    zoom: 2,
    styles: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#2c3e50' }]
      },
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{ color: '#1a2b3c' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#0e1a26' }]
      }
    ]
  });

  // Initialize services
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: '#00e676',
      strokeOpacity: 0.8,
      strokeWeight: 4
    }
  });

  infoWindow = new google.maps.InfoWindow();

  // Try to get user's current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.setCenter(userLocation);
        map.setZoom(14);
        addUserMarker(userLocation);
      },
      () => {
        // Default to a known location if geolocation fails
        userLocation = { lat: 51.5074, lng: -0.1278 }; // London
        map.setCenter(userLocation);
        map.setZoom(12);
      }
    );
  } else {
    // Browser doesn't support Geolocation
    userLocation = { lat: 51.5074, lng: -0.1278 }; // London
    map.setCenter(userLocation);
    map.setZoom(12);
  }

  // Initialize UI components
  initSearch();
  initRouteControls();
  initBottomNav();
}

// Add user marker to the map
function addUserMarker(position) {
  const marker = new google.maps.Marker({
    position: position,
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: '#00e676',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2
    }
  });
  markers.push(marker);
}

// Initialize search functionality
function initSearch() {
  const searchInput = document.querySelector('.search-input input');
  const searchBox = new google.maps.places.SearchBox(searchInput);

  searchBox.addListener('places_changed', () => {
    const places = searchBox.getPlaces();
    if (places.length === 0) return;

    // Clear previous markers
    clearMarkers();

    // For each place, add a marker
    const bounds = new google.maps.LatLngBounds();
    places.forEach(place => {
      if (!place.geometry) return;

      const marker = new google.maps.Marker({
        map: map,
        title: place.name,
        position: place.geometry.location
      });

      markers.push(marker);

      // Create info window content
      const content = `
        <div class="info-window">
          <h3>${place.name}</h3>
          ${place.formatted_address ? `<p>${place.formatted_address}</p>` : ''}
          <button class="btn-set-destination" data-lat="${place.geometry.location.lat()}" data-lng="${place.geometry.location.lng()}">
            Set as Destination
          </button>
        </div>
      `;

      // Add click listener to marker
      marker.addListener('click', () => {
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
      });

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

// Initialize route controls
function initRouteControls() {
  const originInput = document.getElementById('origin');
  const destinationInput = document.getElementById('destination');
  const calculateBtn = document.getElementById('calculate-route');

  // Autocomplete for inputs
  const originAutocomplete = new google.maps.places.Autocomplete(originInput);
  const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);

  // Set default origin to current location if available
  if (userLocation) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: userLocation }, (results, status) => {
      if (status === 'OK' && results[0]) {
        originInput.value = results[0].formatted_address;
      }
    });
  }

  // Calculate route when button is clicked
  calculateBtn.addEventListener('click', calculateRoute);
}

// Calculate and display route
function calculateRoute() {
  const originInput = document.getElementById('origin');
  const destinationInput = document.getElementById('destination');

  if (!originInput.value || !destinationInput.value) {
    alert('Please enter both origin and destination');
    return;
  }

  showLoading(true);

  const request = {
    origin: originInput.value,
    destination: destinationInput.value,
    travelMode: 'DRIVING',
    provideRouteAlternatives: true,
    drivingOptions: {
      departureTime: new Date(),
      trafficModel: 'bestguess'
    }
  };

  directionsService.route(request, (response, status) => {
    showLoading(false);
    
    if (status === 'OK') {
      directionsRenderer.setDirections(response);
      showChargingStationsAlongRoute(response.routes[0]);
    } else {
      alert('Directions request failed: ' + status);
    }
  });
}

// Show charging stations along the route
function showChargingStationsAlongRoute(route) {
  // In a real app, this would query your backend or a charging station API
  // For demo purposes, we'll simulate some stations
  
  clearMarkers();
  
  // Get the route path
  const path = route.overview_path;
  
  // Simulate finding stations every ~50km along the route
  const stations = [];
  const step = Math.floor(path.length / 5);
  
  for (let i = step; i < path.length; i += step) {
    const point = path[i];
    stations.push({
      position: point,
      name: `Charging Station ${stations.length + 1}`,
      address: 'Simulated location',
      available: Math.random() > 0.3 ? 'Available' : 'Occupied',
      type: Math.random() > 0.5 ? 'Fast' : 'Standard'
    });
  }
  
  // Add markers for stations
  stations.forEach(station => {
    const marker = new google.maps.Marker({
      position: station.position,
      map: map,
      icon: {
        url: station.type === 'Fast' ? 'images/fast-charger.png' : 'images/standard-charger.png',
        scaledSize: new google.maps.Size(32, 32)
      }
    });
    
    markers.push(marker);
    
    // Create info window content
    const content = `
      <div class="info-window">
        <h3>${station.name}</h3>
        <p>${station.address}</p>
        <p>Status: <span class="${station.available === 'Available' ? 'available' : 'occupied'}">${station.available}</span></p>
        <p>Type: ${station.type} Charger</p>
        <button class="btn-add-stop" data-lat="${station.position.lat()}" data-lng="${station.position.lng()}">
          Add as Stop
        </button>
      </div>
    `;
    
    marker.addListener('click', () => {
      infoWindow.setContent(content);
      infoWindow.open(map, marker);
    });
  });
  
  // Show stations panel
  showStationsPanel(stations);
}

// Show stations in the side panel
function showStationsPanel(stations) {
  const panel = document.querySelector('.stations-panel');
  const list = document.querySelector('.stations-list');
  
  list.innerHTML = '';
  
  stations.forEach(station => {
    const item = document.createElement('div');
    item.className = 'station-item';
    item.innerHTML = `
      <div class="station-info">
        <h4>${station.name}</h4>
        <p>${station.address}</p>
        <div class="station-meta">
          <span class="status ${station.available === 'Available' ? 'available' : 'occupied'}">${station.available}</span>
          <span class="type">${station.type}</span>
        </div>
      </div>
      <button class="btn-add-stop" data-lat="${station.position.lat()}" data-lng="${station.position.lng()}">
        <i class="material-icons">add_location</i>
      </button>
    `;
    
    list.appendChild(item);
  });
  
  panel.classList.add('active');
}

// Clear all markers from the map
function clearMarkers() {
  markers.forEach(marker => {
    marker.setMap(null);
  });
  markers = [];
}

// Initialize bottom navigation
function initBottomNav() {
  const navButtons = document.querySelectorAll('.nav-btn');
  
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      navButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Handle panel visibility
      const panel = button.getAttribute('data-panel');
      togglePanel(panel);
    });
  });
  
  // Close button for stations panel
  document.getElementById('close-stations').addEventListener('click', () => {
    document.querySelector('.stations-panel').classList.remove('active');
  });
}

// Toggle panel visibility
function togglePanel(panel) {
  // Hide all panels first
  document.querySelector('.search-panel').classList.remove('active');
  document.querySelector('.route-controls').classList.remove('active');
  
  // Show selected panel
  if (panel === 'search') {
    document.querySelector('.search-panel').classList.add('active');
  } else if (panel === 'route') {
    document.querySelector('.route-controls').classList.add('active');
  } else if (panel === 'stations') {
    document.querySelector('.stations-panel').classList.add('active');
  }
}

// Show/hide loading overlay
function showLoading(show) {
  document.querySelector('.loading-overlay').classList.toggle('active', show);
}

// Initialize the map when the window loads
window.initMap = initMap;