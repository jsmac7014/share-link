import React from "react";
import { RouterProvider } from "react-router-dom";
import router from '/imports/startup/client/routes';

export const App = () => (
  <RouterProvider router={router} />
);
