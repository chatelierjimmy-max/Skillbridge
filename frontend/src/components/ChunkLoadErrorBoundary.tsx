import { Component, type ErrorInfo, type ReactNode } from "react";

const RELOAD_STORAGE_KEY = "skillbridge:chunk-reload-at";
const RELOAD_GUARD_MS = 30_000;
const CLEAR_RELOAD_GUARD_MS = 5_000;

type ChunkLoadErrorBoundaryProps = {
  children: ReactNode;
};

type ChunkLoadErrorBoundaryState = {
  hasError: boolean;
  isChunkLoadError: boolean;
};

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function isChunkLoadError(error: unknown) {
  const message = errorMessage(error);

  return [
    "Failed to fetch dynamically imported module",
    "Importing a module script failed",
    "error loading dynamically imported module",
    "Loading chunk",
    "Load failed",
  ].some((pattern) => message.includes(pattern));
}

function shouldReloadAfterChunkError() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const lastReloadAt = Number(
      window.sessionStorage.getItem(RELOAD_STORAGE_KEY),
    );

    return !lastReloadAt || Date.now() - lastReloadAt > RELOAD_GUARD_MS;
  } catch {
    return true;
  }
}

function markChunkReloadAttempt() {
  try {
    window.sessionStorage.setItem(RELOAD_STORAGE_KEY, String(Date.now()));
  } catch {
    // The reload guard is best effort. If storage is blocked, still recover.
  }
}

function clearChunkReloadAttempt() {
  try {
    window.sessionStorage.removeItem(RELOAD_STORAGE_KEY);
  } catch {
    // Nothing to clean up when storage is unavailable.
  }
}

export default class ChunkLoadErrorBoundary extends Component<
  ChunkLoadErrorBoundaryProps,
  ChunkLoadErrorBoundaryState
> {
  private clearReloadTimer: number | undefined;

  state: ChunkLoadErrorBoundaryState = {
    hasError: false,
    isChunkLoadError: false,
  };

  static getDerivedStateFromError(
    error: unknown,
  ): ChunkLoadErrorBoundaryState {
    return {
      hasError: true,
      isChunkLoadError: isChunkLoadError(error),
    };
  }

  componentDidMount() {
    if (typeof window === "undefined") {
      return;
    }

    this.clearReloadTimer = window.setTimeout(
      clearChunkReloadAttempt,
      CLEAR_RELOAD_GUARD_MS,
    );
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    if (isChunkLoadError(error) && shouldReloadAfterChunkError()) {
      markChunkReloadAttempt();
      window.location.reload();
      return;
    }

    console.error("Application error", error, errorInfo);
  }

  componentWillUnmount() {
    if (this.clearReloadTimer) {
      window.clearTimeout(this.clearReloadTimer);
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const title = this.state.isChunkLoadError
      ? "Nouvelle version disponible"
      : "Erreur inattendue";
    const message = this.state.isChunkLoadError
      ? "Recharge la page pour recuperer les derniers fichiers de SkillBridge."
      : "Une erreur est survenue. Recharge la page pour relancer l'application.";

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <section className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
          <button
            type="button"
            onClick={() => {
              clearChunkReloadAttempt();
              window.location.reload();
            }}
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Recharger
          </button>
        </section>
      </main>
    );
  }
}
