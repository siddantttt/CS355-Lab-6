const express = require('express');
const nedb = require('nedb-promises');
const app = express();
const db = nedb.create('data.jsonl');

app.use(express.static('public'));
app.use(express.json());

// RESTful: POST /documents – insert new document
app.post('/documents', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing text field.' });

  const doc = await db.insert({ text });
  res.status(201).json(doc);
});

// RESTful: GET /documents?query=... – search documents
app.get('/documents', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.json([]);

  const regex = new RegExp(query, 'i');
  const docs = await db.find({ text: regex });
  res.json(docs);
});

app.listen(3000, () => console.log('📦 RESTful server running at http://localhost:3000'));
