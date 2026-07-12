import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  FaPlusCircle,
  FaAppleAlt,
  FaTags,
  FaRupeeSign,
  FaBoxes,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";
// 1️⃣ तुझ्या डॅशबोर्डसारखीच Axios API सर्व्हिस इथे इम्पोर्ट केली जेणेकरून टोकनचा घोळ होणार नाही
import api from "../services/api";

export default function ProductFormPage() {
  const navigate = useNavigate();

  // फॉर्म स्टेट्स
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState("Inactive");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // इमेज सिलेक्ट केल्यावर प्रीव्ह्यू सेट करणे
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // प्रॉडक्ट सबमिट करणे
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category || !price || !stock) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    // FormData तयार करणे (इमेज अपलोडसाठी आवश्यक)
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("category", category.trim());
    formData.append("price", Number(price));
    formData.append("stock", Number(stock));
    formData.append("status", status);
    if (image) {
      formData.append("image", image);
    }

    try {
      // 2️⃣ इथे fetch ऐवजी डॅशबोर्डसारखंच 'api.post' वापरलं, जेणेकरून Authorization Headers आपोआप मॅच होतील
      const response = await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Axios मध्ये रिस्पॉन्स यशस्वी झाला की status २०० किंवा २०१ असतो
      if (response.status === 200 || response.status === 201) {
        alert("Product Added successfully! 🎉");
        toast.success("Product added successfully!");
        setName("");
        setCategory("");
        setPrice("");
        setStock("");
        setStatus("Inactive");
        setImage(null);
        setImagePreview(null);
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.error("Product Form Error:", error);
      alert(
        error.response?.data?.message ||
          "Server error or Token missing! Check login.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(167,139,250,0.18),_transparent_30%),linear-gradient(135deg,_#fcfbff_0%,_#f7ecff_100%)] px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Toaster position="top-center" />

      {/* BACK TO DASHBOARD BUTTON */}
      <div className="w-full max-w-5xl mx-auto flex justify-start">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-violet-200 bg-white/80 hover:bg-violet-50 text-sm font-semibold text-violet-700 shadow-sm transition duration-200 cursor-pointer"
        >
          <FaArrowLeft className="text-xs" /> Back to Dashboard
        </button>
      </div>

      {/* ADD PRODUCT FORM */}
      <div className="w-full max-w-5xl mx-auto overflow-hidden rounded-[32px] border border-violet-100 bg-white/80 shadow-[0_30px_90px_-25px_rgba(109,40,217,0.25)] backdrop-blur-xl p-6 sm:p-10">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
            Inventory Management
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FaPlusCircle className="text-violet-600" /> Add New Product
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Product Name
              </span>
              <div className="flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50/50 px-4 py-2.5 focus-within:border-violet-400">
                <FaAppleAlt className="text-violet-500" />
                <input
                  type="text"
                  className="w-full border-0 bg-transparent text-sm outline-none text-slate-800"
                  placeholder="e.g. Mango"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Category
              </span>
              <div className="flex items-xl gap-3 rounded-xl border border-violet-200 bg-violet-50/50 px-4 py-2.5 focus-within:border-violet-400">
                <FaTags className="text-violet-500" />
                <input
                  type="text"
                  className="w-full border-0 bg-transparent text-sm outline-none text-slate-800"
                  placeholder="e.g. Organic Fruits"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Price (₹ per kg)
              </span>
              <div className="flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50/50 px-4 py-2.5 focus-within:border-violet-400">
                <FaRupeeSign className="text-violet-500" />
                <input
                  type="number"
                  className="w-full border-0 bg-transparent text-sm outline-none text-slate-800"
                  placeholder="150"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Stock Quantity
              </span>
              <div className="flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50/50 px-4 py-2.5 focus-within:border-violet-400">
                <FaBoxes className="text-violet-500" />
                <input
                  type="number"
                  className="w-full border-0 bg-transparent text-sm outline-none text-slate-800"
                  placeholder="100"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Status
              </span>
              <div className="flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50/50 px-4 py-2.5 focus-within:border-violet-400">
                <FaCheckCircle className="text-violet-500" />
                <select
                  className="w-full border-0 bg-transparent text-sm outline-none text-slate-800 cursor-pointer"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Product Image
            </span>
            <div className="border-2 border-dashed border-violet-200 rounded-xl bg-violet-50/20 p-4 text-center hover:border-violet-400 transition">
              {imagePreview ? (
                <div className="flex items-center justify-center gap-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-xl shadow-sm border"
                  />
                  <div className="text-left">
                    <p className="text-xs font-medium text-slate-600 truncate max-w-xs">
                      {image.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="text-xs text-rose-500 font-semibold underline bg-transparent border-0 cursor-pointer mt-1"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer block py-2">
                  <FaCloudUploadAlt className="text-violet-500 text-3xl mx-auto mb-1" />
                  <span className="text-xs font-semibold text-violet-600 block">
                    Upload Product Image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 font-semibold text-white shadow-md hover:-translate-y-0.5 transition cursor-pointer border-0"
          >
            {loading ? "Adding to Inventory..." : "Add Product to Inventory"}
          </button>
        </form>
      </div>
    </div>
  );
}
