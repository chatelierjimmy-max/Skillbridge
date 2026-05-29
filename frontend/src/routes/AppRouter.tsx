import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../components/layout/PublicLayout";
import AppLayout from "../components/layout/AppLayout";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import DashboardPage from "../pages/app/DashboardPage";
import ProfilePage from "../pages/app/ProfilePage";
import SearchPage from "../pages/app/SearchPage";
import GroupsPage from "../pages/app/GroupsPage";
import GroupDetailPage from "../pages/app/GroupDetailPage";
import GroupSessionsPage from "../pages/app/GroupSessionsPage";
import GroupMessagesPage from "../pages/app/GroupMessagesPage";
import SessionsPage from "../pages/app/SessionsPage";
import NotificationsPage from "../pages/app/NotificationsPage";

import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminLogsPage from "../pages/admin/AdminLogsPage";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
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
            element: <DashboardPage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/search",
            element: <SearchPage />,
          },
          {
            path: "/groups",
            element: <GroupsPage />,
          },
          {
            path: "/groups/:id",
            element: <GroupDetailPage />,
          },
          {
            path: "/groups/:id/sessions",
            element: <GroupSessionsPage />,
          },
          {
            path: "/groups/:id/messages",
            element: <GroupMessagesPage />,
          },
          {
            path: "/sessions",
            element: <SessionsPage />,
          },
          {
            path: "/notifications",
            element: <NotificationsPage />,
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
            element: <AdminUsersPage />,
          },
          {
            path: "/admin/logs",
            element: <AdminLogsPage />,
          },
        ],
      },
    ],
  },
]);
