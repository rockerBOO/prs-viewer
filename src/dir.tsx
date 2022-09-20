import { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";
import type { RootState } from "./store";
import { useSelector } from "react-redux";

type Comp = React.FC<{ dir: string }>;

const Dir: Comp = ({ dir }) => {
  const files = useSelector((state: RootState) => state.files[dir]);
  const images = files
    .filter((f) => {
      return /^.*\.png/.test(f);
    })
    .reverse()
    .slice(0, 5);

  if (images.length === 0) {
    return <div>Empty</div>;
  }

  return (
    <>
      {images.map((file) => {
        return (
          <img
            key={file}
            src={`http://localhost:3000/${dir}/${file}`}
            width="100"
          />
        );
      })}
    </>
  );
};

export const Dir2 = () => {
  let { dir } = useParams();
  const files = useSelector((state: RootState) =>
    dir ? state.files[dir] ?? [] : []
  );
  // const [files, setFiles] = useState<string[]>([]);
  const [currentFile, setCurrentFile] = useState<string | undefined>(undefined);

  useEffect(() => {
    // next and previous

    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentFile("armas/2");
      }

      if (e.key === "ArrowRight") {
        setCurrentFile("armas/4");
      }
    };

    window.addEventListener("keyup", handler);

    return function cleanup() {
      window.removeEventListener("keyup", handler);
    };
  }, []);

  const images = files
    .filter((f) => {
      return /^.*\.png/.test(f);
    })
    .reverse();

  if (images.length === 0) {
    return <div>Empty</div>;
  }

  return (
    <>
      <Outlet />
      <div className="blocks">
        {images.map((file) => {
          return (
            <div key={file} style={{ display: "grid", justifyItems: "center" }}>
              <Link
                to={`/dir/${dir}/${file.replace(".png", "")}`}
                onClick={(e) => {
                  setCurrentFile((e.target as HTMLAnchorElement)?.href);
                }}
              >
                <img
                  src={`http://localhost:3000/${dir}/${file}`}
                  width="256"
                  data-json={`http://localhost:3000/${dir}/${file.replace(
                    ".png",
                    ".json"
                  )}`}
                  style={{ pointerEvents: "none" }}
                  loading="lazy"
                />
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
};

type Settings = {
  prompt?: string;
  steps?: number;
  scale?: number;
  variance?: number;
  seed?: number;
  init_strength?: number;
  width?: number;
  height?: number;
  n_iter?: number;
  method?: string;
};

export const File = () => {
  const { dir, file } = useParams();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    const fileModal = document.getElementById("file-modal");
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") {
        return;
      }

      navigate(`/dir/${dir}`);
    };

    const handlerClick = (e: MouseEvent) => {
      if (e.target === fileModal) {
        navigate(`/dir/${dir}`);
      }
    };

    document.body.addEventListener("keyup", handler);
    fileModal?.addEventListener("click", handlerClick);

    return function cleanup() {
      document.body.removeEventListener("keyup", handler);
      fileModal?.removeEventListener("click", handlerClick);
    };
  }, []);

  useEffect(() => {
    fetch(`http://localhost:3000/settings/${dir}/${file}.json`)
      .then((resp) => resp.json())
      .then((settings) => {
        setSettings(settings);
      });
  }, [file]);

  return (
    <div className="modal" id="file-modal">
      <div
        style={{
          display: "grid",
          justifyItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            maxHeight: "80vh",
            maxWidth: "80vw",
            display: "grid",
            justifyItems: "center",
          }}
        >
          <img
            src={`http://localhost:3000/${dir}/${file}.png`}
            style={{
              maxHeight: "100%",
              maxWidth: "100%",

              pointerEvents: "all",
            }}
          />
        </div>
        <div
          style={{
            pointerEvents: "all",
            padding: "1em",
            maxWidth: "75vw",
            textAlign: "center",
          }}
        >
          {settings?.prompt ?? "Prompt"}
        </div>
        <div
          style={{
            pointerEvents: "all",
            padding: ".3em",
            opacity: 0.5,
          }}
        >
          {settings?.steps ?? "-"} {settings?.scale} {settings?.variance}{" "}
          {settings?.seed} {settings?.init_strength?.toPrecision(3)}
        </div>
        <div
          style={{
            pointerEvents: "all",
            padding: ".3em",

            opacity: 0.5,
          }}
        >
          {settings?.width ?? "-"} {settings?.height} {settings?.n_iter}{" "}
          {settings?.method}
        </div>
      </div>
    </div>
  );
};

export default Dir;
