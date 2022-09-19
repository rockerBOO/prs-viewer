import { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Files } from ".";

type Comp = React.FC<{ dir: string; files: string[] }>;

const Dir: Comp = ({ dir, files }) => {
  return (
    <>
      {files
        .filter((f) => {
          return /^.*\.png/.test(f);
        })
        .reverse()
        .slice(0, 5)
        .map((file) => {
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

const getFilesInDir =
  <T extends string[]>(set: React.Dispatch<React.SetStateAction<T>>) =>
  (dir: string) =>
  () => {
    return fetch("http://localhost:3000/dir/" + dir)
      .then((res) => res.json())
      .then((files) => set(files));
  };

export const Dir2 = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [currentFile, setCurrentFile] = useState<string | undefined>(undefined);
  let { dir } = useParams();

  useEffect(() => {
    if (!dir) {
      return;
    }
    getFilesInDir(setFiles)(dir)();
    setInterval(getFilesInDir(setFiles)(dir), 5000);
  }, []);

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

  return (
    <>
      <Outlet />
			<div className="blocks">
        {files
          .filter((f) => {
            return /^.*\.png/.test(f);
          })
          .reverse()
          .map((file) => {
            return (
              <div style={{ display: "grid", justifyItems: "center" }}>
                <Link
                  to={`/dir/${dir}/${file.replace(".png", "")}`}
                  key={file}
                  onClick={(e) => {
                    setCurrentFile(e.target.href);
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

const getFile = (dir) => (file) => (setSettings) => {
  return fetch(`http://localhost:3000/settings/${dir}/${file}.json`)
    .then((resp) => resp.json())
    .then((json) => setSettings(json));
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

    const handlerClick = (e) => {
      console.log(e.target);
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
    getFile(dir)(file)(setSettings);
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
