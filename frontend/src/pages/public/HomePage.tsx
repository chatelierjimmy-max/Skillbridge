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
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-[clamp(1.5rem,4vh,3rem)] px-4 pb-[clamp(1.5rem,4vh,3rem)] pt-[clamp(2rem,6vh,5rem)]">
      {/* Bloc de présentation */}
      <div>
        {/* Titre principal de la plateforme */}
        <h1 className="mx-auto max-w-5xl text-justify text-4xl font-bold leading-relaxed tracking-tight text-slate-900 [text-align-last:center] md:text-5xl">
          Trouve des partenaires pour progresser en
          {/* Passage à la ligne avec mise en valeur */}
          <span className="mt-6 block">développement web.</span>
        </h1>

        {/* Sous-titre expliquant l'objectif de la plateforme */}
        <p className="mt-6 text-center text-lg text-slate-600">
          SkillBridge permet aux apprenants de créer des groupes de travail,
          planifier des sessions et partager leurs compétences.
        </p>
      </div>

      {/* Bloc contenant les actions principales et les fonctionnalités */}
      <div className="flex flex-col gap-[clamp(1.5rem,4vh,3rem)]">
        {/* Boutons d'action */}
        <div className="flex justify-center gap-[clamp(2rem,5vw,4.5rem)]">
          {/* Redirection vers la page d'inscription */}
          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
          >
            Commencer
          </Link>

          {/* Redirection vers la page de connexion */}
          <Link
            to="/login"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
          >
            Se connecter
          </Link>
        </div>

        {/* Carte présentant les principales fonctionnalités */}
        <div className="w-full rounded-2xl border bg-slate-200 p-3 text-center shadow-sm">
          {/* Titre de la section fonctionnalités */}
          <h2 className="text-3xl font-semibold">Fonctionnalités</h2>

          {/* Liste des fonctionnalités proposées */}
          <ul className="mt-2 space-y-1 text-slate-600">
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
