require('./config/config')

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
// V1.132 ^^

const app = express();
const bodyParser = require('body-parser');

// Middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// habilitar la carperta public
console.log(path.resolve(__dirname, '../public'));
app.use(express.static(path.resolve(__dirname, '../public')));

// Configuracion global de rutas para no tener que cargarlas acá como andes (lo dejé comentado) (V.120)
app.use(require('./routes/index')); 
// app.use(require('./routes/usuario'));
// app.use(require('./routes/login'));

 
// Old - As in the course - Below is the new version from the mongoose official site
mongoose.connect(process.env.URLDB, 
  { userNewUrlParser: true, useCreateIndex: true },
  (err, res) => {

  if (err) throw err;

  console.log('Base de datos ONLINE');
});


// New
// await mongoose.connect('mongodb://localhost:27017/cafe', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true
// });

// Tomamos del objeto global la configuración del puerto
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});

