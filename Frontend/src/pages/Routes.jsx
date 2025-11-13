import { useState, useEffect } from "react";
import axios from "axios";

const RoutesPage = () => {
  const [form, setForm] = useState({
    id: "",
    clients: [""],
  });

  const [routes, setRoutes] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [originalRoute, setOriginalRoute] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all routes
  const fetchRoutes = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5089/route/fetch");
      if (res.data.code === 200) setRoutes(res.data.data);
      else console.error("Failed to fetch routes:", res.data.error);
    } catch (err) {
      console.error("Error fetching routes:", err);
    }
  };

  // Fetch all clients
  const fetchClients = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5089/client/fetch");
      if (res.data.code === 200) setClients(res.data.data);
      else console.error("Failed to fetch clients:", res.data.error);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchRoutes();
  }, []);

  // Create new route
  const handleSubmit = async () => {
    if (!form.id.trim()) return alert("Route ID cannot be empty!");

    const clientIDs = form.clients.filter(Boolean);
    const hasDuplicates = new Set(clientIDs).size !== clientIDs.length;
    if (hasDuplicates) return alert("Duplicate client IDs are not allowed!");

    try {
      const clientsStr = clientIDs.join(", ");
      await axios.post(
        "http://127.0.0.1:5089/route",
        null,
        { params: { id: form.id, locations: clientsStr } }
      );
      alert("Route created successfully!");
      setForm({ id: "", clients: [""] });
      fetchRoutes();
    } catch (error) {
      console.error(error);
      alert("Failed to create route.");
    }
  };

  // Edit selected route
  const handleEdit = async () => {
    if (!selectedRoute) return alert("Select a route first!");
    if (!selectedRoute.id.trim()) return alert("Route ID cannot be empty!");

    const clientIDs = selectedRoute.clients.filter(Boolean);
    const hasDuplicates = new Set(clientIDs).size !== clientIDs.length;
    if (hasDuplicates) return alert("Duplicate client IDs are not allowed!");

    try {
      // Update 'id' if changed
      if (selectedRoute.id !== originalRoute.id) {
        await axios.patch(
          "http://127.0.0.1:5089/route",
          null,
          { params: { id: originalRoute.id, what: "id", to: selectedRoute.id } }
        );
      }

      // Update 'locations' if changed
      const locStr = clientIDs.join(", ");
      if (locStr !== originalRoute.locations) {
        await axios.patch(
          "http://127.0.0.1:5089/route",
          null,
          { params: { id: selectedRoute.id, what: "locations", to: locStr } }
        );
      }

      alert("Route updated successfully!");
      fetchRoutes();
    } catch (error) {
      console.error("Error editing route:", error);
      alert("Failed to update route.");
    }
  };

  return (
    <div className="h-screen min-h-screen flex flex-col justify-between">
      <main className="h-full w-full gap-6 grid grid-cols-3 grid-rows-1 items-start justify-center p-6">

        {/* Create Route */}
        <div className="h-full w-full bg-white rounded-sm p-6 flex flex-col">
          <p className="text-2xl">Create New Route</p>

          <div className="mt-6 space-y-4">
            <div>
              <p>Route ID</p>
              <input
                value={form.id}
                type="number"
                onChange={(e) => setForm(prev => ({ ...prev, id: e.target.value }))}
                className="border-black border-2 p-2 rounded-sm w-full"
              />
            </div>

            <div>
              <p>Client IDs</p>
              {form.clients.map((clientID, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <select
                    value={clientID}
                    onChange={(e) => {
                      const newClients = [...form.clients];
                      newClients[index] = e.target.value;
                      setForm(prev => ({ ...prev, clients: newClients }));
                    }}
                    className="border-black border-2 p-2 rounded-sm w-full"
                  >
                    <option value="">-- Select Client --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.id} — {c.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      const newClients = form.clients.filter((_, i) => i !== index);
                      setForm(prev => ({ ...prev, clients: newClients }));
                    }}
                    className="bg-red-500 text-white px-2 rounded cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}

              <button
                onClick={() =>
                  setForm(prev => ({ ...prev, clients: [...prev.clients, ""] }))
                }
                className="bg-gray-200 p-1 rounded text-black mt-2 px-3 cursor-pointer"
              >
                + Add Client
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-black text-white p-2 rounded-md mt-auto cursor-pointer"
          >
            Save Route Information
          </button>
        </div>

        {/* Display All Routes with Search by ID */}
        <div className="h-full w-full bg-white rounded-sm p-6 flex flex-col">
          <p className="text-2xl mb-4">All Routes</p>

          <input
            type="text"
            placeholder="Search by Route ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-black p-2 rounded mb-4"
          />

          <div className="overflow-y-auto max-h-[70vh]">
            {routes
              .filter(route =>
                route.id.toString().includes(searchTerm)
              )
              .map(route => (
                <div key={route.id} className="border-b border-gray-300 py-2">
                  <p><strong>ID:</strong> {route.id}</p>
                  <p><strong>Clients:</strong> {route.locations}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Edit Route */}
        <div className="h-full w-full bg-white rounded-sm p-6 flex flex-col">
          <p className="text-2xl">Edit Route</p>

          <label className="mt-4 mb-2 font-medium">Select Route:</label>
          <select
            className="border-2 border-black p-2 rounded mb-4"
            onChange={(e) => {
              const route = routes.find(r => r.id.toString() === e.target.value);
              if (!route) return setSelectedRoute(null);
              const clientArray = route.locations ? route.locations.split(",").map(c => c.trim()) : [""];
              setSelectedRoute({ ...route, clients: clientArray });
              setOriginalRoute({ ...route, locations: route.locations });
            }}
          >
            <option value="">-- Select a Route --</option>
            {routes.map(route => (
              <option key={route.id} value={route.id}>
                {route.id} — {route.locations}
              </option>
            ))}
          </select>

          {selectedRoute && (
            <>
              <label className="mb-2 font-medium">Route ID:</label>
              <input
                type="text"
                value={selectedRoute.id}
                onChange={(e) =>
                  setSelectedRoute(prev => ({ ...prev, id: e.target.value }))
                }
                className="border-2 border-black p-2 rounded mb-4"
              />

              <label className="mb-2 font-medium">Client IDs:</label>
              {selectedRoute.clients.map((clientID, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <select
                    value={clientID}
                    onChange={(e) => {
                      const newClients = [...selectedRoute.clients];
                      newClients[index] = e.target.value;
                      setSelectedRoute(prev => ({ ...prev, clients: newClients }));
                    }}
                    className="border-black border-2 p-2 rounded-sm w-full"
                  >
                    <option value="">-- Select Client --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.id} — {c.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      const newClients = selectedRoute.clients.filter((_, i) => i !== index);
                      setSelectedRoute(prev => ({ ...prev, clients: newClients }));
                    }}
                    className="bg-red-500 text-white px-2 rounded"
                  >
                    ×
                  </button>
                </div>
              ))}

              <button
                onClick={() =>
                  setSelectedRoute(prev => ({ ...prev, clients: [...prev.clients, ""] }))
                }
                className="bg-gray-200 p-1 rounded text-black mb-4"
              >
                + Add Client
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="bg-black text-white p-2 rounded-md cursor-pointer"
                >
                  Save Changes
                </button>

                <button
                  onClick={async () => {
                    if (!window.confirm("Are you sure you want to delete this route?")) return;
                    try {
                      await axios.delete("http://127.0.0.1:5089/route", { params: { id: selectedRoute.id } });
                      alert("Route deleted successfully!");
                      setSelectedRoute(null);
                      fetchRoutes();
                    } catch (err) {
                      console.error(err);
                      alert("Failed to delete route.");
                    }
                  }}
                  className="bg-red-600 text-white p-2 rounded-md cursor-pointer"
                >
                  Delete Route
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default RoutesPage;
