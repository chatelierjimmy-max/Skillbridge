import { lazy } from "react";

export const HomePage = lazy(() => import("../pages/public/HomePage"));
export const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
export const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
export const ForgotPasswordPage = lazy(
  () => import("../pages/auth/ForgotPasswordPage"),
);
export const ResetPasswordPage = lazy(
  () => import("../pages/auth/ResetPasswordPage"),
);

export const DashboardPage = lazy(() => import("../pages/app/DashboardPage"));
export const ProfilePage = lazy(() => import("../pages/app/ProfilePage"));
export const SearchPage = lazy(() => import("../pages/app/SearchPage"));
export const GroupsPage = lazy(() => import("../pages/app/GroupsPage"));
export const GroupDetailPage = lazy(() => import("../pages/app/GroupDetailPage"));
export const GroupSessionsPage = lazy(
  () => import("../pages/app/GroupSessionsPage"),
);
export const GroupMessagesPage = lazy(
  () => import("../pages/app/GroupMessagesPage"),
);
export const VideoRoom = lazy(() => import("../pages/app/VideoRoom"));
export const SessionsPage = lazy(() => import("../pages/app/SessionsPage"));
export const NotificationsPage = lazy(
  () => import("../pages/app/NotificationsPage"),
);

export const AdminUsersPage = lazy(() => import("../pages/admin/AdminUsersPage"));
export const AdminLogsPage = lazy(() => import("../pages/admin/AdminLogsPage"));
