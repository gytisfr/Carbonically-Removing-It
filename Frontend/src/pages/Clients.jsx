import { useState, useEffect } from "react";
import axios from "axios";

const ClientsPage = () => {
  const [form, setForm] = useState({
    id: "",
    name: "",
    location: "",
    carbontype: "",
    producer: false,
  });

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [originalClient, setOriginalClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
  }, []);

  // Create new client
  const handleSubmit = async () => {
    if (!form.id || !form.name || !form.location || !form.carbontype) {
      return alert("Please fill in all required fields!");
    }

    try {
      await axios.post(
        "http://127.0.0.1:5089/client",
        null,
        { params: form }
      );
      alert("Client created successfully!");
      setForm({ id: "", name: "", location: "", carbontype: "", producer: false });
      fetchClients();
    } catch (error) {
      console.error(error);
      alert("Failed to create client.");
    }
  };

  // Edit selected client
  const handleEdit = async () => {
    if (!selectedClient) return alert("Select a client first!");

    try {
      for (const key of ["id", "name", "location", "carbontype", "producer"]) {
        if (selectedClient[key] !== originalClient[key]) {
          await axios.patch(
            "http://127.0.0.1:5089/client",
            null,
            { params: { id: originalClient.id, what: key, to: selectedClient[key] } }
          );
        }
      }
      alert("Client updated successfully!");
      fetchClients();
    } catch (error) {
      console.error("Error editing client:", error);
      alert("Failed to update client.");
    }
  };

  return (
    <div className="h-screen min-h-screen flex flex-col justify-between">
      <main className="h-full w-full gap-6 grid grid-cols-3 grid-rows-1 items-start justify-center p-6">

        {/* Create Client */}
        <div className="h-full w-full bg-white rounded-sm p-6 flex flex-col">
          <p className="text-2xl">Create New Client</p>
          <div className="mt-6 space-y-4">
            <div>
              <p>ID</p>
              <input
                type="number"
                value={form.id}
                onChange={(e) => setForm(prev => ({ ...prev, id: e.target.value }))}
                className="border-black border-2 p-2 rounded-sm w-full"
              />
            </div>
            <div>
              <p>Name</p>
              <input
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="border-black border-2 p-2 rounded-sm w-full"
              />
            </div>
            <div>
              <p>Location</p>
              <input
                value={form.location}
                onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                className="border-black border-2 p-2 rounded-sm w-full"
              />
            </div>
            <div>
              <p>Carbon Type</p>
              <input
                type="number"
                value={form.carbontype}
                onChange={(e) => setForm(prev => ({ ...prev, carbontype: e.target.value }))}
                className="border-black border-2 p-2 rounded-sm w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.producer}
                onChange={(e) => setForm(prev => ({ ...prev, producer: e.target.checked }))}
              />
              <p>Producer</p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-black text-white p-2 rounded-md mt-auto cursor-pointer"
          >
            Save Client
          </button>
        </div>

        {/* Display All Clients */}
        <div className="h-full w-full bg-white rounded-sm p-6 flex flex-col">
          <p className="text-2xl mb-4">All Clients</p>

          <input
            type="text"
            placeholder="Search by ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-black p-2 rounded mb-4"
          />

          <div className="overflow-y-auto max-h-[70vh]">
            {clients
              .filter(c => c.id.toString().includes(searchTerm))
              .map(c => (
                <div key={c.id} className="border-b border-gray-300 py-2">
                  <p><strong>ID:</strong> {c.id}</p>
                  <p><strong>Name:</strong> {c.name}</p>
                  <p><strong>Location:</strong> {c.location}</p>
                  <p><strong>Carbon Type:</strong> {c.carbontype}</p>
                  <p><strong>Producer:</strong> {c.producer ? "Yes" : "No"}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Edit Client */}
        <div className="h-full w-full bg-white rounded-sm p-6 flex flex-col">
          <p className="text-2xl">Edit Client</p>

          <label className="mt-4 mb-2 font-medium">Select Client:</label>
          <select
            className="border-2 border-black p-2 rounded mb-4"
            onChange={(e) => {
              const client = clients.find(c => c.id.toString() === e.target.value);
              if (!client) return setSelectedClient(null);
              setSelectedClient({ ...client });
              setOriginalClient({ ...client });
            }}
          >
            <option value="">-- Select a Client --</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.name}
              </option>
            ))}
          </select>

          {selectedClient && (
            <>
              <div className="space-y-2">
                <div>
                  <p>ID</p>
                  <input
                    type="number"
                    value={selectedClient.id}
                    onChange={(e) => setSelectedClient(prev => ({ ...prev, id: e.target.value }))}
                    className="border-2 border-black p-2 rounded w-full"
                  />
                </div>
                <div>
                  <p>Name</p>
                  <input
                    value={selectedClient.name}
                    onChange={(e) => setSelectedClient(prev => ({ ...prev, name: e.target.value }))}
                    className="border-2 border-black p-2 rounded w-full"
                  />
                </div>
                <div>
                  <p>Location</p>
                  <input
                    value={selectedClient.location}
                    onChange={(e) => setSelectedClient(prev => ({ ...prev, location: e.target.value }))}
                    className="border-2 border-black p-2 rounded w-full"
                  />
                </div>
                <div>
                  <p>Carbon Type</p>
                  <input
                    type="number"
                    value={selectedClient.carbontype}
                    onChange={(e) => setSelectedClient(prev => ({ ...prev, carbontype: e.target.value }))}
                    className="border-2 border-black p-2 rounded w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedClient.producer}
                    onChange={(e) => setSelectedClient(prev => ({ ...prev, producer: e.target.checked }))}
                  />
                  <p>Producer</p>
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
                  onClick={async () => {
                    if (!window.confirm("Are you sure you want to delete this client?")) return;
                    try {
                      await axios.delete("http://127.0.0.1:5089/client", { params: { id: selectedClient.id } });
                      alert("Client deleted successfully!");
                      setSelectedClient(null);
                      fetchClients();
                    } catch (err) {
                      console.error(err);
                      alert("Failed to delete client.");
                    }
                  }}
                  className="bg-red-600 text-white p-2 rounded-md cursor-pointer"
                >
                  Delete Client
                </button>
              </div>
            </>
          )}
        </div>

      </main>
    </div>
  );
};

export default ClientsPage;
