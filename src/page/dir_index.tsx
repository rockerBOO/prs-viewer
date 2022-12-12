import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import DirIndex from "../dir_index";
import { RootState } from "../store";

const getLatest = (results: string[]): string[] =>
	results
		.filter((f) => {
			return /^.*\.png/.test(f);
		})
		.reverse();

const DirPage = () => {
	let { dir } = useParams();
	const { filesInDir, files, dirs } = useSelector((state: RootState) => ({
		filesInDir: dir ? state.files[dir] ?? [] : [],
		files: state.files,
		dirs: Object.keys(state.files),
		settings: state.settings ?? {},
	}));

	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
	}, [dir]);

	const images = getLatest(filesInDir as string[]);

	if (images.length === 0) {
		return <div>Empty</div>;
	}

	return (
		<>
			<Outlet />
			<h1>{dir}</h1>
			<DirIndex dir={dir} files={images} />
		</>
	);
};

export const arrowControls = () => {
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
};

export default DirPage;

