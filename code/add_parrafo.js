const express = require('express');
const router = express.Router();

const pool = require("./consts");

router.post("/", async (req, res) => {
  try {  
    const parrafo = req.body.parrafo;
    const arbor= req.body.arbor;
    const nro_p=req.body.nro_p;
    const conn = await pool.getConnection();
    await conn.query("INSERT INTO parrafos (texto, categorias) VALUES ('"+parrafo+"', '"+JSON.stringify(arbor)+"')");
    
    res.json({ success: true , msg:"todo bien!"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno al guardar.' });
    }
  finally { if (conn)  await conn.release(); }
});


module.exports = router;