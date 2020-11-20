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

 
app.get('/usuario', function (req, res) {
  res.json('get Usuario LOCAL');
})
 
// crear/Post
app.post('/usuario', function (req, res) {
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'            
        });
    } else {
        res.json({
            persona: body
        });
    }

    
    //res.json('post Usuario');
  })

// actualizar/Put
app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;

    res.json({
        id
    });
  })

// borrar
app.delete('/usuario', function (req, res) {
    res.json('delete Usuario');
  })


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

// app.listen(3000, () => {
//     console.log('Escuchando puerto: ', 3000);
// });

