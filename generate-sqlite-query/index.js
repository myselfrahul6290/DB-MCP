import express from "express";
import { getSQLFromLLM } from "./utils/llm.js";
import { runQuery } from "./utils/db.js";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).send({ error: "Missing 'message' in request body", flag: 0 });
  }

  const llm_res = await getSQLFromLLM(message);
  if (!llm_res.status) {
    return res.send({ res: llm_res.message, flag: 0 });
  }

  const sql = llm_res.message;

  try {
    const resp = await runQuery(sql);
    res.send({ sql: sql, res: resp, flag: 1 });
  } catch (error) {
    console.error("Error executing query:", error.message);
    res.status(400).send({ error: error.message, sql: sql, flag: 0 });
  }
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});