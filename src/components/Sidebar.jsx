import { NavLink } from 'react-router-dom';
import { FaBoxes, FaChartPie, FaPlusCircle } from 'react-icons/fa';

const links = [
  { to: '/', label: 'Dashboard', icon: FaChartPie },
  { to: '/products', label: 'Products', icon: FaBoxes },
  { to: '/products/new', label: 'Add Product', icon: FaPlusCircle },
];

export default function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 bg-gradient-to-b from-violet-800 via-fuchsia-700 to-violet-900 p-6 text-white md:block">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl shadow-lg">
          🍓
        </div>
        <div>
          <p className="text-xl font-semibold">Freshora</p>
          <p className="text-sm text-violet-100/80">Fruit Admin Hub</p>
        </div>
      </div>

      <nav className="space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl p-3 text-sm font-medium transition ${isActive ? 'bg-white/20 shadow-lg' : 'text-violet-50/90 hover:bg-white/10'}`
            }
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
