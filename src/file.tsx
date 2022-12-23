import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetPath, getFilePath } from "./lib";
import {
	getFilePath as prs_getFilePath,
	getSettingsPath as prs_getSettingPath,
} from "./prs";
import { HTTP_HOST } from "./main";
import Tippy from "@tippyjs/react";

// IDEA
// For configuring location of images and directories
// Need to be able to configure the format in which
// the names are assembled. Maybe we make functions
// that can be defaulted and then people could make their own
//

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
	init_image?: string;
	checkpoint?: string;
};

export const File = () => {
	const { dir, file } = useParams();
	const navigate = useNavigate();
	const [settings, setSettings] = useState<Settings>({});
	const [filePath, setFilePath] = useState<GetPath>(() => prs_getFilePath);
	const [settingPath, setSettingPath] = useState<GetPath>(
		() => prs_getSettingPath,
	);

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

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);

		if (urlParams.has("type")) {
			if (urlParams.get("type") === "prs") {
				setFilePath(prs_getFilePath);
			}
		}
	}, []);

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
						src={filePath({ dir, file })}
						style={{
							maxHeight: "100%",
							maxWidth: "100%",

							pointerEvents: "all",
						}}
						alt={file}
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
					<Tippy content="Prompt">
						<span>{settings?.prompt ?? "Prompt"}</span>
					</Tippy>
				</div>
				<div
					style={{
						pointerEvents: "all",
						padding: ".3em",
						opacity: 0.5,
						display: "flex",
						gap: "2em",
						justifyContent: "space-around",
					}}
				>
					<>
						<Tippy content="steps">
							<span>{settings?.steps ?? "-"}</span>
						</Tippy>{" "}
						<Tippy content="scale">
							<span>{settings?.scale}</span>
						</Tippy>
						<Tippy content="variance">
							<span> {settings?.variance}</span>
						</Tippy>
						<Tippy content="seed">
							<span> {settings?.seed} </span>
						</Tippy>
						<Tippy content="init_stength">
							<span>{settings?.init_strength?.toPrecision(3)}</span>
						</Tippy>
						<Tippy content="init_image">
							<span>{settings?.init_image}</span>
						</Tippy>
					</>
				</div>
				<div
					style={{
						pointerEvents: "all",
						padding: ".3em",

						opacity: 0.5,

						display: "flex",
						gap: "2em",
						justifyContent: "space-around",
					}}
				>
					<>
						<Tippy content="width">
							<span>{settings?.width ?? "-"}</span>
						</Tippy>
						<Tippy content="height">
							<span>{settings?.height}</span>
						</Tippy>
						<Tippy content="n_iter">
							<span>{settings?.n_iter}</span>
						</Tippy>{" "}
						<Tippy content="method">
							<span>{settings?.method}</span>
						</Tippy>
						<Tippy content="checkpoint">
							<span>{settings?.checkpoint}</span>
						</Tippy>
					</>
				</div>
			</div>
		</div>
	);
};

