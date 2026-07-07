import { FaSignOutAlt, FaLeaf } from 'react-icons/fa';

export default function Navbar({ onLogout }) {
  return (
    <header className="flex items-center justify-between border-b border-violet-100 bg-white/80 px-6 py-4 shadow-sm backdrop-blur">
      <div>
        <div className="flex items-center gap-2 text-violet-700">
          <FaLeaf />
          <h1 className="text-xl font-semibold">Freshora Admin</h1>
        </div>
        <p className="text-sm text-slate-500">Fresh fruit inventory, beautifully managed</p>
      </div>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2 text-white shadow-lg transition hover:scale-[1.01]"
      >
        <FaSignOutAlt />
        Logout
      </button>
    </header>
  );
}
