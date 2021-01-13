// Configuracion global de rutas (V.120)
// Para ser incluido en el server.js importando todas las rutas y centralizando todas las rutas aquí

const express = require('express');
const app = express();

app.use(require('./usuario'));
app.use(require('./login'));

module.exports = app;