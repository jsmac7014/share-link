import React from "react";
import { RouterProvider } from "react-router-dom";
import router from '/imports/startup/client/routes';
import {HelmetProvider} from "react-helmet-async";

export const App = () => (
    <HelmetProvider>
        <RouterProvider router={router} />
    </HelmetProvider>
);
