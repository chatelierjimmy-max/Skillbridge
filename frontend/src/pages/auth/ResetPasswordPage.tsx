import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { resetPasswordSchema } from "../../schemas/auth.schema";
import type { ResetPasswordFormData } from "../../schemas/auth.schema";
import { authService } from "../../services/auth.service";
import PasswordInput from "../../components/form/PasswordInput";
import { getApiErrorMessage } from "../../utils/apiError";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [serverError, setServerError] = useState("");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: tokenFromUrl,
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setServerError("");
      setMessage("");

      const response = await authService.resetPassword({
        token: data.token,
        password: data.password,
      });

      setMessage(response.message);
    } catch (error) {
      setServerError(
        getApiErrorMessage(error, "Erreur lors de la modification du mot de passe"),
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-16 lg:py-20">
      <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Nouveau mot de passe
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Choisis un nouveau mot de passe pour ton compte.
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

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          {tokenFromUrl ? (
            <input type="hidden" {...register("token")} />
          ) : (
            <div>
              <label className="mb-1 block text-sm font-medium">
                Token de réinitialisation
              </label>

              <input
                {...register("token")}
                className="w-full rounded-lg border px-4 py-3"
              />

              {errors.token && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.token.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Nouveau mot de passe
            </label>

            <PasswordInput
              autoComplete="new-password"
              {...register("password")}
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Confirmer le mot de passe
            </label>

            <PasswordInput
              autoComplete="new-password"
              {...register("confirmPassword")}
            />

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
          >
            {isSubmitting ? "Modification..." : "Modifier le mot de passe"}
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
