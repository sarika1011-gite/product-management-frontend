import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await api.get("/products");
      let dataArray = [];
      if (res.data) {
        if (Array.isArray(res.data)) {
          dataArray = res.data;
        } else if (res.data.products && Array.isArray(res.data.products)) {
          dataArray = res.data.products;
        } else if (res.data.product && !Array.isArray(res.data.product)) {
          dataArray = [res.data.product];
        }
      }
      setProducts(dataArray);
    } catch (err) {
      console.error("Error loading table rows:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const res = await api.delete(`/products/${id}`);
      if (res.status === 200 || res.data.success) {
        toast.success("Product deleted safely! 🍓");
        fetchItems();
      }
    } catch (err) {
      console.error("Deletion failed:", err);
      toast.error("Failed to delete product from database.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Top Controls Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[30px] border border-violet-100 shadow-sm">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-bold text-violet-600 transition hover:text-violet-800"
        >
          <span className="text-lg">←</span> Dashboard
        </Link>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Inventory List
        </h2>
        <Link
          to="/add-product"
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 font-bold text-white shadow-md hover:scale-105 transition"
        >
          <span className="text-lg">+</span> Add New
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 font-medium bg-white rounded-[30px] shadow-sm border border-slate-100">
          Loading products matrix...
        </div>
      ) : (
        <div className="bg-white rounded-[30px] border border-violet-50 shadow-xl overflow-hidden p-6">
          {/* Header Row */}
          <div className="grid grid-cols-6 gap-4 border-b border-violet-100 pb-4 mb-4 text-center font-bold text-xs uppercase tracking-wider text-violet-600">
            <div>Photo</div>
            <div>Product Name</div>
            <div>Category</div>
            <div>Price</div>
            <div>Stock</div>
            <div>Actions</div>
          </div>

          <div className="divide-y divide-violet-100">
            {products.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-medium">
                Your inventory repository is completely empty. Add products to
                generate logs.
              </div>
            ) : (
              products.map((item) => (
                <div
                  key={item._id || item.id}
                  className="grid grid-cols-6 gap-4 py-4 items-center text-center text-sm text-slate-600 hover:bg-violet-50/20 transition rounded-xl px-2"
                >
                  {/* Image */}
                  <div className="flex justify-center">
                    {item.image ? (
                      <img
                        src={`http://127.0.0.1:5000/${item.image}`}
                        alt={item.name}
                        className="h-12 w-12 rounded-2xl object-cover border border-violet-200 shadow-sm"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/100x100?text=🍓";
                        }}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-2xl bg-violet-50 text-violet-500 text-lg flex items-center justify-center border border-violet-200 shadow-sm">
                        🍓
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="font-bold text-slate-800 text-left md:text-center truncate">
                    {item.name || "Unnamed"}
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-violet-50 rounded-full text-xs font-semibold text-violet-700">
                      {item.category || "General"}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-700">
                    ₹{item.price ?? 0}
                  </div>
                  <div className="font-medium text-slate-700">
                    {item.stock ?? 0} units
                  </div>

                  {/* Actions Column: Status Badge AND Delete Button Side by Side */}
                  <div className="flex items-center justify-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === "Inactive"
                          ? "bg-rose-50 text-rose-600 border border-rose-100"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}
                    >
                      {item.status || "Active"}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDelete(item._id || item.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-600 font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
