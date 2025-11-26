import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();

  const base =
    "px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-200 transition";
  const active = "bg-slate-300";

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-lg font-semibold text-slate-900">
              Car Rental Demo
            </Link>
            <div className="hidden md:flex gap-1">
              <NavLink
                to="/cars"
                className={({ isActive }) =>
                  `${base} ${isActive ? active : ""}`
                }
              >
                Flota
              </NavLink>

              {user && (
                <NavLink
                  to="/my-reservations"
                  className={({ isActive }) =>
                    `${base} ${isActive ? active : ""}`
                  }
                >
                  Moje rezerwacje
                </NavLink>
              )}

              {isAdmin && (
                <>
                  <NavLink
                    to="/admin/cars"
                    className={({ isActive }) =>
                      `${base} ${isActive ? active : ""}`
                    }
                  >
                    Admin – auta
                  </NavLink>
                  <NavLink
                    to="/admin/reservations"
                    className={({ isActive }) =>
                      `${base} ${isActive ? active : ""}`
                    }
                  >
                    Admin – rezerwacje
                  </NavLink>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-slate-700">
                  Zalogowany jako{" "}
                  <span className="font-semibold">
                    {user.firstName} {user.lastName}
                  </span>
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-1 rounded-md text-sm bg-slate-800 text-white hover:bg-slate-700 transition"
                >
                  Wyloguj
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `${base} ${isActive ? active : ""}`
                  }
                >
                  Logowanie
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `${base} ${isActive ? active : ""}`
                  }
                >
                  Rejestracja
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
