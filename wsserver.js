import chokidar from "chokidar";
import { readdirSync } from "fs";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8999 });

const prsOut = "/mnt/900/builds/prs/out";

const getAllFiles = () => {
  const dirs = readdirSync(prsOut);

  return dirs
    .map((dir) => {
      const files = readdirSync(`${prsOut}/${dir}`);
      return files.map((file) => ({ dir, file }));
    })
    .reduce((acc, dir) => {
      return [...acc, ...dir];
    });
};

wss.on("connection", (ws) => {
  const files = getAllFiles();
  ws.send(JSON.stringify({ event: "addBatch", files: files }));

  chokidar.watch(prsOut, { ignoreInitial: true }).on("all", (event, path) => {
    const [, dir, file] = path.replace(prsOut, "").split("/");

    ws.send(JSON.stringify({ event, dir, file }), (err) => {
      console.log("error", err);
    });
  });
});

console.log('Listening on ws://localhost:8999')
