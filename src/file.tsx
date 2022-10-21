import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HTTP_HOST } from "./main";

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
      if (e.key === "Escape") {
        navigate(`/${dir}`);
      }
    };

    const handlerClick = (e: MouseEvent) => {
      if (e.target === fileModal) {
        navigate(`/${dir}`);
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
    fetch(`${HTTP_HOST}/settings/${dir}/${dir}-${file}.json`)
      .then((resp) => resp.json())
      .then((settings) => {
        setSettings(settings);
      });
  }, [file]);

  return (
    <div
      className="modal"
      id="file-modal"
      style={{
        transition: "all 256ms ease-in-all",
        transform: "scale(1)",

        animation: "520ms fadein",
      }}
    >
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
            src={`${HTTP_HOST}/${dir}/${dir}-${file}.png`}
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
          <span>
            {settings?.steps ?? "-"} {settings?.scale} {settings?.variance}
            {settings?.seed} {settings?.init_strength?.toPrecision(3)}
          </span>
        </div>
        <div
          style={{
            pointerEvents: "all",
            padding: ".3em",

            opacity: 0.5,
          }}
        >
          <span>
            {settings?.width ?? "-"} {settings?.height} {settings?.n_iter}
            {settings?.method}
          </span>
        </div>
      </div>
    </div>
  );
};
