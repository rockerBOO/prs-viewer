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
