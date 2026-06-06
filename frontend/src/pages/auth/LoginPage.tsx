// Importation de useState pour gérer un état local
import { useState } from "react";

// Navigate permet de rediriger automatiquement l'utilisateur
// useNavigate permet de rediriger après une action
// Link permet de naviguer vers une autre page sans rechargement
import { Navigate, useNavigate, Link } from "react-router-dom";

// Hook de react-hook-form pour gérer le formulaire
import { useForm } from "react-hook-form";

// Resolver permettant de connecter Zod à react-hook-form
import { zodResolver } from "@hookform/resolvers/zod";

// Schéma de validation du formulaire de connexion
import { loginSchema } from "../../schemas/auth.schema";

// Type TypeScript représentant les données du formulaire
import type { LoginFormData } from "../../schemas/auth.schema";

// Service API responsable de l'authentification
import { authService } from "../../services/auth.service";

// Hook personnalisé pour gérer l'authentification côté client
import { useAuth } from "../../hooks/useAuth";

// Utilitaire permettant d'afficher une erreur API lisible
import { getApiErrorMessage } from "../../utils/apiError";

// Page de connexion
export default function LoginPage() {
  // Fonction de navigation programmatique
  const navigate = useNavigate();

  // login : fonction qui enregistre le token et l'utilisateur
  // isAuthenticated : indique si l'utilisateur est déjà connecté
  const { login, isAuthenticated } = useAuth();

  // Message d'erreur retourné par le serveur
  const [serverError, setServerError] = useState("");

  // Initialisation du formulaire avec react-hook-form
  const {
    // register relie les champs HTML au formulaire
    register,

    // handleSubmit gère la soumission et lance la validation
    handleSubmit,

    // errors contient les erreurs de validation
    // isSubmitting indique si le formulaire est en cours d'envoi
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    // Utilisation du schéma Zod pour valider les champs
    resolver: zodResolver(loginSchema),
  });

  /**
   * Fonction appelée lorsque le formulaire est valide.
   *
   * @param data Données validées du formulaire
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      // Réinitialise l'erreur précédente
      setServerError("");

      // Envoie les identifiants au backend
      const response = await authService.login(data);

      // Stocke le token et les données utilisateur
      login(response.accessToken, response.user);

      // Redirige l'utilisateur vers le tableau de bord
      navigate("/dashboard");
    } catch (error) {
      // Affiche une erreur lisible si la connexion échoue
      setServerError(getApiErrorMessage(error, "Erreur de connexion"));
    }
  };

  /**
   * Si l'utilisateur est déjà connecté,
   * il est redirigé automatiquement vers le dashboard.
   */
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      {/* Carte contenant le formulaire de connexion */}
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Connexion</h1>

        <p className="mt-2 text-sm text-slate-600">
          Connecte-toi à SkillBridge.
        </p>

        {/* Erreur serveur */}
        {serverError && (
          <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {/* Formulaire de connexion */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          {/* Champ email */}
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>

            <input
              type="email"
              {...register("email")}
              className="w-full rounded-lg border px-4 py-3"
            />

            {/* Erreur de validation email */}
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Champ mot de passe */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Mot de passe
            </label>

            <input
              type="password"
              {...register("password")}
              className="w-full rounded-lg border px-4 py-3"
            />

            {/* Erreur de validation mot de passe */}
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Bouton de connexion */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Lien vers la page d'inscription */}
        <p className="mt-6 text-center text-sm">
          Pas encore de compte ?{" "}
          <Link to="/register" className="font-medium text-blue-600">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
