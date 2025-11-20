import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:5089";

const TrucksPage = () => {
  const [form, setForm] = useState({
    routeid: "",
    long: "",
    lat: "",
    driverid: "",
    capacity: "",
  });

  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [originalTruck, setOriginalTruck] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");


  const fetchTrucks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/truck/fetch`, {
        headers: { token },
      });

      if (res.data.code === 200) setTrucks(res.data.data);
      else console.error("Failed to fetch trucks:", res.data.error);
    } catch (err) {
      console.error("Error fetching trucks:", err);
    }
  };

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/driver/fetch`, {
        headers: { token },
      });

      if (res.data.code === 200) setDrivers(res.data.data);
      else console.error("Failed to fetch drivers:", res.data.error);
    } catch (err) {
      console.error("Error fetching drivers:", err);
    }
  };

  const fetchRoutes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/route/fetch`, {
        headers: { token },
      });

      if (res.data.code === 200) setRoutes(res.data.data);
      else console.error("Failed to fetch routes:", res.data.error);
    } catch (err) {
      console.error("Error fetching routes:", err);
    }
  };

  useEffect(() => {
    fetchTrucks();
    fetchDrivers();
    fetchRoutes();
  }, []);

 

  const handleSubmit = async () => {
    if (!form.routeid || !form.long || !form.lat) {
      return alert("Please fill in Route, Longitude and Latitude!");
    }

    try {
      const token = localStorage.getItem("token");

      const params = {
        routeid: String(form.routeid),
        long: Number(form.long),
        lat: Number(form.lat),
      };

      if (form.driverid) params.driverid = Number(form.driverid);
      if (form.capacity) params.capacity = Number(form.capacity);

      await axios.post(`${API_URL}/truck`, null, {
        params,
        headers: { token },
      });

      alert("Truck created successfully!");
      setForm({
        routeid: "",
        long: "",
        lat: "",
        driverid: "",
        capacity: "",
      });

      fetchTrucks();
    } catch (error) {
      console.error("Create truck error:", error);
      alert("Failed to create truck.");
    }
  };



  const handleEdit = async () => {
    if (!selectedTruck) return alert("Select a truck first!");

    try {
      const token = localStorage.getItem("token");

      // Only allow editing these fields (not id)
      const fields = ["routeid", "long", "lat", "driverid", "capacity"];

      for (const key of fields) {
        if (selectedTruck[key] !== originalTruck[key]) {
          await axios.patch(
            `${API_URL}/truck`,
            null,
            {
              params: {
                id: selectedTruck.id,
                what: key,
                to: selectedTruck[key],
              },
              headers: { token },
            }
          );
        }
      }

      alert("Truck updated successfully!");
      fetchTrucks();
    } catch (error) {
      console.error("Error editing truck:", error);
      alert("Failed to update truck.");
    }
  };

  // -------- DELETE TRUCK --------

  const handleDelete = async () => {
    if (!selectedTruck) return;
    if (!window.confirm("Are you sure you want to delete this truck?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/truck`, {
        params: { id: selectedTruck.id },
        headers: { token },
      });

      alert("Truck deleted successfully!");
      setSelectedTruck(null);
      setOriginalTruck(null);
      fetchTrucks();
    } catch (err) {
      console.error("Delete truck error:", err);
      alert("Failed to delete truck.");
    }
  };


  return (
    <div className="h-screen min-h-screen flex flex-col justify-between">
      <main className="h-full w-full gap-6 grid grid-cols-3 grid-rows-1 items-start justify-center p-6">

        {/* Create Truck */}
        <div className="h-full min-h-full w-full bg-white rounded-sm p-6 flex flex-col">
          <p className="text-2xl">Create New Truck</p>

          <div className="mt-6 space-y-4">
            <div>
              <p>Route</p>
              <select
                value={form.routeid}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, routeid: e.target.value }))
                }
                className="border-black border-2 p-2 rounded-sm w-full"
              >
                <option value="">-- Select Route --</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p>Longitude</p>
              <input
                type="number"
                value={form.long}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, long: e.target.value }))
                }
                className="border-black border-2 p-2 rounded-sm w-full"
              />
            </div>

            <div>
              <p>Latitude</p>
              <input
                type="number"
                value={form.lat}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, lat: e.target.value }))
                }
                className="border-black border-2 p-2 rounded-sm w-full"
              />
            </div>

            <div>
              <p>Driver</p>
              <select
                value={form.driverid}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, driverid: e.target.value }))
                }
                className="border-black border-2 p-2 rounded-sm w-full"
              >
                <option value="">-- None --</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.id} — {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p>Capacity</p>
              <input
                type="number"
                value={form.capacity}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, capacity: e.target.value }))
                }
                className="border-black border-2 p-2 rounded-sm w-full"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-black text-white p-2 rounded-md mt-auto cursor-pointer"
          >
            Save Truck
          </button>
        </div>

        {/* Display All Trucks */}
        <div className="h-full min-h-full w-full bg-white rounded-sm p-6 flex flex-col">
          <p className="text-2xl mb-4">All Trucks</p>

          <input
            type="text"
            placeholder="Search by ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-black p-2 rounded mb-4"
          />

          <div className="overflow-y-auto max-h-[70vh]">
            {trucks
              .filter((t) => t.id.toString().includes(searchTerm))
              .map((t) => (
                <div key={t.id} className="border-b border-gray-300 py-2">
                  <p><strong>ID:</strong> {t.id}</p>
                  <p><strong>Route:</strong> {t.routeid}</p>
                  <p><strong>Longitude:</strong> {t.long}</p>
                  <p><strong>Latitude:</strong> {t.lat}</p>
                  <p><strong>Driver ID:</strong> {t.driverid ?? "None"}</p>
                  <p><strong>Capacity:</strong> {t.capacity ?? "None"}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Edit Truck */}
        <div className="h-full min-h-full w-full bg-white rounded-sm p-6 flex flex-col">
          <p className="text-2xl">Edit Truck</p>

          <label className="mt-4 mb-2 font-medium">Select Truck:</label>
          <select
            className="border-2 border-black p-2 rounded mb-4"
            onChange={(e) => {
              const truck = trucks.find(
                (t) => t.id.toString() === e.target.value
              );
              if (!truck) {
                setSelectedTruck(null);
                setOriginalTruck(null);
                return;
              }
              setSelectedTruck({ ...truck });
              setOriginalTruck({ ...truck });
            }}
          >
            <option value="">-- Select a Truck --</option>
            {trucks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.id}
              </option>
            ))}
          </select>

          {selectedTruck && (
            <>
              <div className="space-y-2">
                <div>
                  <p>ID (read-only)</p>
                  <input
                    type="number"
                    value={selectedTruck.id}
                    disabled
                    className="border-2 border-gray-400 bg-gray-100 p-2 rounded w-full"
                  />
                </div>

                <div>
                  <p>Route</p>
                  <select
                    value={selectedTruck.routeid}
                    onChange={(e) =>
                      setSelectedTruck((prev) => ({
                        ...prev,
                        routeid: e.target.value,
                      }))
                    }
                    className="border-2 border-black p-2 rounded w-full"
                  >
                    <option value="">-- Select Route --</option>
                    {routes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p>Longitude</p>
                  <input
                    type="number"
                    value={selectedTruck.long}
                    onChange={(e) =>
                      setSelectedTruck((prev) => ({
                        ...prev,
                        long: e.target.value,
                      }))
                    }
                    className="border-2 border-black p-2 rounded w-full"
                  />
                </div>

                <div>
                  <p>Latitude</p>
                  <input
                    type="number"
                    value={selectedTruck.lat}
                    onChange={(e) =>
                      setSelectedTruck((prev) => ({
                        ...prev,
                        lat: e.target.value,
                      }))
                    }
                    className="border-2 border-black p-2 rounded w-full"
                  />
                </div>

                <div>
                  <p>Driver</p>
                  <select
                    value={selectedTruck.driverid ?? ""}
                    onChange={(e) =>
                      setSelectedTruck((prev) => ({
                        ...prev,
                        driverid: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                    className="border-2 border-black p-2 rounded w-full"
                  >
                    <option value="">-- None --</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.id} — {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p>Capacity</p>
                  <input
                    type="number"
                    value={selectedTruck.capacity ?? ""}
                    onChange={(e) =>
                      setSelectedTruck((prev) => ({
                        ...prev,
                        capacity: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                    className="border-2 border-black p-2 rounded w-full"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleEdit}
                  className="bg-black text-white p-2 rounded-md cursor-pointer"
                >
                  Save Changes
                </button>

                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white p-2 rounded-md cursor-pointer"
                >
                  Delete Truck
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default TrucksPage;
