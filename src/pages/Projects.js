import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { api } from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    client: "",
    website: "",
    domain: "",
    type: "One-time",
    cost: "",
    deadline: "",
    status: "Pending",
    notes: "",
  });

  // Load data from backend
  useEffect(() => {
    loadProjects();
    loadClients();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setProjects([]);
    }
  };

  const loadClients = async () => {
    try {
      const data = await api.getClients();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load clients:", err);
      setClients([]);
    }
  };

  const openAddModal = () => {
    setForm({
      client: "",
      website: "",
      domain: "",
      type: "One-time",
      cost: "",
      deadline: "",
      status: "Pending",
      notes: "",
    });
    setEditIndex(null);
    setIsModalOpen(true);
  };

  const openEditModal = (index) => {
    setForm(projects[index]);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.client) return alert("Please select a client");
    if (!form.website.trim()) return alert("Website name is required");

    try {
      if (editIndex !== null) {
        const project = projects[editIndex];
        await api.updateProject(project._id, form);
        setEditIndex(null);
      } else {
        await api.createProject(form);
      }

      await loadProjects();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save project: " + err.message);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Delete this project?")) return;
    
    try {
      const project = projects[index];
      await api.deleteProject(project._id);
      await loadProjects();
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.website.toLowerCase().includes(search.toLowerCase()) ||
      (p.domain || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <span>+</span> Add New Project
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by client, website or domain..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-3 w-full mb-6 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
      />

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="w-full text-left min-w-[1000px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Client</th>
              <th className="p-3">Website</th>
              <th className="p-3">Domain</th>
              <th className="p-3">Type</th>
              <th className="p-3">Cost</th>
              <th className="p-3">Deadline</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">
                  No projects found. Add one using the button above.
                </td>
              </tr>
            ) : (
              filteredProjects.map((project, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{project.client}</td>
                  <td className="p-3">{project.website}</td>
                  <td className="p-3">{project.domain || "—"}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        project.type === "Monthly"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-indigo-100 text-indigo-800"
                      }`}
                    >
                      {project.type}
                    </span>
                  </td>
                  <td className="p-3">
                    {project.cost ? `₹${Number(project.cost).toLocaleString()}` : "—"}
                  </td>
                  <td className="p-3">{project.deadline || "—"}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        project.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : project.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
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

      {/* ────────────── MODAL ────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editIndex !== null ? "Edit Project" : "Add New Project"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-600 hover:text-gray-900 text-3xl leading-none"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Client */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Client <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="client"
                    value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                    className="border p-3 rounded-lg w-full"
                    required
                  >
                    <option value="">Select Client</option>
                    {clients.map((client, i) => (
                      <option key={i} value={client.name}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Website & Domain */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Website Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      name="website"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      placeholder="e.g. My Company Website"
                      className="border p-3 rounded-lg w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Domain</label>
                    <input
                      name="domain"
                      value={form.domain}
                      onChange={(e) => setForm({ ...form, domain: e.target.value })}
                      placeholder="example.com"
                      className="border p-3 rounded-lg w-full"
                    />
                  </div>
                </div>

                {/* Type, Cost, Deadline, Status */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="border p-3 rounded-lg w-full"
                    >
                      <option>One-time</option>
                      <option>Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Cost (₹)</label>
                    <input
                      type="number"
                      value={form.cost}
                      onChange={(e) => setForm({ ...form, cost: e.target.value })}
                      placeholder="25000"
                      className="border p-3 rounded-lg w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Deadline</label>
                    <input
                      type="date"
                      value={form.deadline}
                      onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                      className="border p-3 rounded-lg w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="border p-3 rounded-lg w-full"
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Additional information, special requirements..."
                    className="border p-3 rounded-lg w-full h-24 resize-none"
                  />
                </div>

                {/* Buttons */}
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
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {editIndex !== null ? "Update Project" : "Save Project"}
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

export default Projects;