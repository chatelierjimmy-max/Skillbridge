import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2 md:items-center">
      <div>
        <p className="mb-3 text-sm font-semibold uppercase text-blue-600">
          Apprentissage collaboratif
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Trouve des partenaires pour progresser en développement web.
        </h1>

        <p className="mt-6 text-lg text-slate-600">
          SkillBridge permet aux apprenants de créer des groupes de travail,
          planifier des sessions et partager leurs compétences.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white"
          >
            Commencer
          </Link>

          <Link to="/login" className="rounded-lg border px-5 py-3 font-medium">
            Se connecter
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Fonctionnalités</h2>

        <ul className="mt-4 space-y-3 text-slate-600">
          <li>Recherche par compétence</li>
          <li>Groupes d’entraide</li>
          <li>Sessions de travail</li>
          <li>Messagerie de groupe</li>
          <li>Dashboard personnel</li>
        </ul>
      </div>
    </section>
  );
}
