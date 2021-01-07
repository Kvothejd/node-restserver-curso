//
// Verificar token V.123
//

const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {
    // next: A DONDE DEBO REDIRIGIR
    
    // ¿como leer el header personalizado:? V.123
    // Usando el nombre del header que estemos enviando desde el front/postman
    let token = req.get('token'); 

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            // 401: Unauthorized
            return res.status(401).json({
                ok:false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        // decoded contiene todo el "payload" - Solo porque sabemos que viene esa info
        req.usuario = decoded.usuario;
    
        // IMPORTANTE
        // Si no llamo el NEXT no se ejecuta nada posterior al middleware para el endpoint
        next();        
    })            
};

// v.125
let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role !== "ADMIN_ROLE") {
        // 401: Unauthorized
        return res.status(401).json({
            ok:false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

    next();
};

module.exports = { 
    verificaToken ,
    verificaAdminRole
}
