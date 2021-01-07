const express = require('express');
const bcrypt = require('bcrypt');

// V.122
const jwt = require('jsonwebtoken');


// nomenclatura MAYUS
const Usuario = require('../models/usuario');

const app = express();



app.post('/login', (req, res) => {

    // Para luego leer el correo y el password
    let body = req.body;

    // Verifico si hay un usuario con ese correo
    Usuario.findOne({ email : body.email }, (err, usuarioDB) => {
        if (err) {
            // Error interno del servidor
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Acá en realidad verifico si el usuario existe. Aunque nunca blanquearíamos al usuario final 
        // si lo que está mal es el usuario o la contraseña
        if (!usuarioDB ) {
            // Error de negocio
            return res.status(400).json({
                ok: false,
                err: {
                    message: "(Usuario) o contraseña incorrectos"
                }
            });
        }

        // porque el password está encriptado (V.121)
        // habíamos hecho hashSync al grabar el usuario
        // entonces no se puede desencriptar, pero si hacer el hash del pass de login contra el hash del pass del usuario y compararlos
        if (!bcrypt.compareSync( body.password, usuarioDB.password )) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o (contraseña) incorrectos"
                }
            });
        }

        // v.122 Genero el token a incluir en la respuesta: 
        //      Payload: {usuario}
        //      Secret (seed) 
        //      Expiration        
        // expira en 30 días== 60s * 60m * 24h * 30d        
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        // Si llega acá la contraseña es la correcta, así que retorna OK, datos del usuario y Token
        res.json({
            ok:true,
            usuario: usuarioDB,
            token
        });    
    })

})
  
module.exports = app;