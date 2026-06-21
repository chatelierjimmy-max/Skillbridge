import { Suspense, type ReactElement } from "react";
import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import PublicLayout from "../components/layout/PublicLayout";
import AdminRoute from "./AdminRoute";
import {
  AdminLogsPage,
  AdminUsersPage,
  DashboardPage,
  ForgotPasswordPage,
  GroupDetailPage,
  GroupMessagesPage,
  GroupsPage,
  GroupSessionsPage,
  HomePage,
  LoginPage,
  NotificationsPage,
  ProfilePage,
  RegisterPage,
  ResetPasswordPage,
  SearchPage,
  SessionsPage,
  VideoRoom,
} from "./lazyPages";
import PrivateRoute from "./PrivateRoute";

const routeFallback = (
  <div className="min-h-40 p-6 text-sm text-slate-600">Chargement...</div>
);

function lazyRoute(element: ReactElement) {
  return <Suspense fallback={routeFallback}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: lazyRoute(<HomePage />),
      },
      {
        path: "/login",
        element: lazyRoute(<LoginPage />),
      },
      {
        path: "/register",
        element: lazyRoute(<RegisterPage />),
      },
      {
        path: "/forgot-password",
        element: lazyRoute(<ForgotPasswordPage />),
      },
      {
        path: "/reset-password",
        element: lazyRoute(<ResetPasswordPage />),
      },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/dashboard",
            element: lazyRoute(<DashboardPage />),
          },
          {
            path: "/profile",
            element: lazyRoute(<ProfilePage />),
          },
          {
            path: "/search",
            element: lazyRoute(<SearchPage />),
          },
          {
            path: "/groups",
            element: lazyRoute(<GroupsPage />),
          },
          {
            path: "/groups/:id",
            element: lazyRoute(<GroupDetailPage />),
          },
          {
            path: "/groups/:id/sessions",
            element: lazyRoute(<GroupSessionsPage />),
          },
          {
            path: "/groups/:id/messages",
            element: lazyRoute(<GroupMessagesPage />),
          },
          {
            path: "/groups/:id/video",
            element: lazyRoute(<VideoRoom />),
          },
          {
            path: "/sessions",
            element: lazyRoute(<SessionsPage />),
          },
          {
            path: "/sessions/:sessionId/video",
            element: lazyRoute(<VideoRoom />),
          },
          {
            path: "/notifications",
            element: lazyRoute(<NotificationsPage />),
          },
        ],
      },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/admin/users",
            element: lazyRoute(<AdminUsersPage />),
          },
          {
            path: "/admin/logs",
            element: lazyRoute(<AdminLogsPage />),
          },
        ],
      },
    ],
  },
]);
