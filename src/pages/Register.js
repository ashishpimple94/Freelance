import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      return setError("Passwords do not match");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    setLoading(true);
    try {
      await api.register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
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
            <p className="text-sm opacity-80 mb-2">Get started today</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-wide">CREATE ACCOUNT</h1>
            <div className="w-16 h-1 bg-white mb-6"></div>
            <p className="text-sm opacity-80 leading-relaxed">
              Join and manage your freelance business, clients, projects and payments all in one place.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border-b-2 border-blue-400 focus:outline-none focus:border-blue-600 py-2"
                required
              />
            </div>
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
                placeholder="Password (min 6 characters)"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border-b-2 border-blue-400 focus:outline-none focus:border-blue-600 py-2"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="w-full border-b-2 border-blue-400 focus:outline-none focus:border-blue-600 py-2"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition disabled:bg-blue-400"
            >
              {loading ? "Creating account..." : "SIGN UP"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/Main_login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;
