import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
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
  const [products, setProducts] = useState([]); // ग्राफसाठी प्रॉडक्ट्सची स्टेट
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // १. स्टॅट्सचा डेटा आणणे
        const statsRes = await api.get("/products/stats");
        setStats(statsRes.data);

        // २. ग्राफसाठी सर्व प्रॉडक्ट्सचा डेटा आणणे
        const productsRes = await api.get("/products");

        // 🛠️ डेटा फॉरमॅट चेक करणे (बॅकएंड ज्या फॉरमॅटमध्ये पाठवेल त्यानुसार)
        if (Array.isArray(productsRes.data)) {
          setProducts(productsRes.data);
        } else if (
          productsRes.data &&
          Array.isArray(productsRes.data.products)
        ) {
          setProducts(productsRes.data.products);
        } else if (productsRes.data && Array.isArray(productsRes.data.data)) {
          setProducts(productsRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* हेडर सेक्शन */}
      <div className="rounded-[28px] border border-violet-100 bg-gradient-to-r from-violet-700 via-fuchsia-600 to-violet-500 p-6 text-white shadow-xl">
        <button
          onClick={() => navigate("/")}
          className="mb-4 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur"
        >
          <FaArrowLeft /> Back
        </button>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm">
              <FaLeaf /> Freshora insights
            </div>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Fresh fruit inventory, beautifully tracked.
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-violet-50/90">
              Monitor stock health, manage seasonal collections, and keep your
              storefront ready for every harvest.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/products"
              className="rounded-2xl border border-white/30 bg-white/15 px-4 py-2.5 font-semibold text-white shadow-lg transition hover:bg-white/20"
            >
              View Products
            </Link>
            <Link
              to="/products/new"
              className="rounded-2xl bg-white px-4 py-2.5 font-semibold text-violet-700 shadow-lg transition hover:scale-[1.01]"
            >
              Add Product
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[24px] border border-violet-100 bg-white/80 p-8 text-center text-slate-500 shadow-sm">
          Loading dashboard...
        </div>
      ) : (
        <>
          {/* ५ कार्ड्सचे बॉक्स (Stats Grid) */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cards.map(({ key, label, icon: Icon, color }) => (
              <div
                key={key}
                className={`rounded-[24px] bg-gradient-to-r ${color} p-5 text-white shadow-lg`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm opacity-90">{label}</p>
                    <h3 className="mt-2 text-3xl font-semibold">
                      {stats[key] ?? 0}
                    </h3>
                  </div>
                  <div className="rounded-2xl bg-white/20 p-3 text-xl">
                    <Icon />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 📊 Product-wise Graph */}
          <div className="mt-6">
            <ProductChart products={products} />
          </div>
        </>
      )}
    </div>
  );
}
