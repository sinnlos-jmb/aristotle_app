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


const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return magA && magB ? dot / (magA * magB) : 0;
};

const flattenTreeToVector = (tree, path = [], vec = {}, schema = []) => {
  for (const key in tree) {
    const val = tree[key];
    const ruta = [...path, key].join('.');
    if (typeof val === 'number') {
      vec[ruta] = val;
      if (!schema.includes(ruta)) schema.push(ruta);
    } else if (typeof val === 'object' && val !== null) {
      flattenTreeToVector(val, [...path, key], vec, schema);
    }
  }
  return vec;
};

app.get('/buscar', (req, res) => {
  res.sendFile(__dirname + '/code/buscar.html');
});


app.post('/buscar-chunks', async (req, res) => {

  try {
    const categoriasSeleccionadas = req.body.categorias;

    if (!Array.isArray(categoriasSeleccionadas)) {
      return res.status(400).json({ error: 'categorias debe ser un array' });
    }

    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT texto, categorias FROM parrafos');
    conn.release();


    const schema = [];
    const vectores = rows.map(row => {
      //const plano = flattenTreeToVector(JSON.parse(row.categorias), [], {}, schema);
      const plano = flattenTreeToVector(row.categorias, [], {}, schema);

      return {
        texto: row.texto,
        vector: plano
      };
    });

    const vectorConsulta = {};
    schema.forEach(ruta => {
      vectorConsulta[ruta] = categoriasSeleccionadas.includes(ruta) ? 1 : 0;
    });

    const consultaArray = schema.map(k => vectorConsulta[k] || 0);

    const resultados = vectores.map(v => {
      const vArray = schema.map(k => v.vector[k] || 0);
      return {
        texto: v.texto,
        similitud: cosineSimilarity(consultaArray, vArray)
      };
    });

    resultados.sort((a, b) => b.similitud - a.similitud);
    res.json(resultados.slice(0, 10));
  } catch (error) {
    console.error("Error en /buscar-chunks:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


app.post('/buscar-coincidencia-exacta', async (req, res) => {
  const categorias = req.body.categorias;

  if (!Array.isArray(categorias) || categorias.length === 0) {
    return res.status(400).json({ error: 'Categorías inválidas.' });
  }

  try {
    const conn = await pool.getConnection();

    // Construye condiciones tipo: JSON_UNQUOTE(JSON_EXTRACT(categorias, '$.bien.phusis.peso')) > 0
    const condiciones = categorias.map(cat => {
      return `CAST(JSON_UNQUOTE(JSON_EXTRACT(categorias, ?)) AS DECIMAL) > 0`;
    });

    const sql = `SELECT texto, categorias FROM parrafos WHERE ${condiciones.join(' AND ')}`;
    const valores = categorias.map(cat => '$.' + cat);
    
    const resultados = await conn.query(sql, valores);
    console.log("query exacto: "+sql+"\nvalores: "+valores);

    conn.release();

    res.json(resultados);
  } catch (err) {
    console.error('Error en /buscar-coincidencia-exacta:', err);
    res.status(500).json({ error: 'Error al buscar en base de datos.' });
  }
});



app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
