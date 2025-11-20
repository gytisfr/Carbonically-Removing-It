import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";

const API_KEY = "AIzaSyAZ27Ls3s5AzUVOSXKcGP1RFxWnIcIkvq0";
const API_URL = "http://127.0.0.1:5089";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = { lat: 57.1497, lng: -2.0943 }; // Aberdeen

export default function Tracker() {
  const [routes, setRoutes] = useState([]);
  const [clients, setClients] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [directionsList, setDirectionsList] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  const mapRef = useRef(null);
  const truckIcon =
    "https://uxwing.com/wp-content/themes/uxwing/download/logistics-shipping-delivery/delivery-truck-icon.png";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
  });

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    setSelectedRouteId(null);
  }, []);


  const fetchClients = async () => {
    try {
      const token = getToken();
      const res = await axios.get(`${API_URL}/client/fetch`, {
        headers: { token },
      });
      if (res.data.code === 200) setClients(res.data.data);
      else console.error("Client fetch failed:", res.data);
    } catch (err) {
      console.error("Client fetch error:", err);
    }
  };

  const fetchRoutes = async () => {
    try {
      const token = getToken();
      const res = await axios.get(`${API_URL}/route/fetch`, {
        headers: { token },
      });
      if (res.data.code === 200) setRoutes(res.data.data);
      else console.error("Route fetch failed:", res.data);
    } catch (err) {
      console.error("Route fetch error:", err);
    }
  };

  const fetchDrivers = async () => {
    try {
      const token = getToken();
      const res = await axios.get(`${API_URL}/driver/fetch`, {
        headers: { token },
      });
      if (res.data.code === 200) setDrivers(res.data.data);
      else console.error("Driver fetch failed:", res.data);
    } catch (err) {
      console.error("Driver fetch error:", err);
    }
  };

  const fetchTrucks = async () => {
    try {
      const token = getToken();
      const res = await axios.get(`${API_URL}/truck/fetch`, {
        headers: { token },
      });
      if (res.data.code === 200) setTrucks(res.data.data);
      else console.error("Truck fetch failed:", res.data);
    } catch (err) {
      console.error("Truck fetch error:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchClients();
      await fetchRoutes();
      await fetchDrivers();
      await fetchTrucks();
    };
    load();
  }, []);


  const buildGoogleRoute = (locationsStr) => {
    return new Promise((resolve) => {
      if (
        !window.google ||
        !window.google.maps ||
        !window.google.maps.DirectionsService
      ) {
        console.warn("Google Maps API not ready for DirectionsService.");
        return resolve(null);
      }

      const ids = locationsStr.split(",").map((x) => x.trim());
      const cityList = ids
        .map((id) => clients.find((c) => c.id.toString() === id)?.location)
        .filter(Boolean);

      if (cityList.length < 2) return resolve(null);

      const start = cityList[0];
      const end = cityList[cityList.length - 1];
      const waypoints = cityList.slice(1, -1).map((loc) => ({
        location: loc,
        stopover: true,
      }));

      const dirService = new window.google.maps.DirectionsService();
      dirService.route(
        {
          origin: start,
          destination: end,
          waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") resolve({ result, cityList });
          else {
            console.warn("Directions request failed:", status);
            resolve(null);
          }
        }
      );
    });
  };

  useEffect(() => {
    const buildRoutes = async () => {
      if (!isLoaded || !routes.length || !clients.length) return;

      const built = await Promise.all(
        routes.map((r) => buildGoogleRoute(r.locations))
      );

      const newList = routes
        .map((r, i) => {
          if (!built[i]) return null;
          return {
            id: r.id,
            directions: built[i].result,
            cities: built[i].cityList,
            truck: trucks.find((t) => t.routeid === r.id),
            driver: drivers.find(
              (d) =>
                trucks.find((t) => t.routeid === r.id)?.driverid ===
                d.id.toString()
            ),
          };
        })
        .filter(Boolean);

      setDirectionsList(newList);
    };

    buildRoutes();
  }, [routes, clients, drivers, trucks, isLoaded]);


  const focusRoute = (routeObj) => {
    if (!routeObj || !mapRef.current) return;

    const bounds = new window.google.maps.LatLngBounds();
    const path = routeObj.directions.routes[0].overview_path;
    path.forEach((point) => bounds.extend(point));

    mapRef.current.fitBounds(bounds, 100);

    const MAX_ZOOM = 12;
    if (mapRef.current.getZoom() > MAX_ZOOM) {
      mapRef.current.setZoom(MAX_ZOOM);
    }

    setSelectedRouteId(routeObj.id);
  };



  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading map…</p>
      </div>
    );
  }

  return (
    <div className="h-screen min-h-screen flex flex-row ">
      {/* MAP */}
      <main className="flex-grow p-6">
        <div className="h-full w-full bg-white rounded-sm shadow-2xl">
          <GoogleMap
            onLoad={(map) => {
              mapRef.current = map;
            }}
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={7}
            options={{
              fullscreenControl: false,
              mapTypeControl: false,
              zoomControl: false,
              streetViewControl: false,
              rotateControl: false,
              scaleControl: false,
              keyboardShortcuts: false,
              clickableIcons: false,
            }}
          >
            {directionsList.map((r, index) => {
              const path = r.directions.routes[0].overview_path;

              return (
                <div key={r.id}>
                  {/* Black outline */}
                  <Polyline
                    path={path}
                    options={{
                      strokeColor: "#000000",
                      strokeWeight: 4,
                      strokeOpacity: selectedRouteId === r.id ? 0.8 : 0.1,
                      zIndex: selectedRouteId === r.id ? 100 : index,
                    }}
                    onClick={() => focusRoute(r)}
                  />
                  {/* Colored route */}
                  <Polyline
                    path={path}
                    options={{
                      strokeColor:
                        selectedRouteId === r.id ? "#ff0000" : "#0055ff",
                      strokeWeight: 2,
                      strokeOpacity: selectedRouteId === r.id ? 1.0 : 0.1,
                      zIndex: selectedRouteId === r.id ? 101 : index + 0.1,
                    }}
                    onClick={() => focusRoute(r)}
                  />
                </div>
              );
            })}

            {/* Truck markers */}
            {directionsList.map((r) => {
              const truck = r.truck;
              if (!truck) return null;

              return (
                <Marker
                  key={`truck-${r.id}`}
                  position={{ lat: truck.lat, lng: truck.long }}
                  icon={{
                    url: truckIcon,
                    scaledSize: new window.google.maps.Size(45, 45),
                  }}
                  onClick={() => focusRoute(r)}
                />
              );
            })}
          </GoogleMap>
        </div>
      </main>

      {/* SIDEBAR */}
      <div className="h-full w-96 bg-white p-5 overflow-auto">
        <h1 className="text-3xl font-bold mb-4">Routes</h1>

        {directionsList.map((r) => (
          <div
            key={r.id}
            className={`p-4 border rounded mb-3 cursor-pointer ${
              r.id === selectedRouteId
                ? "bg-blue-200 border-blue-600"
                : "bg-gray-100"
            }`}
            onClick={() => focusRoute(r)}
          >
            <p className="font-semibold text-xl">Route {r.id}</p>
            <p className="text-gray-700">{r.cities.join(" → ")}</p>

            {selectedRouteId === r.id && (
              <div className="mt-3 text-sm">
                <p>
                  <strong>Driver:</strong> {r.driver?.name || "None"}
                </p>
                <p>
                  <strong>Driver ID:</strong> {r.driver?.id || "None"}
                </p>
                <p>
                  <strong>Truck ID:</strong> {r.truck?.id || "None"}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
