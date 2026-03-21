import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { api } from "../services/api";

function Clients() {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Load data from backend
  useEffect(() => {
    loadClients();
    loadProjects();
  }, []);

  const loadClients = async () => {
    try {
      const data = await api.getClients();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load clients:", err);
      setClients([]);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setProjects([]);
    }
  };

  const openAddModal = () => {
    setForm({ name: "", email: "", phone: "" });
    setEditIndex(null);
    setIsModalOpen(true);
  };

  const openEditModal = (index) => {
    setForm(clients[index]);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!form.name.trim()) return alert("Client name is required");
    if (!form.email.trim()) return alert("Email is required");

    setSubmitting(true);
    try {
      if (editIndex !== null) {
        const client = clients[editIndex];
        await api.updateClient(client._id, form);
        setEditIndex(null);
      } else {
        await api.createClient(form);
      }
      
      await loadClients();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save client: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Delete this client? Projects linked to this client will remain but the client reference will be lost.")) {
      return;
    }

    try {
      const client = clients[index];
      await api.deleteClient(client._id);
      await loadClients();
    } catch (err) {
      alert("Failed to delete client");
    }
  };

  const getProjectCount = (clientName) => {
    return projects.filter((p) => p.client === clientName).length;
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients / Agencies</h1>
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <span>+</span> Add New Client
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-3 w-full mb-6 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
      />

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Client Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Projects</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  {clients.length === 0
                    ? "No clients added yet. Add your first client using the button above."
                    : "No matching clients found."}
                </td>
              </tr>
            ) : (
              filteredClients.map((client, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{client.name}</td>
                  <td className="p-3">{client.email}</td>
                  <td className="p-3">{client.phone || "—"}</td>
                  <td className="p-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      {getProjectCount(client.name)} Projects
                    </span>
                  </td>
                  <td className="p-3 text-center flex justify-center gap-2">
                    <button
                      onClick={() => openEditModal(index)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editIndex !== null ? "Edit Client" : "Add New Client"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-600 hover:text-gray-900 text-3xl leading-none"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Client / Agency Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Acme Corp"
                    className="border p-3 rounded-lg w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="contact@acmecorp.com"
                    className="border p-3 rounded-lg w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="border p-3 rounded-lg w-full"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
                  >
                    {submitting ? "Saving..." : (editIndex !== null ? "Update Client" : "Save Client")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Clients;