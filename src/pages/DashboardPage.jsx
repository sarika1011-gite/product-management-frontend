import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaBoxes,
  FaCheckCircle,
  FaExclamationCircle,
  FaLeaf,
  FaTags,
  FaWarehouse,
} from "react-icons/fa";
import api from "../services/api";
import ProductChart from "../components/ProductChart";

const cards = [
  {
    key: "totalProducts",
    label: "Total Products",
    icon: FaBoxes,
    color: "from-violet-600 to-fuchsia-500",
  },
  {
    key: "activeProducts",
    label: "Active Products",
    icon: FaCheckCircle,
    color: "from-emerald-500 to-green-500",
  },
  {
    key: "inactiveProducts",
    label: "Inactive Products",
    icon: FaExclamationCircle,
    color: "from-amber-500 to-orange-500",
  },
  {
    key: "totalCategories",
    label: "Total Categories",
    icon: FaTags,
    color: "from-pink-500 to-rose-500",
  },
  {
    key: "totalStock",
    label: "Total Stock",
    icon: FaWarehouse,
    color: "from-cyan-500 to-sky-500",
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, productsRes] = await Promise.all([
        api.get("/products/stats"),
        api.get("/products"),
      ]);
      setStats(statsRes.data);
      setProducts(
        Array.isArray(productsRes.data)
          ? productsRes.data
          : productsRes.data.products || [],
      );
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* LOGOUT BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-2 text-sm font-bold text-rose-600 cursor-pointer border-0 shadow-sm hover:bg-rose-100"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* BANNER CARD */}
      <div className="rounded-[40px] border border-violet-100 bg-gradient-to-br from-violet-700 via-fuchsia-600 to-violet-500 p-8 text-white shadow-2xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-widest font-bold">
              <FaLeaf /> Freshora Analytics
            </div>
            <h2 className="text-3xl font-bold">Your Store at a Glance.</h2>
            <p className="mt-2 text-sm text-violet-50/80">
              Manage products, track stock, and optimize your inventory
              workflow.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/products"
              className="bg-white/10 px-6 py-3 rounded-2xl font-bold text-white hover:bg-white/20 transition"
            >
              View List
            </Link>
            <Link
              to="/add-product"
              className="bg-white px-6 py-3 rounded-2xl font-bold text-violet-700 shadow-xl hover:scale-105 transition"
            >
              Add Product
            </Link>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="flex flex-col gap-4">
        {cards.map((c) => (
          <div
            key={c.key}
            className={`rounded-[30px] bg-gradient-to-r ${c.color} p-6 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase opacity-80">
                  {c.label}
                </p>
                <h3 className="text-4xl font-bold mt-1">{stats[c.key] ?? 0}</h3>
              </div>
              <div className="text-3xl opacity-30">
                <c.icon />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* STOCK GRAPH CHART SECTION */}
      <div className="rounded-[30px] bg-white p-8 shadow-xl border border-slate-50">
        <h3 className="text-xl font-bold text-slate-800 mb-6">
          Stock Distribution
        </h3>
        {loading ? (
          <p className="text-sm text-slate-400 text-center py-6">
            Loading graph data...
          </p>
        ) : (
          <ProductChart products={products} />
        )}
      </div>
    </div>
  );
}
