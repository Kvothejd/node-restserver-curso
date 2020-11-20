


// ================
// Puerto - La de Heroku cuando este despleago va a existir la primer variable, 
// de lo contrario al correr en local definimos 3000
// ================
process.env.PORT = process.env.PORT || 3000; 

// ================
// Entorno
// ================

process.env.NODE_ENV = process.env.NODE_ENV  || 'dev';

// ================
// Base de datos
// ================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://strider:MtHUWA2F29s3w8m@cluster0.cezfp.mongodb.net/cafe';
}

process.env.URLDB = urlDB;


