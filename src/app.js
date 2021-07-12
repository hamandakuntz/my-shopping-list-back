import express from "express";
import cors from "cors";

import connection from "./database.js";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/items", async (req, res) => {
    try {
        cleanHTML(req.body);
        const validBody = schemeInsertItem.validate(req.body);
        if (validBody.error) return res.sendStatus(400);
        const { item } = req.body;       
        await connection.query(`
        INSERT INTO items (item)
        VALUES $1`, [item]);
        res.sendStatus(201);
    } catch (e) {
        res.sendStatus(500);
    }
});

function cleanHTML(objectHTML) {
    for (const keys in objectHTML) {
      if (typeof objectHTML[keys] === "string") {
        objectHTML[keys] = stripHtml(objectHTML[keys]).result.trim();
      }
    }
}

const schemeInsertItem = joi.object({
    item: joi.string().required()
});



export default app;
