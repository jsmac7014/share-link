import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { useUser } from "meteor/react-meteor-accounts";

import MainPage from "./pages/MainPage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "dashboard",
        element: (
          <AuthenticatedRoute>
            <Dashboard />
          </AuthenticatedRoute>
        ),
      },
    ],
  },

  {
    path: "sign-up",
    element: <SignUpPage />,
  },
  {
    path: "sign-in",
    element: <SignInPage />,
  },
]);

function AuthenticatedRoute({ children }) {
  const user = useUser();

  return user ? children : <Navigate to="/sign-in" />;
}

export default router;
