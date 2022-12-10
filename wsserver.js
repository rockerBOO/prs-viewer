import chokidar from "chokidar";
import { readdirSync, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { WebSocketServer } from "ws";
import { env } from "node:process";

const LISTENING_PORT = env.PRS_VIEWER_WSSERVE_PORT ?? 8999;
const PRS_OUT = env.PRS_VIEWER_OUT ?? "/mnt/900/builds/prs/out";

const isDirectory = (path) => {
  const stats = statSync(path);

  return stats.isDirectory();
};

const wss = new WebSocketServer({ port: LISTENING_PORT });

async function getAllFiles() {
  const dirs = await readdir(PRS_OUT);

  console.log(`collections: ${dirs.length}`);

  return dirs
    .map((dir) => {
      try {
        const try_dir = `${PRS_OUT}/${dir}`;
        const isDir = isDirectory(try_dir);
        if (!isDir) {
          return undefined;
        }
        const files = readdirSync(try_dir);

        console.log(`${dir}: ${files.length}`);
        return files.map((file) => ({ dir, file }));
      } catch (err) {
        console.error(err);
        return undefined;
      }
    })
    .filter((a) => a)
    .reduce(async (acc, dir) => {
      return [...acc, ...dir];
    }, []);
}

wss.on("connection", async (ws) => {
  const files = await getAllFiles();
  ws.send(JSON.stringify({ event: "addBatch", files: files }));

  chokidar
    .watch(PRS_OUT, {
      ignored: "*.json",
      ignoreInitial: true,
      awaitWriteFinish: { stabilityThreshold: 1000 },
    })
    .on("all", (event, path) => {
      // Only handle png files, drop the json
      if (path.substring(path.length - 3) !== "png") {
        return;
      }

      const [, dir, file] = path.replace(PRS_OUT, "").split("/");

      ws.send(JSON.stringify({ event, dir, file }), (err) => {
        if (err) {
          console.log("error", err);
        }
      });
    });
});

console.log(`Watching for changes to ${PRS_OUT}`);
console.log(`Listening on ws://localhost:${LISTENING_PORT}`);
