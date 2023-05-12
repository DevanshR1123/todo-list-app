import cors from "cors";
import express from "express";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const app = express();
const port = 5000;

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "db.json");

const adapter = new JSONFile(file);
const db = new Low(adapter, { id: 0, items: [] });
await db.read();

const updDb = async () => {
  await db.write();
};

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/getAllTodoCards", (req, res) => {
  const { items } = db.data;
  res.status(200).send(items.sort((a, b) => new Date(b.date) - new Date(a.date)));
});

app.post(
  "/addtodoCard",
  (req, res, next) => {
    const { taskName, comment, date, checked } = req.body;
    const { items } = db.data;
    if (!(taskName && comment && date)) return res.sendStatus(400);
    const id = db.data["id"]++;
    // const dbDate = new Date(date);
    items.push({ taskName, comment, id, date, checked });
    res.status(200).send(items.find(item => item["id"] === id));
    next();
  },
  updDb
);

app.get(
  "/updatetodoCard/:id",
  (req, res, next) => {
    const { id } = req.params;
    const { items } = db.data;
    const i = items.findIndex(item => item["id"] === parseInt(id));
    const checked = db.data["items"][i]["checked"];
    db.data["items"][i]["checked"] = !checked;
    res.status(200).send(db.data["items"][i]);
    next();
  },
  updDb
);

app.delete(
  "/removetodoCard/:id",
  (req, res, next) => {
    const { id } = req.params;
    const { items } = db.data;
    if (items.filter(item => item["id"] === parseInt(id)).length === 0) return res.sendStatus(400);
    db.data["items"] = items.filter(item => item["id"] !== parseInt(id));
    res.sendStatus(200);
    next();
  },
  updDb
);

app.listen(port, () => {
  console.log(`Todo app listening at http://localhost:${port}`);
});
