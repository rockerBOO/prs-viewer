import { HTTP_HOST } from "./main";
import type { Dir as FileDir } from "./files";

type Comp = React.FC<{
	/*
	 * Directory name
	 **/
	dir: string;

	/**
	 * Limit the number of items shown
	 */
	limit?: number;

	/**
	 * List of file paths
	 */
	files: FileDir;
}>;

// README: no state, pass in params
const Dir: Comp = ({ dir, limit, files }) => {
	let images = files
		.filter((f) => {
			return /^.*\.png/.test(f);
		})
		.reverse();

	// Handle limiting results
	if (limit !== undefined) {
		images = images.slice(0, limit);
	}

	if (images.length === 0) {
		return <div>Empty</div>;
	}

	return (
		<>
			{images.map((file) => {
				return (
					<img
						key={`dir-${dir}-${file}-index`}
						src={`${HTTP_HOST}/${dir}/${file}`}
						width="100%"
						style={{ animation: "1s fadein" }}
						alt={file}
					/>
				);
			})}
		</>
	);
};

export default Dir;

