import { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import type { RootState } from "./store";
import { useSelector } from "react-redux";
import { HTTP_HOST } from "./main";

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
					<img key={file} src={`${HTTP_HOST}/${dir}/${file}`} width="100" style={{ animation: "1s fadein" }} />
        );
      })}
    </>
  );
};

const findFileIter = (file: string): number | undefined => {
  const match = file.match(/-(\d+)/);

  if (match) {
    return parseInt(match[1]);
  }

  return undefined;
};

//
// const findFileName = (file: string): string | null => {
//   const match = file.match(/.*-\d+/);
//
//   if (match) {
//     return match[0];
//   }
//
//   return null;
// };

export const Dir2 = () => {
  let { dir } = useParams();
  const { filesInDir, files, dirs } = useSelector((state: RootState) => ({
    filesInDir: dir ? state.files[dir] ?? [] : [],
    files: state.files,
    dirs: Object.keys(state.files),
    settings: state.settings ?? {},
  }));
  const [iter, setIter] = useState<number | undefined>(undefined);
  const settings = useSelector((state: RootState) => {
    return state.settings;
  });
  // const navigate = useNavigate();

  // grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        // const x = files.find((file) => {
        //   const found = findFileIter(file);
        //
        //   if (found && iter) {
        //     return iter - 1 === found;
        //   }
        //
        //   return false;
        // });
        //
        // if (x) {
        //   setIter(findFileIter(x));
        //   const file = findFileName(x);
        //   console.log("prev", file);
        //   navigate(`/dir/${dir}/${file}`);
        // }
      }

      if (e.key === "ArrowRight") {
        // const x = files.find((file) => {
        //   const found = findFileIter(file);
        //
        //   if (found && iter) {
        //     return iter + 1 === found;
        //   }
        //
        //   return false;
        // });
        //
        // console.log("next", x);
        //
        // if (x) {
        //   setIter(findFileIter(x));
        //   const file = findFileName(x);
        //   console.log("next", file);
        //   navigate(`/dir/${dir}/${file}`);
        // }
      }
    };

    window.addEventListener("keyup", handler);

    return function cleanup() {
      window.removeEventListener("keyup", handler);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [dir, iter]);

  const getLatest = (results: string[]): string[] =>
    results
      .filter((f) => {
        return /^.*\.png/.test(f);
      })
      .reverse();

  const images = getLatest(filesInDir as string[]);

  if (images.length === 0) {
    return <div>Empty</div>;
  }

  return (
    <>
      <Outlet />
      <h1>{dir}</h1>
      <section
        className="blocks"
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(${
            settings["gallery_size"] ?? 256
          }px, 1fr))`,
          minHeight: "75vh",
        }}
      >
        {images.map((file) => {
          return (
            <div key={file} style={{ width: "100%" }}>
              <Link
                to={`/${dir}/${file
                  .replace(".png", "")
                  .replace(`${dir}-`, "")}`}
                onClick={(e) => {
                  setIter(findFileIter((e.target as HTMLAnchorElement)?.href));
                }}
              >
                <img
                  src={`${HTTP_HOST}/${dir}/${file}`}
                  data-json={`${HTTP_HOST}/${dir}/${file.replace(
                    ".png",
                    ".json"
                  )}`}
                  style={{
                    pointerEvents: "none",
                    maxWidth: `100%`,
                  }}
                  loading="lazy"
                />
              </Link>
            </div>
          );
        })}
      </section>
      <footer>
        <nav>
          <ul>
            {dirs.map((dir) => {
              return (
                <li key={dir}>
                  <div className="blocks">
                    <div>
                      <Link to={`/${dir}`}>{dir}</Link>
                    </div>
                    {getLatest(files[dir])
                      .slice(0, 1)
                      .map((imageFile) => {
                        return (
                          <div key={imageFile}>
                            <Link to={`/${dir}`} key={`${dir}/${imageFile}`}>
                              <img
                                src={`${HTTP_HOST}/${dir}/${imageFile}`}
                                width="25"
                                loading="lazy"
                                style={{ width: 100 }}
                              />
                            </Link>
                          </div>
                        );
                      })}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </footer>
    </>
  );
};

export default Dir;
