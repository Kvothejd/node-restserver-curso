require('./config/config')

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

 
app.get('/usuario', function (req, res) {
  res.json('get Usuario');
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


// Tomamos del objeto global la configuración del puerto
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});

// app.listen(3000, () => {
//     console.log('Escuchando puerto: ', 3000);
// });