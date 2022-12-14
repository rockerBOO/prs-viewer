#!/usr/bin/env node

import chokidar from "chokidar";
import { readdir, stat } from "node:fs/promises";
import { WebSocketServer } from "ws";
import { env, exit } from "node:process";

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
// const args = yargs(hideBin(process.argv))
//   .describe("port", "port to listen on")
//   .describe("out", "directory with the output from the diffusion")
//   .alias("h", "help")
//   .parse();
// const argv = args.argv;

const argv = yargs(hideBin(process.argv)).argv;

console.log(argv);

const LISTENING_PORT = argv?.port ?? env.PRS_VIEWER_WSSERVE_PORT ?? 8999;
const PRS_OUT = argv?.out ?? env.PRS_VIEWER_OUT ?? "/mnt/900/builds/prs/out";

const isDirectory = async (path) => {
  const stats = await stat(path);

  return stats.isDirectory();
};

try {
  const wss = new WebSocketServer({ port: LISTENING_PORT });

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
} catch (e) {
  console.error(e);
  exit(1);
}

async function getAllFiles() {
  return readdir(PRS_OUT).then(async (dirs) => {
    return Promise.all(
      dirs.map(async (dir) => {
        const try_dir = `${PRS_OUT}/${dir}`;

        const isDir = await isDirectory(try_dir);

        if (!isDir) {
          return undefined;
        }

        console.log(`readdir ${try_dir}`);
        const files = await readdir(try_dir);

        // console.log(`file ${files}`);
        return files
          .filter((file) => /.*\.png$/.test(file))
          .map((file) => ({ dir, file }));
      })
    ).then((files) => {
      return files
        .filter((a) => a)
        .reduce((acc, dir) => {
          if (!("length" in acc)) {
            console.log("acc", acc);
            exit(1, "Could not load acc");
          }
          return [...acc, ...dir];
        }, []);
    });
  });
}
