import { FileOptions } from "./lib";
import { HTTP_HOST } from "./main";

export function getFilePath({ dir = "", file = "" }: FileOptions) {
  return `${HTTP_HOST}/${dir}/${dir}-${file}.png`;
}

export function getSettingsPath({ dir, file }: FileOptions) {
  return `${HTTP_HOST}/settings/${dir}/${file}.json`;
}
