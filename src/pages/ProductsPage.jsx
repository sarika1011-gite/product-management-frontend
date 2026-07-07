import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaEdit, FaEye, FaSearch, FaTrash } from 'react-icons/fa';
import api from '../services/api';

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products', {
        params: { search, category, status, sort, order, page, limit: 8 },
      });
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, status, sort, order, page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products]);

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-violet-100 bg-white/85 p-5 shadow-sm backdrop-blur">
        <button onClick={() => navigate('/')} className="mb-4 flex items-center gap-2 text-sm font-medium text-violet-700">
          <FaArrowLeft /> Back to Dashboard
        </button>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Fruit Products</h2>
            <p className="text-sm text-slate-500">Curate and manage your premium product catalog.</p>
          </div>
          <Link to="/products/new" className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2.5 font-semibold text-white shadow-lg">Add Product</Link>
        </div>
      </div>

      <div className="grid gap-4 rounded-[28px] border border-violet-100 bg-white/80 p-4 shadow-sm md:grid-cols-2 xl:grid-cols-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3.5 text-slate-400" />
          <input value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} className="w-full rounded-2xl border border-violet-200 bg-violet-50/70 py-2.5 pl-10 pr-3 outline-none focus:border-violet-400" placeholder="Search by name" />
        </div>
        <select value={category} onChange={(e) => { setPage(1); setCategory(e.target.value); }} className="rounded-2xl border border-violet-200 bg-violet-50/70 px-3 py-2.5 outline-none">
          <option value="">All Categories</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }} className="rounded-2xl border border-violet-200 bg-violet-50/70 px-3 py-2.5 outline-none">
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <div className="flex gap-2">
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="flex-1 rounded-2xl border border-violet-200 bg-violet-50/70 px-3 py-2.5 outline-none">
            <option value="createdAt">Created Date</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>
          <select value={order} onChange={(e) => setOrder(e.target.value)} className="rounded-2xl border border-violet-200 bg-violet-50/70 px-3 py-2.5 outline-none">
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>

      {loading ? <div className="rounded-[24px] border border-violet-100 bg-white/80 p-8 text-center text-slate-500 shadow-sm">Loading products...</div> : products.length === 0 ? <div className="rounded-[24px] border border-violet-100 bg-white/80 p-8 text-center text-slate-500 shadow-sm">No products found</div> : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div key={product._id} className="overflow-hidden rounded-[24px] border border-violet-100 bg-white/90 shadow-sm">
              <img src={`http://localhost:5000${product.image}`} alt={product.name} className="h-44 w-full object-cover" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-sm text-slate-500">{product.category}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs ${product.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{product.status}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-violet-700">₹{product.finalPrice}</p>
                    <p className="text-xs text-slate-400">Stock: {product.stock}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/products/${product._id}`} className="rounded-xl bg-violet-50 p-2 text-violet-700"><FaEye /></Link>
                    <Link to={`/products/${product._id}/edit`} className="rounded-xl bg-violet-50 p-2 text-violet-700"><FaEdit /></Link>
                    <button onClick={() => handleDelete(product._id)} className="rounded-xl bg-rose-50 p-2 text-rose-600"><FaTrash /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-2">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-2xl border border-violet-200 bg-white px-3 py-2 disabled:opacity-50">Prev</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button key={num} onClick={() => setPage(num)} className={`rounded-2xl border px-3 py-2 ${page === num ? 'border-violet-500 bg-violet-600 text-white' : 'border-violet-200 bg-white'}`}>{num}</button>
        ))}
        <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-2xl border border-violet-200 bg-white px-3 py-2 disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}
