import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { forgotPasswordSchema } from "../../schemas/auth.schema";
import type { ForgotPasswordFormData } from "../../schemas/auth.schema";
import { authService } from "../../services/auth.service";
import { getApiErrorMessage } from "../../utils/apiError";

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState("");
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setServerError("");
      setMessage("");
      setResetLink("");

      const response = await authService.forgotPassword(data);

      setMessage(response.message);
      setResetLink(response.resetLink || "");
    } catch (error) {
      setServerError(
        getApiErrorMessage(error, "Erreur lors de la demande de réinitialisation"),
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-16 lg:py-20">
      <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Mot de passe oublié
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Indique ton email pour recevoir un lien de réinitialisation.
        </p>

        {serverError && (
          <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {message && (
          <div className="mt-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {resetLink && (
          <a
            href={resetLink}
            className="mt-4 inline-flex w-full justify-center rounded-lg bg-slate-100 px-4 py-3 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-200"
          >
            Ouvrir le lien de réinitialisation
          </a>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>

            <input
              type="email"
              {...register("email")}
              className="w-full rounded-lg border px-4 py-3"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
          >
            {isSubmitting ? "Envoi..." : "Envoyer le lien"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="font-medium text-blue-600">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
