import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import api from "../services/api";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        toast.error("Unable to load product");
      }
    };
    fetchProduct();
  }, [id]);

  if (!product)
    return (
      <div className="rounded-[24px] border border-violet-100 bg-white/80 p-8 text-center text-slate-500 shadow-sm">
        Loading product...
      </div>
    );

  return (
    <div className="rounded-[28px] border border-violet-100 bg-white/90 p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 font-medium text-violet-700"
        >
          <FaArrowLeft /> Back to Products
        </button>
        <h2 className="text-2xl font-semibold">Product Details</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <img
          src={`https://product-management-backend-ibmd.onrender.com${product.image}`}
          alt={product.name}
          className="h-80 w-full rounded-[24px] object-cover"
        />
        <div className="space-y-3">
          <h3 className="text-3xl font-semibold">{product.name}</h3>
          <p className="text-slate-500">
            {product.category} • {product.brand}
          </p>
          <p className="text-2xl font-bold text-violet-700">
            ₹{product.finalPrice}
          </p>
          <p className="text-slate-700">{product.description}</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-violet-50 p-3">
              <span className="block text-slate-500">Price</span>
              <strong>₹{product.price}</strong>
            </div>
            <div className="rounded-2xl bg-violet-50 p-3">
              <span className="block text-slate-500">Discount</span>
              <strong>{product.discountPercentage}%</strong>
            </div>
            <div className="rounded-2xl bg-violet-50 p-3">
              <span className="block text-slate-500">Stock</span>
              <strong>{product.stock}</strong>
            </div>
            <div className="rounded-2xl bg-violet-50 p-3">
              <span className="block text-slate-500">Status</span>
              <strong>{product.status}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
