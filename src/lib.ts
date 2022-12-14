import { HTTP_HOST } from "./main";

export type FileOptions = {
  /**
   * The directory the images are in
   * outputs/mycollection/0294.png
   *         ^ dir        ^--^ file, no extension
   */
  dir?: string;

  /**
   * The file minus the extension that are the image file
   * outputs/mycollection/0294.png
   *         ^ dir        ^--^ file, no extension
   */
  file?: string;
};

export type GetPath = (fileOptions: FileOptions) => string;

export function getFilePath(params: FileOptions) {
  return `${HTTP_HOST}/${params.dir}/${params.file}.png`;
}

export function getSettingsPath({ dir = "", file = "" }: FileOptions) {
  return `${HTTP_HOST}/settings/${dir}/${file}.json`;
}

export const getHTTPHost = () => {
	const params = new URLSearchParams(window.location.search);
	if (params.get("httphost")) {
		const protocol = window.location.protocol;
		return `${protocol}://${params.get("httphost")}`;
	}

	return "http://localhost:3000";
};

export const getWSHost = () => {
	const params = new URLSearchParams(window.location.search);
	if (params.has("wshost")) {
		return `ws://${params.get("wshost")}`;
	}

	return "ws://localhost:8999";
};
