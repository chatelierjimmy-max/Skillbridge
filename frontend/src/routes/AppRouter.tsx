import { Suspense, type ReactElement } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import PublicLayout from "../components/layout/PublicLayout";
import AdminRoute from "./AdminRoute";
import {
  AdminLogsPage,
  AdminUsersPage,
  AppLayout,
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

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={lazyRoute(<HomePage />)} />
          <Route path="/login" element={lazyRoute(<LoginPage />)} />
          <Route path="/register" element={lazyRoute(<RegisterPage />)} />
          <Route
            path="/forgot-password"
            element={lazyRoute(<ForgotPasswordPage />)}
          />
          <Route
            path="/reset-password"
            element={lazyRoute(<ResetPasswordPage />)}
          />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={lazyRoute(<AppLayout />)}>
            <Route path="/dashboard" element={lazyRoute(<DashboardPage />)} />
            <Route path="/profile" element={lazyRoute(<ProfilePage />)} />
            <Route path="/search" element={lazyRoute(<SearchPage />)} />
            <Route path="/groups" element={lazyRoute(<GroupsPage />)} />
            <Route path="/groups/:id" element={lazyRoute(<GroupDetailPage />)} />
            <Route
              path="/groups/:id/sessions"
              element={lazyRoute(<GroupSessionsPage />)}
            />
            <Route
              path="/groups/:id/messages"
              element={lazyRoute(<GroupMessagesPage />)}
            />
            <Route path="/groups/:id/video" element={lazyRoute(<VideoRoom />)} />
            <Route path="/sessions" element={lazyRoute(<SessionsPage />)} />
            <Route
              path="/sessions/:sessionId/video"
              element={lazyRoute(<VideoRoom />)}
            />
            <Route
              path="/notifications"
              element={lazyRoute(<NotificationsPage />)}
            />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={lazyRoute(<AppLayout />)}>
            <Route path="/admin/users" element={lazyRoute(<AdminUsersPage />)} />
            <Route path="/admin/logs" element={lazyRoute(<AdminLogsPage />)} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
