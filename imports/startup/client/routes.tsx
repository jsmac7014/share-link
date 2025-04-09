import React from "react";
import { Meteor } from "meteor/meteor";
import { createBrowserRouter, Navigate } from "react-router-dom";
import SignUpPage from "/imports/ui/pages/SignUpPage";
import SignInPage from "/imports/ui/pages/SignInPage";
import MainLayout from "/imports/ui/layouts/MainLayout";
import Dashboard from "/imports/ui/pages/Dashboard";
import GroupPage from "/imports/ui/pages/GroupPage";
import { useTracker } from "meteor/react-meteor-data";
import ProfilePage from "/imports/ui/pages/ProfilePage";
import InviteRedirect from "/imports/ui/pages/InviteRedirect";
import HomePage from "/imports/ui/pages/HomePage";
import NotFoundPage from "/imports/ui/pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/dashboard",
        element: (
          <AuthenticatedRoute>
            <Dashboard />
          </AuthenticatedRoute>
        ),
      },
      {
        path: "group/:groupId",
        element: (
          <AuthenticatedRoute>
            <GroupPage />
          </AuthenticatedRoute>
        ),
      },
      {
        path: "invite/:inviteId",
        element: (
          <AuthenticatedRoute>
            <InviteRedirect />
          </AuthenticatedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <AuthenticatedRoute>
            <ProfilePage />
          </AuthenticatedRoute>
        ),
      },
    ],
  },

  {
    index: true,
    path: "/",
    element: <HomePage />,
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

function AuthenticatedRoute({ children }: React.PropsWithChildren<{}>) {
  const { userId } = useTracker(() => ({
    userId: Meteor.userId(),
    isLoggingIn: Meteor.loggingIn(),
  }));

  return userId ? children : <Navigate to="/sign-in" />;
}
export default router;
