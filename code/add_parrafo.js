const mariadb = require('mariadb');
const express = require('express');
const router = express.Router();

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'manu',
  password: '1234',
  database: 'Aristoteles',
  connectionLimit: 1
});

router.post("/", async (req, res) => {
  try {  
    const parrafo = req.body.parrafo;
    const arbor= req.body.arbor;
    const nro_p=req.body.nro_p;
    const conn = await pool.getConnection();
    await conn.query("INSERT INTO parrafos (texto, categorias) VALUES ('"+parrafo+"', '"+JSON.stringify(arbor)+"')");
    
    conn.release();
    res.json({ success: true , msg:"todo bien!"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno al guardar.' });
    }
  finally { if (conn)  await conn.release(); }
});


module.exports = router;