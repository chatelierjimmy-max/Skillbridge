// Importation des composants de navigation de React Router
// Link permet de créer des liens internes sans rechargement de page
// Outlet permet d'afficher le composant correspondant à la route enfant active
import { Link, Outlet } from "react-router-dom";

// Composant de mise en page destiné aux visiteurs non connectés
export default function PublicLayout() {
  return (
    // Conteneur principal de la page
    // flex-col : organisation verticale des éléments
    // min-h-screen : occupe au minimum toute la hauteur de l'écran
    // bg-slate-50 : fond gris très clair
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* En-tête du site */}
      <header className="border-b bg-white">
        {/* Barre de navigation */}
        {/* max-w-6xl limite la largeur maximale */}
        {/* mx-auto centre horizontalement le contenu */}
        {/* grid-cols-[1fr_auto_1fr] crée 3 colonnes :
            - gauche : logo
            - centre : slogan
            - droite : boutons connexion/inscription */}
        <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          {/* Logo du site redirigeant vers la page d'accueil */}
          <Link to="/" className="text-3xl font-bold text-blue-600 sm:text-4xl">
            SkillBridge
          </Link>

          {/* Slogan du site */}
          {/* Caché sur mobile grâce à hidden */}
          {/* Visible à partir des écrans md */}
          <p className="hidden text-xl font-bold text-blue-600 lg:block">
            Apprentissage collaboratif
          </p>

          {/* Conteneur des boutons d'authentification */}
          <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-self-end">
            {/* Bouton de connexion */}
            <Link
              to="/login"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700"
            >
              Se connecter
            </Link>

            {/* Bouton d'inscription */}
            <Link
              to="/register"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700"
            >
              Inscription
            </Link>
          </div>
        </nav>
      </header>

      {/* Zone principale de contenu */}
      {/* flex-1 permet à cette section de prendre tout l'espace disponible */}
      <main className="flex flex-1 flex-col">
        {/* Affichage dynamique des pages publiques */}
        {/* Exemple : Accueil, Connexion, Inscription, etc. */}
        <Outlet />
      </main>

      {/* Pied de page */}
      <footer className="border-t bg-slate-900 text-slate-300">
        {/* Conteneur principal du footer */}
        {/* Une colonne sur mobile */}
        {/* Trois colonnes sur écrans moyens et plus */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-4 px-4 py-6 text-center sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-8">
          {/* Copyright */}
          <p className="text-xs text-slate-400 md:justify-self-start">
            © 2026 SkillBridge
          </p>

          {/* Présentation rapide de la plateforme */}
          <div>
            <p className="text-xl font-bold text-white">SkillBridge</p>

            <p className="mt-2 text-sm">
              Apprendre ensemble, progresser durablement.
            </p>
          </div>

          {/* Lien permettant d'envoyer un email */}
          {/* mailto ouvre automatiquement le logiciel de messagerie par défaut */}
          <a
            href="mailto:chatelierjimmy@gmail.com"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 md:justify-self-end"
          >
            Me contacter
          </a>
        </div>
      </footer>
    </div>
  );
}
