// -----------------------------------------
// USO DE JWT PARA VALIDAR RUTAS PRIVADAS
// -----------------------------------------
const passport = require('passport');
const JwtStategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

// -----------------------------------------
// ----------   PASSPORT JWT      ----------
// -----------------------------------------
// opciones para decodificar token 
// especifica la extracción del token desde la cabecera de la solicitud
// solicita la clave para decodificar el token y verificarlo.
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret'
}
//fromAuthHeader()
// establecer la estrategia para validar el JWT
const PAuthToken = new JwtStategy(jwtOptions, function (payload, done) {
    // una vez decodificado el token, recupera del payload el id y lo busca
    User.findById(payload._id, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (!user) {
            done(null, false);
        }
        // devuelve usuario si corresponde con un usuario de la base de datos
        done(null, user);
    });
});


// incluye en passport el uso de la estrategia de JWT
passport.use(PAuthToken);