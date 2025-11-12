import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

// Map container style
const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.375rem",
};

const initialCenter = { lat: 57.1497, lng: -2.0943 }; // Aberdeen


const GOOGLE_MAPS_API_KEY = "AIzaSyAZ27Ls3s5AzUVOSXKcGP1RFxWnIcIkvq0";

const scottishCities = [
  { name: "Aberdeen", lat: 57.1497, lng: -2.0943 },
  { name: "Dundee", lat: 56.462, lng: -2.9707 },
  { name: "Edinburgh", lat: 55.9533, lng: -3.1883 },
  { name: "Glasgow", lat: 55.8642, lng: -4.2518 },
];

const truckIcon = {
  url: "https://uxwing.com/wp-content/themes/uxwing/download/logistics-shipping-delivery/delivery-truck-icon.png",
  scaledSize: { width: 40, height: 40 },
};

const Tracker = () => {
  const mapRef = useRef(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [directionsList, setDirectionsList] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);


  const createRoute = (origin, destination) =>
    new Promise((resolve, reject) => {
      const service = new window.google.maps.DirectionsService();
      service.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") resolve(result);
          else reject(status);
        }
      );
    });


  const handleMapLoad = useCallback(async (map) => {
    mapRef.current = map;
    const routes = [];

    for (let i = 0; i < scottishCities.length - 1; i++) {
      const origin = scottishCities[i];
      const destination = scottishCities[i + 1];
      routes.push({ origin, destination, index: i });
    }

    try {
      const results = await Promise.all(
        routes.map((r) =>
          createRoute(r.origin, r.destination).then((directions) => ({
            ...r,
            directions,

            driver: `Driver ${r.index + 1}`,
            truckType: ["Truck 1", "Truck 2", "Truck 3", "Truck 4"][r.index % 4],
          }))
        )
      );
      setDirectionsList(results);
    } catch (err) {
      console.error("Error loading routes:", err);
    }
  }, []);

  /** Fit map view to specific route */
  const fitToRoute = (directionsResult) => {
    if (!mapRef.current || !directionsResult) return;
    const bounds = new window.google.maps.LatLngBounds();
    directionsResult.routes[0].overview_path.forEach((p) => bounds.extend(p));
    mapRef.current.fitBounds(bounds);
  };

  /** Handle route selection */
  const handleSelectRoute = (route) => {
    fitToRoute(route.directions);
    setSelectedRoute(route);
  };

  return (
    <div className="h-screen flex bg-white/80">
      <LoadScript
        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
        onLoad={() => setIsScriptLoaded(true)}
      >
        <main className="flex-grow flex items-center justify-center p-6">
          {/* MAP SECTION */}
          <div className="h-full w-full bg-white rounded-sm shadow-2xl relative">
            {isScriptLoaded && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={initialCenter}
                zoom={7}
                onLoad={handleMapLoad}
                options={{
                  mapTypeControl: false,
                  fullscreenControl: false,
                }}
              >
                {/* Truck markers */}
                {scottishCities.map((city) => (
                  <Marker
                    key={city.name}
                    position={{ lat: city.lat, lng: city.lng }}
                    icon={truckIcon}
                    title={city.name}
                  />
                ))}

                {/* Render all routes */}
                {directionsList.map((r) => (
                  <DirectionsRenderer
                    key={r.index}
                    directions={r.directions}
                    options={{
                      suppressMarkers: true,
                      polylineOptions: {
                        strokeWeight: 5,
                        strokeColor:
                          selectedRoute?.index === r.index
                            ? "#1E90FF"
                            : "#999999",
                      },
                    }}
                  />
                ))}
              </GoogleMap>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="h-full w-80 bg-white rounded-sm ml-6 flex flex-col items-start shadow-2xl p-4 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-3">Routes</h2>

            {directionsList.length === 0 && (
              <p className="text-sm text-gray-500">Loading routes...</p>
            )}

            {directionsList.map((r) => (
              <div
                key={r.index}
                className={`w-full p-2 mb-2 rounded-md border ${
                  selectedRoute?.index === r.index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                } cursor-pointer`}
                onClick={() => handleSelectRoute(r)}
              >
                <p className="font-medium text-sm">
                  {r.origin.name} → {r.destination.name}
                </p>
                <p className="text-xs text-gray-500">Click for details</p>
              </div>
            ))}

            {/* ROUTE DETAILS */}
            {selectedRoute && (
              <div className="mt-4 w-full p-3 border border-gray-300 rounded-lg bg-gray-50">
                <h3 className="font-semibold text-lg mb-2">
                  Route Details
                </h3>
                <p>
                  <strong>From:</strong> {selectedRoute.origin.name}
                </p>
                <p>
                  <strong>To:</strong> {selectedRoute.destination.name}
                </p>
                <p>
                  <strong>Driver:</strong> {selectedRoute.driver}
                </p>
                <p>
                  <strong>Truck Type:</strong> {selectedRoute.truckType}
                </p>
              </div>
            )}
          </div>
        </main>
      </LoadScript>
    </div>
  );
};

export default Tracker;
