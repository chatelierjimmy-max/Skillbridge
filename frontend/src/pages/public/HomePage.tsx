import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-[clamp(1.5rem,4vh,3rem)] px-4 pb-[clamp(1.5rem,4vh,3rem)] pt-[clamp(2rem,6vh,5rem)]">
      <div>
        <h1 className="mx-auto max-w-5xl text-justify text-4xl font-bold leading-relaxed tracking-tight text-slate-900 [text-align-last:center] md:text-5xl">
          Trouve des partenaires pour progresser en
          <span className="mt-6 block">développement web.</span>
        </h1>

        <p className="mt-6 text-center text-lg text-slate-600">
          SkillBridge permet aux apprenants de créer des groupes de travail,
          planifier des sessions et partager leurs compétences.
        </p>

      </div>

      <div className="flex flex-col gap-[clamp(1.5rem,4vh,3rem)]">
        <div className="flex justify-center gap-[clamp(2rem,5vw,4.5rem)]">
          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
          >
            Commencer
          </Link>

          <Link
            to="/login"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
          >
            Se connecter
          </Link>
        </div>

        <div className="w-full rounded-2xl border bg-slate-200 p-3 text-center shadow-sm">
          <h2 className="text-3xl font-semibold">Fonctionnalités</h2>

          <ul className="mt-2 space-y-1 text-slate-600">
            <li>Recherche par compétence</li>
            <li>Groupes d’entraide</li>
            <li>Sessions de travail</li>
            <li>Messagerie de groupe</li>
            <li>Dashboard personnel</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
