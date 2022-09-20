import chokidar from "chokidar";

import fs from "fs";
import { WebSocketServer } from "ws";

// initialize the WebSocket server instance
const wss = new WebSocketServer({ port: 8999 });

const prsOut = "/mnt/900/builds/prs/out";

// const getAllFiles = function (dirPath, arrayOfFiles) {
//   const path = fs.readdirSync(dirPath);
//
//   arrayOfFiles = arrayOfFiles || [];
//
//   const [, dir, file] = path.replace(prsOut, "").split("/");
//
//   files.forEach(function (file) {
//     if (fs.statSync(dirPath + "/" + file).isDirectory()) {
//       arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
//     } else {
//       arrayOfFiles.push({ dir: dir, file });
//     }
//   });
//
//   return arrayOfFiles;
// };

const getAllFiles = () => {
  const dirs = fs.readdirSync(prsOut);

  return dirs
    .map((dir) => {
      const files = fs.readdirSync(`${prsOut}/${dir}`);
      return files.map((file) => ({ dir, file }));
    })
    .reduce((acc, dir) => {
			return [ ...acc, ...dir ];
    });
};

wss.on("connection", (ws) => {
	const files = getAllFiles()
  ws.send(JSON.stringify({ event: "addBatch", files: files }));
  chokidar.watch(prsOut, { ignoreInitial: true }).on("all", (event, path) => {
    const [, dir, file] = path.replace(prsOut, "").split("/");
    console.log(event, dir, file);
    ws.send(JSON.stringify({ event, dir, file }), (err) => {
      console.log("error", err);
    });
  });
});
