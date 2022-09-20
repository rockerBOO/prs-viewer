import { useEffect, useState } from "react";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import Dir from "./dir";
import { useSelector } from "react-redux";
import { RootState } from "./store";

const getFiles = (set: React.Dispatch<React.SetStateAction<{}>>) => () => {
  return fetch("http://localhost:3000/files")
    .then((res) => res.json())
    .then((files) => set(files));
};

export type Files = {
  [key: string]: string[];
};

function Index() {
  const files = useSelector((state: RootState) => state.files);

  return (
    <div style={{ display: "grid", margin: "4em" }}>
      {Object.keys(files).map((dir) => {
        return (
          <div key={dir}>
            <h2>
              <Link to={`/dir/${dir}`}>{dir}</Link>
            </h2>
            <div
              style={{
                display: "grid",
                gridGap: ".3em",
                gridAutoFlow: "column",
              }}
            >
              <Dir dir={dir} />
            </div>
          </div>
        );
      })}
      <Outlet />
    </div>
  );
}

export default Index;
