import React, { useState, useRef, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";


const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.375rem",
};


const initialCenter = { lat: 57.1497, lng: -2.0943 };

const GOOGLE_MAPS_API_KEY = "AIzaSyAZ27Ls3s5AzUVOSXKcGP1RFxWnIcIkvq0";

const scottishCities = [
  { name: "Aberdeen", lat: 57.1497, lng: -2.0943 },
  { name: "Dundee", lat: 56.4620, lng: -2.9707 },
  { name: "Edinburgh", lat: 55.9533, lng: -3.1883 },
  { name: "Glasgow", lat: 55.8642, lng: -4.2518 },
];

const truckIconUrl = "https://cdn-icons-png.flaticon.com/512/1995/1995574.png";

const Tracker = () => {
  const [allDirections, setAllDirections] = useState([]); 
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);


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


  const handleMapLoad = useCallback(
    async (mapInstance) => {
      mapRef.current = mapInstance;
      setMapLoaded(true);

      const pairs = [];
      for (let i = 0; i < scottishCities.length - 1; i++) {
        const origin = scottishCities[i];
        const destination = scottishCities[i + 1];
        pairs.push({ origin, destination, index: i });
      }

  
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


  const fitMapToDirections = (directionsResult) => {
    if (!mapRef.current || !directionsResult) return;
    const bounds = new window.google.maps.LatLngBounds();
    const route = directionsResult.routes[0];

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
              {scottishCities.map((city, idx) => (
                <Marker
                  key={city.name}
                  position={{ lat: city.lat, lng: city.lng }}
                  title={city.name}
                  icon={{
                    url: truckIconUrl,
                    scaledSize: { width: 36, height: 36 },
                  }}
                />
              ))}

              {/* Render ALL routes */}
              {allDirections.map((r) => (
                <DirectionsRenderer
                  key={r.index}
                  directions={r.directions}
                  options={{
                    polylineOptions: {
                      strokeWeight: 5,
                    },
                    suppressMarkers: true,
                  }}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>

        {/* SIDEBAR */}
        <div className="h-full w-72 bg-white rounded-sm ml-6 flex flex-col items-start justify-start shadow-2xl p-4">
          <h2 className="text-xl font-semibold mb-3">Routes</h2>

          {!mapLoaded && <p className="text-sm text-gray-500">Map loading…</p>}

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
                    if (routeData?.directions) fitMapToDirections(routeData.directions);
                    else if (mapRef.current) {
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
