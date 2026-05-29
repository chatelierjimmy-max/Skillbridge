import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "../../schemas/auth.schema";
import type { LoginFormData } from "../../schemas/auth.schema";

import { authService } from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../utils/apiError";

export default function LoginPage() {
  const navigate = useNavigate();

  const { login, isAuthenticated } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError("");

      const response = await authService.login(data);

      login(response.accessToken, response.user);

      navigate("/dashboard");
    } catch (error) {
      setServerError(getApiErrorMessage(error, "Erreur de connexion"));
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Connexion</h1>

        <p className="mt-2 text-sm text-slate-600">
          Connecte-toi à SkillBridge.
        </p>

        {serverError && (
          <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {serverError}
          </div>
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

          <div>
            <label className="mb-1 block text-sm font-medium">
              Mot de passe
            </label>

            <input
              type="password"
              {...register("password")}
              className="w-full rounded-lg border px-4 py-3"
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white"
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>

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
