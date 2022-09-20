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
import { Dir2, File } from "./dir";
import App from "./app";
import { Provider } from "react-redux";
import "./main.css";
import { add, addBatch} from "./files";

const webSocket = new WebSocket("ws://localhost:8999");

webSocket.addEventListener("message", (ev: { data: string }) => {
  const { event, dir, file, files } = JSON.parse(ev.data) as {
    event: "add" | "addBatch";
    dir: string;
    file: string;
		files: { dir: string, file: string }[]
  };

  if (event === "addBatch") {
    store.dispatch(addBatch(files));
  } else {
    store.dispatch(add({ dir: dir, file: file }));
  }
});

// store.subscribe((state) => {
// 	console.log(store.getState())
// })

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

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>
  );
}

