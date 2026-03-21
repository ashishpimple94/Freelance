import { useState } from "react";
import { api } from "../services/api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.login(form.email, form.password);
      window.location.href = '/';
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="w-full max-w-[900px] bg-white rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden">

        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-400 text-white p-10 flex flex-col justify-center relative">
          <div className="absolute top-6 left-8 text-sm tracking-widest opacity-80">FREELANCE MANAGER</div>
          <div className="mt-8 md:mt-0">
            <p className="text-sm opacity-80 mb-2">Nice to see you again</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-wide">WELCOME BACK</h1>
            <div className="w-16 h-1 bg-white mb-6"></div>
            <p className="text-sm opacity-80 leading-relaxed">
              Manage your freelance business, clients, projects and payments all in one secure dashboard.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">Login to your account</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border-b-2 border-blue-400 focus:outline-none focus:border-blue-600 py-2"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border-b-2 border-blue-400 focus:outline-none focus:border-blue-600 py-2"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition disabled:bg-blue-400"
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;
