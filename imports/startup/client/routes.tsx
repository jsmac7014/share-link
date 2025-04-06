import React from "react";
import {Meteor} from "meteor/meteor";
import {createBrowserRouter, Navigate} from "react-router-dom";
import SignUpPage from "/imports/ui/pages/SignUpPage";
import SignInPage from "/imports/ui/pages/SignInPage";
import MainLayout from "/imports/ui/layouts/MainLayout";
import Dashboard from "/imports/ui/pages/Dashboard";
import GroupPage from "/imports/ui/pages/GroupPage";
import {useTracker} from "meteor/react-meteor-data";
import ProfilePage from "/imports/ui/pages/ProfilePage";
import InviteRedirect from "/imports/ui/pages/InviteRedirect";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout/>,
        children: [
            {
                index: true,
                element: (
                    <AuthenticatedRoute>
                        <Dashboard/>
                    </AuthenticatedRoute>
                ),
            },
            {
                path: "group/:groupId",
                element: (
                    <AuthenticatedRoute>
                        <GroupPage/>
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
                        <ProfilePage/>
                    </AuthenticatedRoute>
                ),
            }
        ],
    },

    {
        path: "sign-up",
        element: <SignUpPage/>,
    },
    {
        path: "sign-in",
        element: <SignInPage/>,
    }
]);

function AuthenticatedRoute({ children }: React.PropsWithChildren<{}>) {
    const { userId } = useTracker(() => ({
        userId: Meteor.userId(),
        isLoggingIn: Meteor.loggingIn(),
    }));

    return userId ? children : <Navigate to="/sign-in" />;
}
export default router;
