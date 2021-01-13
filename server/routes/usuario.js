const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

// nomenclatura MAYUS
const Usuario = require('../models/usuario');

// Usamos destructuracion para obtener verificaToken
const { verificaToken , verificaAdminRole } = require('../middlewares/autenticacion');


// Original sin middleware
// app.get('/usuario', function (req, res) {
    
// Agrego el Middleware "verificaToken" V.123
// Para que se utilice cada vez que ser reciba la petición
app.get('/usuario', verificaToken,  function (req, res) {
    // res.json('get Usuario LOCAL en modulo');

    // Usando los datos del usuario que venían en el payload (ver "verificaToken")
    // return res.json({
    //     usuario: req.usuario
    // })

    // Saltar primeros 5
    // Devolver 5 registros
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    // Schema
    // ojo con el segundo parametro : NO HAY QUE SEPARAR POR COMAS
    Usuario.find({ estado: true}, 'nombre email role estado google img')
            .skip(desde)
            .limit(limite)
            .exec( (err, usuarios) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Usuario.count({estado: true }, (err, conteo) => {
                    res.json({
                        ok:true,
                        usuarios,
                        cuantos: conteo
                    });
                });
                
            })
  })

// POST: crear/insertar
app.post('/usuario', [verificaToken, verificaAdminRole], function (req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save( (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });            
        }

        // Limpiar el password para el retorno
        // usuarioDB.password = null;

        // Limpiar el password para el retorno - Mejorado
        // lo resolvemos en la configuracion del esquema

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });
        
})

// PUT: actualizar/update
app.put('/usuario/:id', [verificaToken, verificaAdminRole], function (req, res) {
    let id = req.params.id;
    
    // Solo tomo las propiedades que me interesan
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // // una opcion (no es eficiente)
    // let body = req.body;  
    // delete body.password;
    // delete body.google;

    Usuario.findByIdAndUpdate( id, body, { new: true, runValidators: true } , (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB            
        });    

    })

    // Usuario.findByIdAndUpdate( id, body,  (err, usuarioDB) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioDB            
    //     });    

    // })

    // Usuario.findById( id,  (err, usuarioDB) => {
    //     usuarioDB.save;

    // })

    // res.json({
    //     id
    // });
})

// borrado fisico
app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function (req, res) {
    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });    
})

app.delete('/usuarioBorradoLogico/:id', verificaToken, function (req, res) {
    let id = req.params.id;

    // Solo quiero cambiar el estado a False
    let cambiaEstado = {
        estado: false
    };
    
    Usuario.findByIdAndUpdate( id, cambiaEstado, { new: true } , (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado            
        });    

    })
    
})
  
module.exports = app;