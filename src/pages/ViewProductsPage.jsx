import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import api from "../services/api";

export default function ViewProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/products");
        // Bypasses layout payload wrappers to get direct dynamic object arrays safely
        const dataArray = Array.isArray(res.data)
          ? res.data
          : res.data.products || [];
        setProducts(dataArray);
      } catch (err) {
        console.error("Error loading table library rows:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <div className="flex justify-between items-center">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 rounded-2xl bg-violet-50 px-4 py-2 text-sm font-bold text-violet-600 border-0 shadow-sm hover:bg-violet-100 transition"
        >
          <FaArrowLeft /> Dashboard
        </Link>
        <Link
          to="/add-product"
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2 text-sm font-bold text-white border-0 shadow-sm hover:scale-105 transition"
        >
          <FaPlus /> New Product
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 font-medium bg-white rounded-[30px] shadow-sm border border-slate-100">
          Loading Product List...
        </div>
      ) : (
        <div className="bg-white rounded-[30px] border border-violet-100 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-violet-50/50 border-b border-violet-100 text-violet-600 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-6">Product Name</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Stock</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-violet-100 text-sm text-slate-600">
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-12 text-center text-slate-400 font-medium bg-violet-50/10"
                    >
                      Your store directory is empty. Add your first fruit
                      package entry.
                    </td>
                  </tr>
                ) : (
                  products.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-violet-50/20 transition"
                    >
                      <td className="py-4 px-6">
                        {item.image ? (
                          <img
                            src={`https://product-management-backend-ibmd.onrender.com/${item.image}`}
                            alt={item.name}
                            className="h-12 w-12 rounded-2xl object-cover border border-violet-200"
                            onError={(e) => {
                              e.target.src =
                                "https://placehold.co/100x100?text=🍓";
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-2xl bg-violet-50 text-violet-500 text-lg flex items-center justify-center border border-violet-200">
                            🍓
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-800">
                        {item.name}
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-violet-100/50 rounded-full text-xs font-semibold text-violet-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold">₹{item.price}</td>
                      <td className="py-4 px-6 font-medium">{item.stock} kg</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${item.stock < 10 ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}
                        >
                          {item.stock < 10
                            ? "Low Stock"
                            : item.status || "In Stock"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
