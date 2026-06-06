// Importation de Link et Outlet depuis react-router-dom
// Link permet de naviguer entre les pages sans recharger l'application
// Outlet permet d'afficher le composant enfant correspondant à la route actuelle
import { Link, Outlet } from "react-router-dom";

// Importation du hook personnalisé useAuth
// Ce hook sert à récupérer les informations liées à l'utilisateur connecté
import { useAuth } from "../../hooks/useAuth";

// Composant principal de mise en page de l'application
export default function AppLayout() {
  // Récupération des données et fonctions depuis le contexte d'authentification
  // user contient les informations de l'utilisateur connecté
  // logout permet de déconnecter l'utilisateur
  // isAdmin indique si l'utilisateur possède un rôle administrateur
  const { user, logout, isAdmin } = useAuth();

  return (
    // Conteneur principal de l'application
    // min-h-screen force la hauteur minimale à prendre toute la hauteur de l'écran
    // bg-slate-50 applique une couleur de fond claire
    <div className="min-h-screen bg-slate-50">
      {/* Barre latérale de navigation */}
      {/* fixed : reste toujours à gauche même lors du scroll */}
      {/* hidden md:block : cachée sur mobile, affichée à partir des écrans moyens */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r bg-white p-6 md:block">
        {/* Logo / lien principal vers le dashboard */}
        <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
          SkillBridge
        </Link>

        {/* Menu de navigation principal */}
        <nav className="mt-8 flex flex-col gap-3 text-sm">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profil</Link>
          <Link to="/search">Recherche</Link>
          <Link to="/groups">Groupes</Link>
          <Link to="/sessions">Mes sessions</Link>
          <Link to="/notifications">Notifications</Link>

          {/* Affichage conditionnel des liens administrateur */}
          {/* Ces liens ne sont visibles que si isAdmin vaut true */}
          {isAdmin && (
            <>
              {/* Séparateur visuel entre les liens utilisateur et admin */}
              <hr className="my-3" />

              <Link to="/admin/users">Admin utilisateurs</Link>
              <Link to="/admin/logs">Admin logs</Link>
            </>
          )}
        </nav>
      </aside>

      {/* Zone principale du layout */}
      {/* md:ml-64 ajoute une marge à gauche pour laisser la place à la sidebar */}
      <div className="md:ml-64">
        {/* En-tête supérieur */}
        <header className="flex items-center justify-between border-b bg-white px-4 py-4">
          {/* Message de bienvenue */}
          {/* user?.firstname évite une erreur si user est null ou undefined */}
          <p className="text-sm">
            Bonjour, <strong>{user?.firstname}</strong>
          </p>

          {/* Bouton de déconnexion */}
          {/* Au clic, la fonction logout est exécutée */}
          <button
            onClick={logout}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-red-700"
          >
            Déconnexion
          </button>
        </header>

        {/* Contenu principal de la page */}
        {/* Outlet affiche dynamiquement la page correspondant à la route active */}
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
