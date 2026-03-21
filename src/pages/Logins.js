import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";

const LoginPage = () => {
  const [logins, setLogins] = useState([]);
  const [search, setSearch] = useState("");
  const [showPasswordIndex, setShowPasswordIndex] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [form, setForm] = useState({
    agency: "",
    websiteUrl: "",
    websiteUsername: "",
    websitePassword: "",
    serverUrl: "",
    serverUsername: "",
    serverPassword: "",
  });

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("agencyLogins")) || [];
    setLogins(saved);
  }, []);

  // Save to localStorage whenever logins change
  useEffect(() => {
    localStorage.setItem("agencyLogins", JSON.stringify(logins));
  }, [logins]);

  const openAddModal = () => {
    setForm({
      agency: "",
      websiteUrl: "",
      websiteUsername: "",
      websitePassword: "",
      serverUrl: "",
      serverUsername: "",
      serverPassword: "",
    });
    setEditIndex(null);
    setIsModalOpen(true);
  };

  const openEditModal = (index) => {
    setForm(logins[index]);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      // Update existing
      const updated = [...logins];
      updated[editIndex] = form;
      setLogins(updated);
    } else {
      // Add new
      setLogins([...logins, form]);
    }

    // Close modal & reset
    setIsModalOpen(false);
    setEditIndex(null);
  };

  const handleDelete = (index) => {
    const updated = logins.filter((_, i) => i !== index);
    setLogins(updated);
  };

  const filtered = logins.filter((item) =>
    item.agency.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Login Management</h1>
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Add New Login
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by Agency..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-3 w-full mb-6 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
      />

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-x-auto mb-8">
        <table className="w-full text-left min-w-[1000px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Agency</th>
              <th className="p-3">Website URL</th>
              <th className="p-3">Website Username</th>
              <th className="p-3">Website Password</th>
              <th className="p-3">Server URL</th>
              <th className="p-3">Server Username</th>
              <th className="p-3">Server Password</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{item.agency}</td>
                <td className="p-3">{item.websiteUrl || "—"}</td>
                <td className="p-3">{item.websiteUsername || "—"}</td>

                <td className="p-3">
                  {showPasswordIndex === `web-${index}`
                    ? item.websitePassword || "—"
                    : "••••••••"}
                  {item.websitePassword && (
                    <button
                      onClick={() =>
                        setShowPasswordIndex(
                          showPasswordIndex === `web-${index}`
                            ? null
                            : `web-${index}`
                        )
                      }
                      className="ml-2 text-blue-600 text-sm hover:underline"
                    >
                      {showPasswordIndex === `web-${index}` ? "Hide" : "Show"}
                    </button>
                  )}
                </td>

                <td className="p-3">{item.serverUrl || "—"}</td>
                <td className="p-3">{item.serverUsername || "—"}</td>

                <td className="p-3">
                  {showPasswordIndex === `server-${index}`
                    ? item.serverPassword || "—"
                    : "••••••••"}
                  {item.serverPassword && (
                    <button
                      onClick={() =>
                        setShowPasswordIndex(
                          showPasswordIndex === `server-${index}`
                            ? null
                            : `server-${index}`
                        )
                      }
                      className="ml-2 text-blue-600 text-sm hover:underline"
                    >
                      {showPasswordIndex === `server-${index}` ? "Hide" : "Show"}
                    </button>
                  )}
                </td>

                <td className="p-3 space-x-2">
                  <button
                    onClick={() => openEditModal(index)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No logins found. Add one using the button above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editIndex !== null ? "Edit Login" : "Add New Login"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-800 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1">Agency Name *</label>
                  <input
                    type="text"
                    placeholder="Agency Name"
                    value={form.agency}
                    onChange={(e) => setForm({ ...form, agency: e.target.value })}
                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Website URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com"
                    value={form.websiteUrl}
                    onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                    className="border p-3 rounded-lg w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Website Username</label>
                  <input
                    type="text"
                    placeholder="username or email"
                    value={form.websiteUsername}
                    onChange={(e) => setForm({ ...form, websiteUsername: e.target.value })}
                    className="border p-3 rounded-lg w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Website Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.websitePassword}
                    onChange={(e) => setForm({ ...form, websitePassword: e.target.value })}
                    className="border p-3 rounded-lg w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Server URL</label>
                  <input
                    type="text"
                    placeholder="https://server.example.com"
                    value={form.serverUrl}
                    onChange={(e) => setForm({ ...form, serverUrl: e.target.value })}
                    className="border p-3 rounded-lg w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Server Username</label>
                  <input
                    type="text"
                    placeholder="admin / root"
                    value={form.serverUsername}
                    onChange={(e) => setForm({ ...form, serverUsername: e.target.value })}
                    className="border p-3 rounded-lg w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Server Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.serverPassword}
                    onChange={(e) => setForm({ ...form, serverPassword: e.target.value })}
                    className="border p-3 rounded-lg w-full"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {editIndex !== null ? "Update Login" : "Save Login"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default LoginPage;