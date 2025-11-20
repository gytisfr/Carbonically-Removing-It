import { useState, useEffect } from "react";
import axios from "axios";

const DriversPage = () => {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    id: "",
    name: "",
    position: "",
  });

  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [originalDriver, setOriginalDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const fetchDrivers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5089/driver/fetch", {
        headers: { token },
      });

      if (res.data.code === 200) {
        setDrivers(res.data.data);
      } else {
        console.error("Failed to fetch drivers:", res.data.error);
      }
    } catch (err) {
      console.error("Error fetching drivers:", err);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Create new driver
  const handleSubmit = async () => {
    if (!form.name || !form.position) {
      return alert("Please fill in all required fields!");
    }

    try {
      await axios.post(
        "http://127.0.0.1:5089/driver",
        null,
        {
          params: { name: form.name, position: form.position },
          headers: { token },
        }
      );

      alert("Driver created successfully!");
      setForm({ id: "", name: "", position: "" });
      fetchDrivers();
    } catch (error) {
      console.error(error);
      alert("Failed to create driver.");
    }
  };

  // Edit driver
  const handleEdit = async () => {
    if (!selectedDriver) return alert("Select a driver first!");

    try {
      for (const key of ["id", "name", "position"]) {
        if (selectedDriver[key] !== originalDriver[key]) {
          await axios.patch(
            "http://127.0.0.1:5089/driver",
            null,
            {
              params: {
                id: originalDriver.id,
                what: key,
                to: selectedDriver[key],
              },
              headers: { token },
            }
          );
        }
      }

      alert("Driver updated successfully!");
      fetchDrivers();
    } catch (error) {
      console.error("Error editing driver:", error);
      alert("Failed to update driver.");
    }
  };

  // Delete driver
  const handleDelete = async () => {
    if (!selectedDriver) return;

    if (!window.confirm("Are you sure you want to delete this driver?")) return;

    try {
      await axios.delete("http://127.0.0.1:5089/driver", {
        params: { id: selectedDriver.id },
        headers: { token },
      });

      alert("Driver deleted successfully!");
      setSelectedDriver(null);
      fetchDrivers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete driver.");
    }
  };

  return (
    <div className="h-screen min-h-screen flex flex-col justify-between">
      <main className="h-full w-full gap-6 grid grid-cols-3 grid-rows-1 items-start justify-center p-6">
        <div className="h-full w-full bg-white rounded-sm p-6 flex flex-col">

          <p className="text-2xl">Create New Driver</p>
          <div className="mt-6 space-y-4">

            <div>
              <p>Name</p>
              <input
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="border-black border-2 p-2 rounded-sm w-full"
              />
            </div>

            <div>
              <p>Position</p>
              <input
                value={form.position}
                onChange={(e) => setForm(prev => ({ ...prev, position: e.target.value }))}
                className="border-black border-2 p-2 rounded-sm w-full"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-black text-white p-2 rounded-md mt-auto cursor-pointer"
          >
            Save Driver
          </button>
        </div>

        {/* Display All Drivers */}
        <div className="h-full w-full bg-white rounded-sm p-6 flex flex-col">
          <p className="text-2xl mb-4">All Drivers</p>

          <input
            type="text"
            placeholder="Search by ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-black p-2 rounded mb-4"
          />

          <div className="overflow-y-auto max-h-[70vh]">
            {drivers
              .filter(d => d.id.toString().includes(searchTerm))
              .map(d => (
                <div key={d.id} className="border-b border-gray-300 py-2">
                  <p><strong>ID:</strong> {d.id}</p>
                  <p><strong>Name:</strong> {d.name}</p>
                  <p><strong>Position:</strong> {d.position}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Edit Driver */}
        <div className="h-full w-full bg-white rounded-sm p-6 flex flex-col">
          <p className="text-2xl">Edit Driver</p>

          <label className="mt-4 mb-2 font-medium">Select Driver:</label>
          <select
            className="border-2 border-black p-2 rounded mb-4"
            onChange={(e) => {
              const driver = drivers.find(d => d.id.toString() === e.target.value);
              setSelectedDriver(driver ? { ...driver } : null);
              setOriginalDriver(driver ? { ...driver } : null);
            }}
          >
            <option value="">-- Select a Driver --</option>
            {drivers.map(d => (
              <option key={d.id} value={d.id}>
                {d.id} — {d.name}
              </option>
            ))}
          </select>

          {selectedDriver && (
            <>
              <div className="space-y-2">
                <div>
                  <p>ID</p>
                  <input
                    type="number"
                    value={selectedDriver.id}
                    onChange={(e) => setSelectedDriver(prev => ({ ...prev, id: e.target.value }))}
                    className="border-2 border-black p-2 rounded w-full"
                  />
                </div>

                <div>
                  <p>Name</p>
                  <input
                    value={selectedDriver.name}
                    onChange={(e) => setSelectedDriver(prev => ({ ...prev, name: e.target.value }))}
                    className="border-2 border-black p-2 rounded w-full"
                  />
                </div>

                <div>
                  <p>Position</p>
                  <input
                    value={selectedDriver.position}
                    onChange={(e) => setSelectedDriver(prev => ({ ...prev, position: e.target.value }))}
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
                  Delete Driver
                </button>
              </div>
            </>
          )}
        </div>

      </main>
    </div>
  );
};

export default DriversPage;
