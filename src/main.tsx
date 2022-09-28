import React from "react";
import { createRoot } from "react-dom/client";
import Index from "./index";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { store } from "./store";
import { Dir2 } from "./dir";
import { File } from "./file";
import App from "./app";
import { Provider } from "react-redux";
import "./main.css";
import { add, addBatch } from "./files";

// Configure your endpoints
export const HTTP_HOST = "http://localhost:3000";
export const WS_HOST = "ws://localhost:8999";

// Web socket connection
// -=-=-=-=-=-=-=-=-=-=-

const webSocket = new WebSocket(WS_HOST);

webSocket.addEventListener("message", (ev: { data: string }) => {
  const { event, dir, file, files } = JSON.parse(ev.data) as {
    event: "add" | "addBatch";
    dir: string;
    file: string;
    files: { dir: string; file: string }[];
  };

  if (event === "addBatch") {
    store.dispatch(addBatch(files));
  } else {
    store.dispatch(add({ dir: dir, file: file }));
  }
});

// Routing
// -=-=-=-=-=-=-=-=-=-=-

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path=":dir" element={<Dir2 />}>
        <Route path=":file" element={<File />} />
      </Route>
      <Route path="/" element={<Index />} />
    </Route>
  )
);

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error("Could not find the root container to attach React to");
}
