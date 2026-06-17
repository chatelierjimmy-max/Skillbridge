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

// Schéma de validation du formulaire d'inscription
import { registerSchema } from "../../schemas/auth.schema";

// Type TypeScript représentant les données du formulaire d'inscription
import type { RegisterFormData } from "../../schemas/auth.schema";

// Service API responsable de l'authentification
import { authService } from "../../services/auth.service";

// Hook personnalisé pour connaître l'état d'authentification
import { useAuth } from "../../hooks/useAuth";

// Utilitaire permettant d'afficher une erreur API lisible
import { getApiErrorMessage } from "../../utils/apiError";

// Page d'inscription
export default function RegisterPage() {
  // Fonction permettant de rediriger l'utilisateur par programmation
  const navigate = useNavigate();

  // isAuthenticated indique si l'utilisateur est déjà connecté
  const { isAuthenticated } = useAuth();

  // Message d'erreur retourné par le serveur
  const [serverError, setServerError] = useState("");

  // Initialisation du formulaire avec react-hook-form
  const {
    // register connecte les champs HTML au formulaire
    register,

    // handleSubmit valide le formulaire avant d'appeler onSubmit
    handleSubmit,

    // errors contient les erreurs de validation
    // isSubmitting indique si la requête est en cours
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    // Utilisation du schéma Zod pour valider les données saisies
    resolver: zodResolver(registerSchema),
  });

  /**
   * Fonction appelée lorsque le formulaire est valide.
   *
   * @param data Données validées du formulaire d'inscription
   */
  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Réinitialise les erreurs serveur précédentes
      setServerError("");

      // Envoie les informations d'inscription au backend
      await authService.register(data);

      // Redirige vers la page de connexion après création du compte
      navigate("/login");
    } catch (error) {
      // Affiche une erreur lisible si l'inscription échoue
      setServerError(getApiErrorMessage(error, "Erreur lors de l'inscription"));
    }
  };

  /**
   * Si l'utilisateur est déjà connecté,
   * il ne doit pas accéder à la page d'inscription.
   */
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-16 lg:py-20">
      {/* Carte contenant le formulaire d'inscription */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Créer un compte</h1>

        <p className="mt-2 text-sm text-slate-600">Rejoins SkillBridge.</p>

        {/* Message d'erreur serveur */}
        {serverError && (
          <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {/* Formulaire d'inscription */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          {/* Champ prénom */}
          <div>
            <label className="mb-1 block text-sm font-medium">Prénom</label>

            <input
              {...register("firstname")}
              className="w-full rounded-lg border px-4 py-3"
            />

            {/* Erreur de validation du prénom */}
            {errors.firstname && (
              <p className="mt-1 text-sm text-red-600">
                {errors.firstname.message}
              </p>
            )}
          </div>

          {/* Champ nom */}
          <div>
            <label className="mb-1 block text-sm font-medium">Nom</label>

            <input
              {...register("lastname")}
              className="w-full rounded-lg border px-4 py-3"
            />

            {/* Erreur de validation du nom */}
            {errors.lastname && (
              <p className="mt-1 text-sm text-red-600">
                {errors.lastname.message}
              </p>
            )}
          </div>

          {/* Champ email */}
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>

            <input
              type="email"
              {...register("email")}
              className="w-full rounded-lg border px-4 py-3"
            />

            {/* Erreur de validation de l'email */}
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

            {/* Erreur de validation du mot de passe */}
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
          >
            {isSubmitting ? "Inscription..." : "Créer mon compte"}
          </button>
        </form>

        {/* Lien vers la page de connexion */}
        <p className="mt-6 text-center text-sm">
          Déjà un compte ?{" "}
          <Link to="/login" className="font-medium text-blue-600">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
