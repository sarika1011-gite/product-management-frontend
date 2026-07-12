import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaArrowRight, FaEnvelope, FaLock, FaLeaf } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!email || !password) {
      alert("Please fill in all fields");
      return false;
    }

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (response.ok && data && data.token) {
        localStorage.setItem("token", data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        toast.success("Login successful! 🍓");
        navigate("/dashboard");
      } else {
        setLoading(false);
        alert("Account not found, create it first! ❌");
        toast.error("Account not found, create it first! ❌");
        return false;
      }
    } catch (error) {
      console.error("Login Error:", error);
      setLoading(false);
      alert("Connection error! Make sure backend is running.");
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(167,139,250,0.18),_transparent_30%),linear-gradient(135deg,_#fcfbff_0%,_#f7ecff_100%)] px-4 py-10 sm:px-6 lg:px-8 flex items-center justify-center">
      <Toaster position="top-center" reverseOrder={false} />
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
              Premium fruit inventory and product control.
            </p>
          </div>
          <div className="p-8 sm:p-10 lg:p-12">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
                Access Dashboard
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                Welcome Back
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Email address
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3">
                  <FaEnvelope className="text-violet-500" />
                  <input
                    type="email"
                    className="w-full border-0 bg-transparent text-sm outline-none text-slate-800"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3">
                  <FaLock className="text-violet-500" />
                  <input
                    type="password"
                    className="w-full border-0 bg-transparent text-sm outline-none text-slate-800"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </label>
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="font-medium text-violet-600 transition hover:text-violet-700 underline bg-transparent border-0 cursor-pointer p-0"
                >
                  Don't have an account? Create one
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3.5 font-semibold text-white cursor-pointer border-0 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"} <FaArrowRight />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
