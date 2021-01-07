require('./config/config')

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

// Middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


// Configuracion global de rutas
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

