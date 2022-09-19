import React from "react";
import { createRoot } from "react-dom/client";
import Index from "./index";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { Dir2, File } from "./dir";
import App from "./app";

import "./main.css"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="dir/:dir" element={<Dir2 />}>
        <Route path=":file" element={<File />} />
      </Route>

      <Route path="/" element={<Index />} />
    </Route>
  )
);

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
