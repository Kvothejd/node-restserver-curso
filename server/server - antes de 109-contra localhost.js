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

app.use(require('./routes/usuario'));

 
// Old - As in the course - Below is the new version from the mongoose official site
mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {
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

