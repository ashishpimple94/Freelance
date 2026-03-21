import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { api } from "../services/api";

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    agency: "",
    project: "",
    amount: "",
    type: "Project",
    status: "Pending",
    dueDate: "",
  });

  // Load from backend
  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await api.getPayments();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load payments:", err);
      setPayments([]);
    }
  };

  const openAddModal = () => {
    setForm({
      agency: "",
      project: "",
      amount: "",
      type: "Project",
      status: "Pending",
      dueDate: "",
    });
    setEditIndex(null);
    setIsModalOpen(true);
  };

  const openEditModal = (index) => {
    setForm(payments[index]);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.agency.trim()) return alert("Agency name is required");
    if (!form.project.trim()) return alert("Project name is required");
    if (!form.amount || Number(form.amount) <= 0)
      return alert("Enter a valid amount");

    try {
      if (editIndex !== null) {
        const payment = payments[editIndex];
        await api.updatePayment(payment._id, form);
        setEditIndex(null);
      } else {
        await api.createPayment(form);
      }

      await loadPayments();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save payment: " + err.message);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Delete this payment record?")) return;
    
    try {
      const payment = payments[index];
      await api.deletePayment(payment._id);
      await loadPayments();
    } catch (err) {
      alert("Failed to delete payment");
    }
  };

  const filtered = payments.filter(
    (item) =>
      item.agency.toLowerCase().includes(search.toLowerCase()) ||
      item.project.toLowerCase().includes(search.toLowerCase())
  );

  const totalPending = payments
    .filter((p) => p.status === "Pending")
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const totalReceived = payments
    .filter((p) => p.status === "Paid")
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Payment Management</h1>
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <span>+</span> Add Payment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-600">Total Pending</h3>
          <p className="text-2xl md:text-3xl font-bold text-red-600 mt-1">
            ₹ {totalPending.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-600">Total Received</h3>
          <p className="text-2xl md:text-3xl font-bold text-green-600 mt-1">
            ₹ {totalReceived.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-600">Total Records</h3>
          <p className="text-2xl md:text-3xl font-bold text-blue-600 mt-1">
            {payments.length}
          </p>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by agency or project name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-3 w-full mb-6 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
      />

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Agency</th>
              <th className="p-3">Project</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Due Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-gray-500">
                  {payments.length === 0
                    ? "No payments recorded yet. Add your first payment using the button above."
                    : "No matching payments found."}
                </td>
              </tr>
            ) : (
              filtered.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{item.agency}</td>
                  <td className="p-3">{item.project}</td>
                  <td className="p-3 font-medium">
                    ₹ {Number(item.amount).toLocaleString("en-IN")}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        item.type === "Monthly"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-indigo-100 text-indigo-800"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3">{item.dueDate || "—"}</td>
                  <td className="p-3 flex justify-center gap-2">
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
                  {editIndex !== null ? "Edit Payment" : "Add Payment"}
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
                    Agency / Client <span className="text-red-600">*</span>
                  </label>
                  <input
                    placeholder="Agency name"
                    value={form.agency}
                    onChange={(e) => setForm({ ...form, agency: e.target.value })}
                    className="border p-3 rounded-lg w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Project <span className="text-red-600">*</span>
                  </label>
                  <input
                    placeholder="Project / Website name"
                    value={form.project}
                    onChange={(e) => setForm({ ...form, project: e.target.value })}
                    className="border p-3 rounded-lg w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Amount (₹) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="25000"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="border p-3 rounded-lg w-full"
                    min="1"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Due Date</label>
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                      className="border p-3 rounded-lg w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="border p-3 rounded-lg w-full"
                    >
                      <option value="Project">Project</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="border p-3 rounded-lg w-full"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
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
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {editIndex !== null ? "Update Payment" : "Save Payment"}
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

export default PaymentPage;