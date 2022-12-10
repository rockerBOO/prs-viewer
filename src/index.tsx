import { useEffect, useState } from "react";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import Dir from "./dir";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { HTTP_HOST } from "./main";

const getFiles = (set: React.Dispatch<React.SetStateAction<{}>>) => () => {
	return fetch(`${HTTP_HOST}/files`)
		.then((res) => res.json())
		.then((files) => set(files));
};

export type Files = {
	[key: string]: string[];
};

function Index() {
	const files = useSelector((state: RootState) => state.files);

	return (
		<section
			style={{
				display: "grid",
				width: "100%",
				maxWidth: "90vw",
				justifyContent: "center",
				gridGap: "8em 4vw",
				margin: "10vh 4vw",
			}}
		>
			{Object.keys(files).map((dir) => {
				return (
					<div
						key={dir}
						style={{
							justifyContent: "center",
							width: "90vw",
							maxWidth: "100%",
						}}
					>
						<h2 style={{ textAlign: "center" }}>
							<Link to={`/${dir}`}>{dir}</Link>
						</h2>
						<div
							style={{
								display: "grid",
								gridGap: "4vw",
								gridAutoFlow: "column",
								justifyContent: "center",
							}}
						>
							<Dir dir={dir} />
						</div>
					</div>
				);
			})}
			<Outlet />
		</section>
	);
}

export default Index;
