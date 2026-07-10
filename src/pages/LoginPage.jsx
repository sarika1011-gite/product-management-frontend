import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaArrowRight,
  FaEnvelope,
  FaLock,
  FaLeaf,
  FaUser,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import api from "../services/api";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // 🛠️ पेज लोड होताच आधीचा कोणताही कचरा किंवा जुना टोकन पूर्ण साफ करणे
  useEffect(() => {
    localStorage.clear();
    localStorage.removeItem("token");
  }, []);

  const validatePassword = (pass) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- 1. Create Account Mode (Sign Up) ---
    if (isSignUp) {
      if (!name.trim()) {
        toast.error("Please enter your name");
        return;
      }
      if (!validatePassword(password)) {
        toast.error("Password must be 8+ chars with 1 number & 1 symbol!");
        return;
      }

      try {
        const { data } = await api.post("/auth/register", {
          name,
          email,
          password,
        });

        // 🔒 स्ट्रिक्ट चेक: जर टोकन मिळाला तरच आत सोडणार
        if (data && data.token && data.token !== "undefined") {
          localStorage.setItem("token", data.token);
          toast.success("Account created successfully! Opening Dashboard...");
          navigate("/");
        } else {
          // बॅकएंडने टोकन न दिल्यास मॅन्युअली लॉगिन API कॉल मारणे
          const loginRes = await api.post("/auth/login", { email, password });
          if (
            loginRes.data &&
            loginRes.data.token &&
            loginRes.data.token !== "undefined"
          ) {
            localStorage.setItem("token", loginRes.data.token);
            toast.success("Account created successfully!");
            navigate("/");
          } else {
            localStorage.removeItem("token");
            toast.error("Account not found, create account first!");
          }
        }
      } catch (error) {
        localStorage.removeItem("token");
        toast.error("Account not found, create account first!");
      }
    }
    // --- 2. Sign In Mode ---
    else {
      try {
        const { data } = await api.post("/auth/login", { email, password });

        // 🔒 सर्वात महत्त्वाचा बदल: टोकन खरोखर अस्तित्वात आहे की नाही (Null/Undefined तर नाही ना) हे तपासणे
        if (
          data &&
          data.token &&
          data.token !== "undefined" &&
          data.token !== null
        ) {
          localStorage.setItem("token", data.token);
          toast.success("Login successful");
          navigate("/");
        } else {
          // 🛑 जर टोकन मिळाला नाही किंवा चुकीचा आला, तर सरळ बाहेर हाकलणे आणि एरर दाखवणे
          localStorage.removeItem("token");
          toast.error("Account not found, create account first!");
        }
      } catch (error) {
        // जर एपीआय फेल मारला तर थेट पॉप-अप
        localStorage.removeItem("token");
        toast.error("Account not found, create account first!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(167,139,250,0.18),_transparent_30%),linear-gradient(135deg,_#fcfbff_0%,_#f7ecff_100%)] px-4 py-10 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-violet-100 bg-white/80 shadow-[0_30px_90px_-25px_rgba(109,40,217,0.25)] backdrop-blur-xl">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          {/* Left Side - Premium Purple Branding */}
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

          {/* Right Side - Form */}
          <div className="p-8 sm:p-10 lg:p-12">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
                {isSignUp ? "Sign Up" : "Sign In"}
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                {isSignUp ? "Create your account" : "Access your dashboard"}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {isSignUp
                  ? "Fill in the details to register first."
                  : "Enter your credentials to continue."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </span>
                  <div className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3 shadow-sm transition focus-within:border-violet-400">
                    <FaUser className="text-violet-500" />
                    <input
                      type="text"
                      className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </label>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Email address
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3 shadow-sm transition focus-within:border-violet-400">
                  <FaEnvelope className="text-violet-500" />
                  <input
                    type="email"
                    className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Password{" "}
                  {isSignUp && (
                    <span className="text-xs text-violet-500">
                      (Requires 8+ chars, 1 num, 1 symbol)
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3 shadow-sm transition focus-within:border-violet-400">
                  <FaLock className="text-violet-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-violet-500 hover:text-violet-700 bg-transparent border-0 cursor-pointer focus:outline-none pr-2"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setPassword("");
                  }}
                  className="font-medium text-slate-500 transition hover:text-slate-700 underline bg-transparent border-0 cursor-pointer ml-auto"
                >
                  {isSignUp
                    ? "Already have an account? Sign In"
                    : "Create Account"}
                </button>
              </div>

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition duration-200 hover:-translate-y-0.5"
              >
                {isSignUp ? "Register Account & Enter" : "Sign In"}
                <FaArrowRight className="transition group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-slate-400 font-medium tracking-wide">
        Designed & Developed by{" "}
        <span className="text-violet-600 font-semibold">Your Name</span>
      </p>
    </div>
  );
}
