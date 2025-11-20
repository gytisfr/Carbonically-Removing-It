import { useState, useEffect } from "react";
import axios from "axios";

const ClientsPage = () => {
  const [form, setForm] = useState({
    name: "",
    location: "",
    carbontype: "",
    producer: false,
  });

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [originalClient, setOriginalClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:5089/client/fetch", {
        headers: { token }
      });
      if (res.data.code === 200) setClients(res.data.data);
      else console.error("Failed to fetch clients:", res.data.error);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = { ...form };
      await axios.post("http://127.0.0.1:5089/client", null, {
        params,
        headers: { token }
      });

      alert("Client created successfully!");
      setForm({ name: "", location: "", carbontype: "", producer: false });
      fetchClients();
    } catch (err) {
      console.error(err);
      alert("Failed to create client.");
    }
  };

  const handleEdit = async () => {
    if (!selectedClient) return alert("Select a client first!");

    try {
      const token = localStorage.getItem("token");

      const updates = Object.keys(selectedClient).filter(
        key => selectedClient[key] !== originalClient[key]
      );

      for (const key of updates) {
        if (key === "id") continue;

        await axios.patch(
          "http://127.0.0.1:5089/client",
          null,
          {
            params: {
              id: selectedClient.id,
              what: key,
              to: selectedClient[key],
            },
            headers: { token }
          }
        );
      }

      alert("Client updated successfully!");
      fetchClients();
    } catch (err) {
      console.error(err);
      alert("Failed to update client.");
    }
  };

  return (
    <div className="h-screen min-h-screen flex flex-col justify-between">
      <main className="h-full w-full gap-6 grid grid-cols-3 grid-rows-1 items-start justify-center p-6">

        {/* Create Client */}
        <div className="h-full min-h-full w-full bg-white rounded-sm p-6 flex flex-col">
          <p className="text-2xl">Create New Client</p>

          <div className="mt-6 space-y-4">

            <div>
              <p>Name</p>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="border-black border-2 p-2 rounded-sm w-full"
              />
            </div>

            <div>
              <p>Location</p>
              <input
                value={form.location}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, location: e.target.value }))
                }
                className="border-black border-2 p-2 rounded-sm w-full"
              />
            </div>

            <div>
              <p>Carbon Type</p>
              <input
                type="number"
                value={form.carbontype}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, carbontype: e.target.value }))
                }
                className="border-black border-2 p-2 rounded-sm w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.producer}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, producer: e.target.checked }))
                }
              />
              <p>Producer</p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-black text-white p-2 rounded-md mt-auto cursor-pointer"
          >
            Save Client Information
          </button>
        </div>

        {/* Clients List */}
        <div className="h-full min-h-full w-full bg-white rounded-sm p-6 flex flex-col">
          <p className="text-2xl mb-4">All Clients</p>

          <input
            type="text"
            placeholder="Search by client name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-black p-2 rounded mb-4"
          />

          <div className="overflow-y-auto max-h-[70vh]">
            {clients
              .filter(
                (client) =>
                  client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  client.id.toString().includes(searchTerm)
              )
              .map((client) => (
                <div key={client.id} className="border-b border-gray-300 py-2">
                  <p><strong>ID:</strong> {client.id}</p>
                  <p><strong>Name:</strong> {client.name}</p>
                  <p><strong>Location:</strong> {client.location}</p>
                  <p><strong>Carbon Type:</strong> {client.carbontype}</p>
                  <p><strong>Producer:</strong> {client.producer ? "Yes" : "No"}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Edit Client */}
        <div className="h-full min-h-full w-full bg-white rounded-sm p-6 flex flex-col">
          <p className="text-2xl">Edit Client</p>

          <label className="mt-4 mb-2 font-medium">Select Client:</label>
          <select
            className="border-2 border-black p-2 rounded mb-4"
            onChange={(e) => {
              const c = clients.find((client) => client.id.toString() === e.target.value);
              if (!c) return setSelectedClient(null);

              setSelectedClient({ ...c });
              setOriginalClient({ ...c });
            }}
          >
            <option value="">-- Select a Client --</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.id} — {client.name}
              </option>
            ))}
          </select>

          {selectedClient && (
            <>
              <label className="mb-2 font-medium">Name:</label>
              <input
                type="text"
                value={selectedClient.name}
                onChange={(e) =>
                  setSelectedClient((prev) => ({ ...prev, name: e.target.value }))
                }
                className="border-2 border-black p-2 rounded mb-4"
              />

              <label className="mb-2 font-medium">Location:</label>
              <input
                type="text"
                value={selectedClient.location}
                onChange={(e) =>
                  setSelectedClient((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                className="border-2 border-black p-2 rounded mb-4"
              />

              <label className="mb-2 font-medium">Carbon Type:</label>
              <input
                type="number"
                value={selectedClient.carbontype}
                onChange={(e) =>
                  setSelectedClient((prev) => ({
                    ...prev,
                    carbontype: e.target.value,
                  }))
                }
                className="border-2 border-black p-2 rounded mb-4"
              />

              <div className="flex items-center gap-2 mb-6">
                <input
                  type="checkbox"
                  checked={selectedClient.producer}
                  onChange={(e) =>
                    setSelectedClient((prev) => ({
                      ...prev,
                      producer: e.target.checked,
                    }))
                  }
                />
                <p>Producer</p>
              </div>

              <div className="flex gap-2">
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
                      const token = localStorage.getItem("token");
                      await axios.delete("http://127.0.0.1:5089/client", {
                        params: { id: selectedClient.id },
                        headers: { token },
                      });
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
