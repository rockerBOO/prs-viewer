#!/usr/bin/env node

import express from "express";
import fs from "node:fs";
import cors from "cors";
// import pkg from "really-relaxed-json";
import jsonic from "jsonic" 
import { env } from "node:process";
import { readdir, readFile } from "node:fs/promises";

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv)).argv;

// Set to the output directory
// PRS_VIEWER_OUT=~/stablediffusion/outputs/txt2img-samples
const PRS_OUT = argv.out ?? env.PRS_VIEWER_OUT ?? "/mnt/900/builds/prs/out";

// Set the listening port of the HTTP server for the REST API
// and image delivery
// PRS_HTTP_PORT=3000
const PRS_HTTP_PORT = argv.port ?? env.PRS_HTTP_PORT ?? 3000;

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
  readdir(`${PRS_OUT}/${req.params["dir"]}`).then((files) => {
    res.json(files);
  });
});

app.get("/settings/:dir/:file", (req, res) => {
  const filepath = `${PRS_OUT}/${req.params["dir"]}/${req.params["file"]}`;
  if (!fs.existsSync(filepath)) {
    console.log(`404 ${filepath}`);
    return;
  }

  readFile(filepath).then((settings) => {
    res.json(jsonic(settings.toString()));
  });
});

app.listen(PRS_HTTP_PORT);

console.log(`Listening on http://localhost:${PRS_HTTP_PORT}`);
