const mongoose = require('mongoose');
require('dotenv').config()

const URI = process.env.MONGO_URI;

mongoose.connect(URI,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

//Conociendo si se realizó la conexión
const conexion = mongoose.connection;

conexion.once('open', () => {
    console.log('DB Login is connected');
});