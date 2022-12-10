import express from "express";
import fs from "node:fs";
import cors from "cors";
import pkg from "really-relaxed-json";
const { toJson } = pkg;
import { env } from "node:process";
import { readdir } from "node:fs/promises"

// Set to the output directory
// PRS_VIEWER_OUT=~/stablediffusion/outputs/txt2img-samples
const PRS_OUT = env.PRS_VIEWER_OUT ?? "/mnt/900/builds/prs/out";

// Set the listening port of the HTTP server for the REST API
// and image delivery
// PRS_HTTP_PORT=3000
const PRS_HTTP_PORT = env.PRS_HTTP_PORT ?? 3000;

const app = express();

app.use(cors());
app.use(
  express.static(PRS_OUT, {
    maxAge: "1h",
  })
);

app.get("/files", (_req, res) => {
  readdir(PRS_OUT).then((dirs) => {
    Promise.all(
      dirs.map(async (dir) => {
        return readdir(`${PRS_OUT}/${dir}`).then((files) => {
          return { [dir]: files };
        });
      })
    ).then((dirsOfFiles) => {
      res.json(dirsOfFiles);
    });
  });
});

app.get("/dir/:dir", (req, res) => {
  const dir = req.params["dir"];
  const files = fs.readdirSync(`${PRS_OUT}/${dir}`);

  res.json(files);
});

app.get("/settings/:dir/:file", (req, res) => {
  const dir = req.params["dir"];
  const file = req.params["file"];
  const filepath = `${PRS_OUT}/${dir}/${file}`;
  if (!fs.existsSync(filepath)) {
    console.log(`404 ${filepath}`);
    return;
  }
  const settings = fs.readFileSync(filepath);
  res.json(JSON.parse(toJson(settings.toString())));
});

app.listen(PRS_HTTP_PORT);

console.log("Listening on http://localhost:3000");
