// Importation du composant Link de React Router.
// Permet de naviguer entre les pages sans recharger l'application.
import { Link } from "react-router-dom";

const testimonialCards = [
  {
    username: "Jimmy",
    rating: 4,
    comment:
      "J'ai trouvé un partenaire React rapidement et les sessions m'ont aidé à progresser rapidement.",
  },
  {
    username: "Nathan",
    rating: 5,
    comment:
      "Les groupes sont simples a rejoindre et les échanges restent bien organisés, la messagerie instantanée et la visio sont un plus.",
  },
  {
    username: "Laëtitia",
    rating: 4,
    comment:
      "J'aime pouvoir suivre mes compétences et retrouver mes sessions au même endroit.",
  },
];

function RatingStars({ rating }: { rating: number }) {
  return (
    <div
      className="mt-4 flex items-center justify-center gap-1"
      aria-label={`Note ${rating} sur 5`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={`text-xl leading-none ${
            index < rating ? "text-yellow-400" : "text-slate-300"
          }`}
        >
          {"\u2605"}
        </span>
      ))}
    </div>
  );
}

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
        <div className="flex min-h-48 w-full flex-col justify-center rounded-2xl border bg-slate-200 p-8 text-center shadow-sm sm:min-h-56 sm:p-12">
          {/* Titre de la section fonctionnalités */}
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Fonctionnalités
          </h2>

          {/* Liste des fonctionnalités proposées */}
          <ul className="mt-8 grid gap-4 text-slate-600 sm:grid-cols-2 lg:grid-cols-5">
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

        <div className="grid auto-rows-fr gap-4 md:grid-cols-3">
          {testimonialCards.map((card) => (
            <article
              key={card.username}
              className="flex min-h-44 flex-col justify-center rounded-2xl border bg-white p-6 text-center shadow-sm sm:min-h-52"
            >
              <h3 className="text-xl font-semibold text-slate-950">
                {card.username}
              </h3>
              <RatingStars rating={card.rating} />
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {card.comment}
              </p>
            </article>
          ))}
        </div>

        <section className="mx-auto w-full max-w-4xl rounded-2xl border bg-white p-4 text-center shadow-sm sm:p-6">
          <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
            Démonstration SkillBridge
          </h2>

          <div className="mx-auto mt-6 max-w-md overflow-hidden rounded-xl bg-slate-950">
            <video
              className="block h-auto w-full bg-slate-950"
              controls
              preload="none"
              aria-label="Video de demonstration SkillBridge"
            >
              <source src="/demo-video.mp4" type="video/mp4" />
              Votre navigateur ne peut pas lire cette video.
            </video>
          </div>
        </section>
      </div>
    </section>
  );
}
