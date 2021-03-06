const express = require('express');
const passport = require('passport');
//FUNCIONES PARA GENERAR TOKEN MEDIANTE SIGN
const AuthCtrl = require('../controllers/passport_controller');
//USO DE PASSPORT-JWT PARA PROTEGER RUTAS
require('../config/passport');
const PAuthToken = passport.authenticate('jwt', { session: false });
//LOADING ALL THE FUNCTIONS TO USE THE APPLICATION WITH THE CORRECT AUTORITATION
const WORDS = require('./routes_words');
const adjectiveCtrl = require('../controllers/words_controllers/adjective_actions')

module.exports = function (app) {
  //0.- Creating all the routes
  const apiRoutes = express.Router();
  const authRoutes = express.Router();

  //2.1.- Authorized routes /api/auth
  apiRoutes.use('/auth',authRoutes);

 //---------------  PUBLIC ROUTES  ------------------------
  //3 Singup Signin Private   
  //3.1.- /api/auth/signup
  authRoutes.post('/signup', AuthCtrl.signup);

  //3.2.- /api/auth/signin
  authRoutes.post('/signin', AuthCtrl.signin);

  //3.3.- /api/auth/provingPublic
  authRoutes.get('/provingPublic', (req, res) => {res.status(200).send({ message:'provingPublic 16/02/2021'});});

  //3.4.- /api/auth/adjectivesInBD
  authRoutes.get('/adjectivesInBD',adjectiveCtrl.adjectivesInBD);

  //---------------  PRIVATE ROUTES  ------------------------
  //--------     functions of the app    ------------------------  
  //3.3- /api/auth/words
  authRoutes.use('/words',PAuthToken,WORDS);

  //Knowing the active user
  authRoutes.use('/private',PAuthToken,(req, res)=> {
    const super_user = req.user;
    res.send(super_user);
  });
  //-------------------------------------------------------------
  //------------------------------------------------------------- 


  //3.4.- /api/auth/logout
  authRoutes.get('/logout', PAuthToken, function(req, res) {
    req.logout();
    res.json({success: true, msg: 'Sign out successfully.'});
  });

  //3.5.- /api/auth/whoiam. Nos sirve para identificar al usuario
  //en caso de que se refresque la página.
  authRoutes.get('/whoiam',PAuthToken,AuthCtrl.whoiam);


  //1.- First route
  app.use('/api',apiRoutes);
}