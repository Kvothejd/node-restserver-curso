const express = require('express');
const bcrypt = require('bcrypt');

// V.122
const jwt = require('jsonwebtoken');

// V.133
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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


// v.133
// Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    // esto se imprime en la consola de Nodemon
    // console.log(payload.name);
    // console.log(payload.email);
    // console.log(payload.picture);
   
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
        
    }
  }
  


// v.133
// app.post('/google', (req, res) => {
//     let token = req.body.idtoken;
    
//     verify(token);    

//     res.json({
//         token
//     });        

// });

// v.134 convierto el POST en async para poder usar el AWAIT
app.post('/google', async (req, res) => {
    let token = req.body.idtoken;

    // v.133
    // verify(token);
    
    // v.134
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            })
        })

    Usuario.findOne( { email: googleUser.email}, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            });            
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok:false,
                    err: {
                        message: 'Debe de usar su autenticación normal (no de google)'
                    }
                });            
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.status(200).json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                });            
            }
        } else {
            // Si el usuario no existe en nuestra BD
            // debo crearlo

            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true

            // Solo para cumplir con la validación de la BD
            usuario.password = ':)';

            usuario.save( (err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok:false,
                        err
                    });            
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.status(200).json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                });            

            })
        }

    });

    
});
  
module.exports = app;