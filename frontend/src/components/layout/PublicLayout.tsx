import { Link, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b bg-white">
        <nav className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 py-4">
          <Link to="/" className="text-4xl font-bold text-blue-600">
            SkillBridge
          </Link>

          <p className="hidden text-xl font-bold text-blue-600 md:block">
            Apprentissage collaboratif
          </p>

          <div className="flex justify-self-end gap-3">
            <Link
              to="/login"
              className="inline-flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700"
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              className="inline-flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700"
            >
              Inscription
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>

      <footer className="border-t bg-slate-900 text-slate-300">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-4 px-4 py-6 text-center md:grid-cols-[1fr_auto_1fr]">
          <p className="text-xs text-slate-400 md:justify-self-start">
            © 2026 SkillBridge
          </p>
          <div>
            <p className="text-xl font-bold text-white">SkillBridge</p>
            <p className="mt-2 text-sm">
              Apprendre ensemble, progresser durablement.
            </p>
          </div>
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
