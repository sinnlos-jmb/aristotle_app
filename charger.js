const express = require('express');
const app = express();
const port = 3060;

const bodyParser = require('body-parser');
const path = require("path");

const ruta_ia1 = require('./code/ia_1');
const ruta_guardar_parrafo = require('./code/add_parrafo');
const ruta_busqueda = require('./code/busqueda');

app.use(express.static('public')); // HTML, JS, CSS van en /public
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //para apis


//rutas
app.use('/ask', ruta_ia1); 
app.use('/guardar-parrafo', ruta_guardar_parrafo);
app.use(ruta_busqueda); //hay dos sub-rutas: buscar-chunks y buscar-coincidencia-exacta


// Página principal
app.get('/', (req, res) => {
  console.log("remito a index");
  res.sendFile(path.join(__dirname, 'data', 'index.html'));
});

app.get('/app_filo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home_filo.html'));
});

app.get('/buscar', (req, res) => {
  res.sendFile(path.join(__dirname , 'data', '/buscar.html'));
});



app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
