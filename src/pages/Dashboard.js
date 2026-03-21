import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    pendingTasks: 0,
    pendingPayments: 0,
    totalReceived: 0,
  });

  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [clients, projects, tasks, payments] = await Promise.all([
        api.getClients(),
        api.getProjects(),
        api.getTasks(),
        api.getPayments()
      ]);

      const pendingTaskCount = (Array.isArray(tasks) ? tasks : []).filter(
        (task) => task.status === "Pending"
      ).length;

      const pendingPaymentAmount = (Array.isArray(payments) ? payments : [])
        .filter((p) => p.status === "Pending")
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

      const receivedAmount = (Array.isArray(payments) ? payments : [])
        .filter((p) => p.status === "Paid")
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

      setStats({
        totalClients: Array.isArray(clients) ? clients.length : 0,
        totalProjects: Array.isArray(projects) ? projects.length : 0,
        pendingTasks: pendingTaskCount,
        pendingPayments: pendingPaymentAmount,
        totalReceived: receivedAmount,
      });

      setRecentPayments((Array.isArray(payments) ? payments : []).slice(-5).reverse());
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Business Dashboard</h1>

      {/* Top Cards */}
      <div className="grid md:grid-cols-5 gap-6 mb-10">
        <Card title="Total Clients" value={stats.totalClients} color="blue" />
        <Card title="Active Projects" value={stats.totalProjects} color="purple" />
        <Card title="Pending Tasks" value={stats.pendingTasks} color="yellow" />
        <Card
          title="Pending Payments"
          value={`₹ ${stats.pendingPayments}`}
          color="red"
        />
        <Card
          title="Total Received"
          value={`₹ ${stats.totalReceived}`}
          color="green"
        />
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Agency</th>
                <th className="p-3 border">Project</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No Payments Found
                  </td>
                </tr>
              ) : (
                recentPayments.map((item, index) => (
                  <tr key={index} className="text-center">
                    <td className="p-3 border">{item.agency}</td>
                    <td className="p-3 border">{item.project}</td>
                    <td className="p-3 border">₹ {item.amount}</td>
                    <td
                      className={`p-3 border font-semibold ${
                        item.status === "Paid"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

function Card({ title, value, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <p className="text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold mt-2 ${colors[color]}`}>
        {value}
      </h2>
    </div>
  );
}

export default Dashboard;