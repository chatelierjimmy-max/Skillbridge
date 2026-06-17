import { NavLink, Outlet } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Search,
  Shield,
  UserRound,
  Users,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function AppLayout() {
  const { user, logout, isAdmin } = useAuth();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/profile", label: "Profil", icon: UserRound },
    { to: "/search", label: "Recherche", icon: Search },
    { to: "/groups", label: "Groupes", icon: Users },
    { to: "/sessions", label: "Sessions", icon: CalendarDays },
    { to: "/notifications", label: "Notifications", icon: Bell },
  ];

  const adminItems = [
    { to: "/admin/users", label: "Utilisateurs", icon: Shield },
    { to: "/admin/logs", label: "Logs", icon: Shield },
  ];

  const sidebarLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r bg-white p-6 lg:block">
        <NavLink to="/dashboard" className="text-2xl font-bold text-blue-600">
          SkillBridge
        </NavLink>

        <nav className="mt-8 flex flex-col gap-3 text-sm">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={sidebarLinkClass}>
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <hr className="my-3" />
              {adminItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={sidebarLinkClass}>
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>
      </aside>

      <div className="lg:ml-64">
        <header className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <NavLink
                to="/dashboard"
                className="block text-xl font-bold text-blue-600 lg:hidden"
              >
                SkillBridge
              </NavLink>

              <p className="truncate text-sm text-slate-600">
                Bonjour, <strong>{user?.firstname}</strong>
              </p>
            </div>

            <button
              onClick={logout}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-red-600 px-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-700 sm:px-4"
              title="Deconnexion"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>

          <nav className="flex gap-2 overflow-x-auto border-t px-4 py-2 sm:px-6 lg:hidden">
            {[...navItems, ...(isAdmin ? adminItems : [])].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
