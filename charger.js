const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');
const path = require('path');

const app = express();
const port = 3060;

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'manu',
  password: '1234',
  database: 'Aristoteles',
  connectionLimit: 1
});

app.use(express.static('public')); // HTML, JS, CSS van en /public
app.use(express.static('data')); // HTML, JS, CSS van en /public
app.use(bodyParser.json());
app.use(express.json()); // muy importante

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'code', 'index.html'));
});

// Guardar todos los párrafos
app.post('/guardar-batch', async (req, res) => {
  const parrafos = req.body;
  try {
    const conn = await pool.getConnection();
    for (const item of parrafos) {
      await conn.query(
        'INSERT INTO parrafos (texto, categorias) VALUES (?, ?)',
        [item.parrafo, JSON.stringify(item.arbol_json)]
      );
    }
    conn.release();
    res.send('Guardado exitoso.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al guardar.');
  }
});

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
