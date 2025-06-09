const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const client = new Client({
  user: 'sinnlos',
  host: 'localhost',
  database: 'iaristotle',
  password: '1234',
  port: 5432,
});

client.connect();

app.get('/chunks', async (req, res) => {
  const { dimension, min } = req.query;
  let query = 'SELECT id, fragmento, vector, libro, capitulo, bakker FROM chunks';
  const values = [];
  if (dimension !== undefined && min !== undefined) {
    query += " WHERE (string_to_array(trim(both '[]' from vector::text), ',')::float8[])[$1] >= $2";
    values.push(parseInt(dimension), parseFloat(min));
  }
  query += ' ORDER BY id DESC';
  console.log("query: "+query);
  const result = await client.query(query, values);
  console.log(result.rows);
  res.json(result.rows);
});

app.post('/chunks', async (req, res) => {
  const { fragmento, vector, libro, capitulo, bakker } = req.body;
  const result = await client.query(
    'INSERT INTO chunks (fragmento, vector, libro, capitulo, bakker) VALUES ($1, $2::vector, $3, $4, $5) RETURNING *',
    [fragmento, `[${vector.join(',')}]`, libro, capitulo, bakker]
  );
  res.json(result.rows[0]);
});

app.delete('/chunks/:id', async (req, res) => {
  const id = req.params.id;
  await client.query('DELETE FROM chunks WHERE id = $1', [id]);
  res.json({ success: true });
});

app.listen(3060, () => console.log('App corriendo en http://localhost:3060'));