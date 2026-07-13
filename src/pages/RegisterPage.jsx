import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  FaArrowRight,
  FaEnvelope,
  FaLock,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaLeaf,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // पासवर्ड व्हॅलिडेशन चेकर्स (कमीत कमी ६ अक्षरे, १ नंबर, १ स्पेशल कॅरेक्टर)
  const isMinLength = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>@]/.test(password);
  const isPasswordValid = isMinLength && hasNumber && hasSpecialChar;

  const handleSubmit = async (e) => {
    // पेज रीलोड होणे आणि परस्पर सबमिट होणे पूर्णपणे ब्लॉक करणे
    e.preventDefault();
    e.stopPropagation();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      toast.error("Please fill in all fields");
      return false;
    }

    if (!isPasswordValid) {
      alert("Password does not meet the requirements!");
      toast.error("Password does not meet the requirements!");
      return false;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      toast.error("Passwords do not match!");
      return false;
    }

    setLoading(true);
    try {
      // 'localhost' ऐवजी अचूक IP पत्ता '127.0.0.1' वापरला आहे
      const response = await fetch(
        "https://product-management-backend-ibmd.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data) {
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        alert("Account created successfully! 🎉");
        toast.success("Account created successfully! 🎉");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setLoading(false);
        const failMsg = data.message || "Registration failed. Try again!";
        alert(failMsg);
        toast.error(failMsg);
        return false;
      }
    } catch (error) {
      console.error("Register Error:", error);
      setLoading(false);
      alert(
        "Connection error! Make sure backend is running and CORS is enabled.",
      );
      toast.error("Connection error with backend server");
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(167,139,250,0.18),_transparent_30%),linear-gradient(135deg,_#fcfbff_0%,_#f7ecff_100%)] px-4 py-10 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* पॉप-अप मेसेज नीट दिसण्यासाठी Toaster लेयर */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-violet-100 bg-white/80 shadow-[0_30px_90px_-25px_rgba(109,40,217,0.25)] backdrop-blur-xl">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          {/* Left Panel (Branding) */}
          <div className="bg-gradient-to-br from-violet-700 via-fuchsia-600 to-violet-500 p-8 text-white sm:p-10 lg:p-12">
            <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/15 px-3 py-2 text-sm font-medium backdrop-blur w-fit">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl shadow-md">
                🍓
              </div>
              <span className="text-base font-semibold tracking-wide">
                Freshora
              </span>
            </div>

            <h1 className="mt-8 text-4xl font-semibold leading-tight sm:text-5xl">
              Join Us
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-violet-50/90 sm:text-base">
              Create your premium workspace account and start managing fresh
              inventory.
            </p>

            <div className="mt-8 rounded-3xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-xl">
                  <FaLeaf />
                </div>
                <div>
                  <p className="text-sm font-semibold">Secure onboarding</p>
                  <p className="text-sm text-violet-100/90">
                    Your data is safe and protected with industry standards.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel (Form Workspace) */}
          <div className="p-8 sm:p-10 lg:p-12">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
                Start For Free
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                Create Account
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div>
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3 shadow-sm focus-within:border-violet-400">
                  <FaUser className="text-violet-500" />
                  <input
                    type="text"
                    className="w-full border-0 bg-transparent text-sm outline-none text-slate-800"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Email address
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3 shadow-sm focus-within:border-violet-400">
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
              </div>

              {/* Password Field */}
              <div>
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3 shadow-sm focus-within:border-violet-400 justify-between">
                  <div className="flex items-center gap-3 w-full">
                    <FaLock className="text-violet-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full border-0 bg-transparent text-sm outline-none text-slate-800"
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-violet-600 transition bg-transparent border-0 cursor-pointer p-1"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Dynamic Password Checkers */}
              {password.length > 0 && (
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-xs">
                  <p className="font-semibold text-slate-600 mb-1">
                    Password Requirements:
                  </p>
                  <div className="flex items-center gap-2">
                    {isMinLength ? (
                      <FaCheckCircle className="text-emerald-500" />
                    ) : (
                      <FaTimesCircle className="text-rose-400" />
                    )}
                    <span
                      className={
                        isMinLength ? "text-emerald-600" : "text-slate-500"
                      }
                    >
                      At least 6 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasNumber ? (
                      <FaCheckCircle className="text-emerald-500" />
                    ) : (
                      <FaTimesCircle className="text-rose-400" />
                    )}
                    <span
                      className={
                        hasNumber ? "text-emerald-600" : "text-slate-500"
                      }
                    >
                      At least 1 number (0-9)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasSpecialChar ? (
                      <FaCheckCircle className="text-emerald-500" />
                    ) : (
                      <FaTimesCircle className="text-rose-400" />
                    )}
                    <span
                      className={
                        hasSpecialChar ? "text-emerald-600" : "text-slate-500"
                      }
                    >
                      At least 1 special character (!@#$)
                    </span>
                  </div>
                </div>
              )}

              {/* Confirm Password Field */}
              <div>
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Confirm Password
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3 shadow-sm focus-within:border-violet-400 justify-between">
                  <div className="flex items-center gap-3 w-full">
                    <FaLock className="text-violet-500" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full border-0 bg-transparent text-sm outline-none text-slate-800"
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-violet-600 transition bg-transparent border-0 cursor-pointer p-1"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Navigation Router Action */}
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-medium text-violet-600 transition hover:text-violet-700 underline bg-transparent border-0 cursor-pointer text-left p-0"
                >
                  Already have an account? Sign In
                </button>
              </div>

              {/* Registration Form Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 cursor-pointer border-0"
              >
                {loading ? "Creating Account..." : "Register Account"}
                <FaArrowRight className="transition group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
