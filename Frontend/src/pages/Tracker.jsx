import React, { useState, useRef, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

/**
 * Full component: shows ALL routes between scottish cities,
 * puts truck icons at the start of each route, and lists routes
 * in the sidebar. Clicking a route in the sidebar fits the map to it.
 */

// Map container style
const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.375rem",
};

// center the map initially on Aberdeen
const initialCenter = { lat: 57.1497, lng: -2.0943 };

// Put your key here for local testing only
const GOOGLE_MAPS_API_KEY = "AIzaSyAZ27Ls3s5AzUVOSXKcGP1RFxWnIcIkvq0";

// Cities (consecutive pairs will form routes)
const scottishCities = [
  { name: "Aberdeen", lat: 57.1497, lng: -2.0943 },
  { name: "Dundee", lat: 56.4620, lng: -2.9707 },
  { name: "Edinburgh", lat: 55.9533, lng: -3.1883 },
  { name: "Glasgow", lat: 55.8642, lng: -4.2518 },
];

const truckIconUrl = "https://cdn-icons-png.flaticon.com/512/1995/1995574.png";

const Tracker = () => {
  const [allDirections, setAllDirections] = useState([]); // array of DirectionsResult objects
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);

  // Simple helper to create a Directions route promise between two coords
  const createRoutePromise = (origin, destination) =>
    new Promise((resolve, reject) => {
      if (!window.google) {
        reject(new Error("Google API not loaded"));
        return;
      }
      const service = new window.google.maps.DirectionsService();
      service.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
          optimizeWaypoints: false,
        },
        (result, status) => {
          if (status === "OK") resolve(result);
          else reject(new Error("Directions request failed: " + status));
        }
      );
    });

  // Called once when the map is loaded
  const handleMapLoad = useCallback(
    async (mapInstance) => {
      mapRef.current = mapInstance;
      setMapLoaded(true);

      // Build routes for every consecutive city pair
      const pairs = [];
      for (let i = 0; i < scottishCities.length - 1; i++) {
        const origin = scottishCities[i];
        const destination = scottishCities[i + 1];
        pairs.push({ origin, destination, index: i });
      }

      // Resolve all routes in parallel and save them in the same order
      try {
        const results = await Promise.all(
          pairs.map((p) =>
            createRoutePromise(
              { lat: p.origin.lat, lng: p.origin.lng },
              { lat: p.destination.lat, lng: p.destination.lng }
            ).then((res) => ({ ...p, directions: res }))
          )
        );

        setAllDirections(results);
      } catch (err) {
        console.error("Failed to load one or more routes:", err);
      }
    },
    [setAllDirections]
  );

  // Fit map to the given DirectionsResult (first route's overview_path)
  const fitMapToDirections = (directionsResult) => {
    if (!mapRef.current || !directionsResult) return;
    const bounds = new window.google.maps.LatLngBounds();
    const route = directionsResult.routes[0];
    // overview_path is an array of LatLng
    route.overview_path.forEach((p) => bounds.extend(p));
    mapRef.current.fitBounds(bounds);
  };

  return (
    <div className="h-screen min-h-screen flex flex-col justify-between bg-white/80">
      <main className="flex-grow flex items-center justify-center p-6">
        {/* MAP */}
        <div className="h-full w-full bg-white rounded-sm flex items-center justify-center shadow-2xl">
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} loadingElement={<div />}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={initialCenter}
              zoom={7}
              onLoad={handleMapLoad}
            >
              {/* Truck markers at each city (marker at the beginning of each route) */}
              {scottishCities.map((city, idx) => (
                <Marker
                  key={city.name}
                  position={{ lat: city.lat, lng: city.lng }}
                  title={city.name}
                  // icon object: scaledSize may be accepted; Google will adjust.
                  icon={{
                    url: truckIconUrl,
                    // scaledSize: new window.google.maps.Size(36, 36), // uncomment if you prefer using Size (only works after window.google exists)
                    scaledSize: { width: 36, height: 36 },
                  }}
                />
              ))}

              {/* Render ALL routes */}
              {allDirections.map((r) => (
                <DirectionsRenderer
                  key={r.index}
                  directions={r.directions}
                  // optional: you can style the polyline for each route here via options:
                  options={{
                    polylineOptions: {
                      strokeWeight: 5,
                      // strokeColor left default — Google supplies distinct colors for multiple renderers
                    },
                    suppressMarkers: true, // we are using our own truck markers
                  }}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>

        {/* SIDEBAR */}
        <div className="h-full w-72 bg-white rounded-sm ml-6 flex flex-col items-start justify-start shadow-2xl p-4">
          <h2 className="text-xl font-semibold mb-3">Routes</h2>

          {/* If routes are still loading */}
          {!mapLoaded && <p className="text-sm text-gray-500">Map loading…</p>}

          {/* List every consecutive route */}
          <div className="w-full space-y-2 overflow-auto max-h-[70vh]">
            {scottishCities.length <= 1 && (
              <p className="text-sm text-gray-600">Not enough cities to form routes.</p>
            )}

            {scottishCities.slice(0, -1).map((city, i) => {
              const nextCity = scottishCities[i + 1];
              const routeLabel = `${city.name} → ${nextCity?.name ?? "End"}`;
              const routeData = allDirections.find((r) => r.index === i);

              return (
                <div
                  key={i}
                  className="w-full p-2 rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    // Fit to route if we have directions
                    if (routeData?.directions) fitMapToDirections(routeData.directions);
                    else if (mapRef.current) {
                      // fallback: pan to origin if directions not ready
                      mapRef.current.panTo({ lat: city.lat, lng: city.lng });
                      mapRef.current.setZoom(10);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{routeLabel}</div>
                      <div className="text-xs text-gray-500">
                        {routeData ? "Route loaded" : "Loading route..."}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">{/* reserved for badges */}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>
              Markers show route starts (truck icons). Click a route to focus the map on it.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tracker;
