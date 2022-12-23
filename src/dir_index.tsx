import { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet, useParams } from "react-router-dom";
import { Dir } from "./files";
import { getFilePath, GetFilePath } from "./lib";
import { HTTP_HOST } from "./main";
import { RootState } from "./store";

const findFileIter = (file: string): number | undefined => {
	const match = file.match(/-(\d+)/);

	if (match) {
		return parseInt(match[1]);
	}

	return undefined;
};

type State = { [key: string]: string };
type Action = { type: "add"; payload: [string, string] };

const DirIndex = ({ dir, files }: { dir?: string; files: Dir }) => {
	const [filePath, setFilePath] = useState<GetFilePath>(() => getFilePath);

	const [filesSettings, dispatch] = useReducer<
		(state: State, action: Action) => State,
		State
	>(
		(state, action) => {
			switch (action.type) {
				case "add":
					return { ...state, ...{ [action.payload[0]]: action.payload[1] } };
				default:
					return state;
			}
		},
		{},
		(_state) => ({}),
	);
	const settings = useSelector((state: RootState) => {
		return state.settings;
	});

	return (
		<section
			className="blocks"
			style={{
				gridTemplateColumns: `repeat(auto-fit, minmax(${
					settings["gallery_size"] ?? 256
				}px, 1fr))`,
				minHeight: "75vh",
			}}
		>
			{files.map((file) => {
				return (
					<div key={`${dir}-${file}`} style={{ width: "100%" }}>
						<Link
							to={`/${dir}/${file.replace(".png", "").replace(`${dir}-`, "")}`}
						>
							<img
								src={filePath({ dir, file: file.replace(".png", "") })}
								data-json={`${HTTP_HOST}/${dir}/${file}.json`}
								style={{
									pointerEvents: "none",
									maxWidth: "100%",
								}}
								loading="lazy"
								alt={file}
							/>
						</Link>
					</div>
				);
			})}
		</section>
	);
};

export default DirIndex;

