import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../services/api';

const initialState = {
  name: '',
  category: '',
  brand: '',
  price: '',
  discountPercentage: 0,
  stock: '',
  description: '',
  status: 'Active',
  image: null,
};

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setForm({ ...initialState, ...data, image: null });
      } catch (error) {
        toast.error('Unable to load product');
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) payload.append(key, value);
    });

    try {
      if (id) {
        await api.put(`/products/${id}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated');
      } else {
        await api.post('/products', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created');
      }
      navigate('/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 rounded-[28px] border border-violet-100 bg-white/85 p-5 shadow-sm backdrop-blur">
        <button onClick={() => navigate('/')} className="mb-4 flex items-center gap-2 text-sm font-medium text-violet-700">
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h2 className="text-2xl font-semibold">{id ? 'Edit Product' : 'Add Product'}</h2>
        <p className="text-sm text-slate-500">Fill in the fresh fruit details with a polished, premium format.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-[28px] border border-violet-100 bg-white/90 p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <input required name="name" value={form.name} onChange={handleChange} className="rounded-2xl border border-violet-200 bg-violet-50/70 px-4 py-3 outline-none focus:border-violet-400" placeholder="Product Name" />
          <input required name="category" value={form.category} onChange={handleChange} className="rounded-2xl border border-violet-200 bg-violet-50/70 px-4 py-3 outline-none focus:border-violet-400" placeholder="Category" />
          <input name="brand" value={form.brand} onChange={handleChange} className="rounded-2xl border border-violet-200 bg-violet-50/70 px-4 py-3 outline-none focus:border-violet-400" placeholder="Brand" />
          <input required name="price" value={form.price} onChange={handleChange} className="rounded-2xl border border-violet-200 bg-violet-50/70 px-4 py-3 outline-none focus:border-violet-400" placeholder="Price" />
          <input name="discountPercentage" value={form.discountPercentage} onChange={handleChange} className="rounded-2xl border border-violet-200 bg-violet-50/70 px-4 py-3 outline-none focus:border-violet-400" placeholder="Discount %" />
          <input required name="stock" value={form.stock} onChange={handleChange} className="rounded-2xl border border-violet-200 bg-violet-50/70 px-4 py-3 outline-none focus:border-violet-400" placeholder="Stock" />
        </div>
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full rounded-2xl border border-violet-200 bg-violet-50/70 px-4 py-3 outline-none focus:border-violet-400" placeholder="Description" rows="4" />
        <select name="status" value={form.status} onChange={handleChange} className="rounded-2xl border border-violet-200 bg-violet-50/70 px-4 py-3 outline-none">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <input type="file" accept="image/*" onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.files[0] }))} className="block w-full rounded-2xl border border-dashed border-violet-300 bg-violet-50/60 p-3 text-sm" />
        <button className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-3 font-semibold text-white shadow-lg">Save Product</button>
      </form>
    </div>
  );
}
