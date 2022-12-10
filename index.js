import express from "express";
import fs from "node:fs";
import cors from "cors";
import pkg from "really-relaxed-json";
const { toJson } = pkg;
import { env } from "node:process";
import path from "node:path";

const prsOut = env.PRS_VIEWER_OUT ?? "/mnt/900/builds/prs/out";

const app = express();

app.use(cors());
app.use(express.static(prsOut));

app.get("/files", (_req, res) => {
  const dirs = fs.readdirSync(prsOut);

  const files = dirs
    .map((dir) => {
      const files = fs.readdirSync(`${prsOut}/${dir}`);

      return { [dir]: files };
    })
    .reduce((acc, set) => {
      return { ...acc, ...set };
    }, {});

  res.json(files);
});

app.get("/dir/:dir", (req, res) => {
  const dir = req.params["dir"];
  const files = fs.readdirSync(`${prsOut}/${dir}`);

  res.json(files);
});

app.get("/settings/:dir/:file", (req, res) => {
  const dir = req.params["dir"];
  const file = req.params["file"];
	const filepath = `${prsOut}/${dir}/${file}`;
	if (!fs.existsSync(filepath)) {
		console.log(`404 ${filepath}`)
		return;
	}
  const settings = fs.readFileSync(filepath);
  res.json(JSON.parse(toJson(settings.toString())));
});

app.listen(3000);

console.log("Listening on http://localhost:3000");
