import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function AppLayout() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r bg-white p-6 md:block">
        <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
          SkillBridge
        </Link>

        <nav className="mt-8 flex flex-col gap-3 text-sm">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profil</Link>
          <Link to="/search">Recherche</Link>
          <Link to="/groups">Groupes</Link>
          <Link to="/sessions">Mes sessions</Link>
          <Link to="/notifications">Notifications</Link>

          {isAdmin && (
            <>
              <hr className="my-3" />
              <Link to="/admin/users">Admin utilisateurs</Link>
              <Link to="/admin/logs">Admin logs</Link>
            </>
          )}
        </nav>
      </aside>

      <div className="md:ml-64">
        <header className="flex items-center justify-between border-b bg-white px-4 py-4">
          <p className="text-sm">
            Bonjour, <strong>{user?.firstname}</strong>
          </p>

          <button
            onClick={logout}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-red-700"
          >
            Déconnexion
          </button>
        </header>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
