const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

//Loading routes
//const autentication = require('./routes/routes_autentication');

//0.- INITILIZATIONS
const app = express();
require('./database');
require('dotenv').config()
// 1.- SETTINGS
app.set('port', process.env.PORT || 3003);
// 2.- MIDLEWARES
app.use(cors({withCredentials: true, origin: process.env.PORT_FRONTEND}));
// CORS para permitir peticiones del cliente
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.PORT_FRONTEND);
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Request-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));
//3.- ROUTES
//app.use('/api',autentication);
const router = require('./routes/routes_autentication');
router(app);

module.exports = app;