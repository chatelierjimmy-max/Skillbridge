// Importation du composant Link de React Router.
// Permet de naviguer entre les pages sans recharger l'application.
import { Link } from "react-router-dom";

// Page d'accueil publique de SkillBridge
export default function HomePage() {
  return (
    // Section principale de la page
    // max-w-6xl : largeur maximale du contenu
    // flex-1 : occupe l'espace disponible dans le layout
    // clamp(...) : permet un espacement adaptatif selon la taille de l'écran
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
      {/* Bloc de présentation */}
      <div>
        {/* Titre principal de la plateforme */}
        <h1 className="mx-auto max-w-5xl text-center text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Trouve des partenaires pour progresser en
          {/* Passage à la ligne avec mise en valeur */}
          <span className="mt-3 block sm:mt-4">développement web.</span>
        </h1>

        {/* Sous-titre expliquant l'objectif de la plateforme */}
        <p className="mx-auto mt-6 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
          SkillBridge permet aux apprenants de créer des groupes de travail,
          planifier des sessions et partager leurs compétences.
        </p>
      </div>

      {/* Bloc contenant les actions principales et les fonctionnalités */}
      <div className="flex flex-col gap-8">
        {/* Boutons d'action */}
        <div className="grid gap-3 sm:flex sm:justify-center sm:gap-5">
          {/* Redirection vers la page d'inscription */}
          <Link
            to="/register"
            className="inline-flex justify-center rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
          >
            Commencer
          </Link>

          {/* Redirection vers la page de connexion */}
          <Link
            to="/login"
            className="inline-flex justify-center rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
          >
            Se connecter
          </Link>
        </div>

        {/* Carte présentant les principales fonctionnalités */}
        <div className="w-full rounded-2xl border bg-slate-200 p-4 text-center shadow-sm sm:p-6">
          {/* Titre de la section fonctionnalités */}
          <h2 className="text-2xl font-semibold sm:text-3xl">Fonctionnalités</h2>

          {/* Liste des fonctionnalités proposées */}
          <ul className="mt-4 grid gap-2 text-slate-600 sm:grid-cols-2 lg:grid-cols-5">
            {/* Recherche d'utilisateurs selon leurs compétences */}
            <li>Recherche par compétence</li>

            {/* Création et participation à des groupes */}
            <li>Groupes d’entraide</li>

            {/* Organisation de sessions collaboratives */}
            <li>Sessions de travail</li>

            {/* Système de communication intégré */}
            <li>Messagerie de groupe</li>

            {/* Tableau de bord personnel */}
            <li>Dashboard personnel</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
