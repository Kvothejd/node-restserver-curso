


// ================
// Puerto - La de Heroku cuando este despleago va a existir la primer variable, 
// de lo contrario al correr en local definimos 3000
// ================
process.env.PORT = process.env.PORT || 3000; 

// ================
// Entorno
// ================

process.env.NODE_ENV = process.env.NODE_ENV  || 'dev';

// =====================
// Vencimiento del Token
// =====================
// 60 seg * 60 min * 24 h * 30 d
process.env.CADUCIDAD_TOKEN = 60*60*24*30;

// =====================
// SEED de autenticacion
// =====================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

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


// Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || "68261053759-j5rjbpvhs34dve3lifeb5n4b99tm2jbd.apps.googleusercontent.com";