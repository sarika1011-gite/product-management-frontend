import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaArrowRight, FaEnvelope, FaLock, FaLeaf } from "react-icons/fa";
import api from "../services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(167,139,250,0.18),_transparent_30%),linear-gradient(135deg,_#fcfbff_0%,_#f7ecff_100%)] px-4 py-10 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-violet-100 bg-white/80 shadow-[0_30px_90px_-25px_rgba(109,40,217,0.25)] backdrop-blur-xl">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-gradient-to-br from-violet-700 via-fuchsia-600 to-violet-500 p-8 text-white sm:p-10 lg:p-12">
            <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/15 px-3 py-2 text-sm font-medium backdrop-blur">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl shadow-md">
                🍓
              </div>
              <span className="text-base font-semibold tracking-wide">
                Freshora
              </span>
            </div>

            <h1 className="mt-8 text-4xl font-semibold leading-tight sm:text-5xl">
              Freshora
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-violet-50/90 sm:text-base">
              Premium fruit inventory and product control in one calm, modern
              workspace.
            </p>

            <div className="mt-8 rounded-3xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-xl">
                  <FaLeaf />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Seasonal-ready workflow
                  </p>
                  <p className="text-sm text-violet-100/90">
                    Manage fresh arrivals with calm, polished controls.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10 lg:p-12">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
                Sign in
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                Access your dashboard
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Enter your credentials to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Email address
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3 shadow-sm transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-200">
                  <FaEnvelope className="text-violet-500" />
                  <input
                    type="email"
                    className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3 shadow-sm transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-200">
                  <FaLock className="text-violet-500" />
                  <input
                    type="password"
                    className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </label>

              <div className="flex items-center justify-between text-sm">
                <a
                  href="#"
                  className="font-medium text-violet-600 transition hover:text-violet-700"
                >
                  Forgot Password?
                </a>
                <a
                  href="#"
                  className="font-medium text-slate-500 transition hover:text-slate-700"
                >
                  Create Account
                </a>
              </div>

              <button className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-300">
                Sign In
                <FaArrowRight className="transition group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
