// -----------------------------------------
// GENERARCIÓN DE TOKEN EN SIGNIN Y SIGNUP
// -----------------------------------------
const AuthCtrl = {};
const jwt = require('jsonwebtoken');
const { User } = require('../models/index_model');

//Generando token
function generateToken(user) {
    return jwt.sign(user, 'secret', {
        expiresIn: 60 * 60 * 24
    });
}
//Normalizando la información
function setUserInfo(request) {
    return {
        _id: request._id,
        username: request.username,
        email: request.email
    };
}
// -----------------------------------------
// 1.- Function for singin
// -----------------------------------------
// función de login que usa la función @see setUserInfo
// para normalizar la info del usuario y retornar un 
// token con la función @see generateToken
AuthCtrl.signin = async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    //1.1 Validating form
    if (!email || !password) {
        return res.status(422).send({ error: 'Enter all data in SingIn' });
    }
    //1.2 Validating user
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(400).send({ error: 'Incorrect data in SignIn (1)' });
    }
    if (!user.comparePassword(req.body.password)) {
        return res.status(400).send({ error: 'Incorrect data in SignIn (2)' });
    }
    let userInfo = setUserInfo(user);
    res.status(200).json({
        token: generateToken(userInfo),
        user: userInfo
    });
};
// -----------------------------------------
// 2.- Function for singup
// -----------------------------------------
AuthCtrl.signup = async function (req, res, next) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    //Validating form
    if (!username || !email || !password) {
        return res.status(422).send({
            error: 'Enter all data in SignUp'
        });
    }
    // 1.2 Validating that the email isn´t repeated
    const user = await User.findOne({ email: email });
    if (user) {
        return res.status(422).send({
            error: 'The email was alreadey taken'
        });
    }
    // 1.3 Creating a new objecto with the validated information
    let newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);

    // 1.4 Trying to save de new object into the db
    await newUser.save(function (err, user) {
        if (err) {
            return next(err);
        }
        const userInfo = setUserInfo(user);
        //I the singup was succesfully, yhe next infromation will be sent
        res.status(201).json({
            message: `The user with the email "${email}" was succesfully registered. Now you can SingIn`,
            user: userInfo
        });
    })
}
// -----------------------------------------
// 3.- 
// -----------------------------------------
AuthCtrl.whoiam = function (req, res) {
    let userInfo = setUserInfo(req.user);
    //console.log(userInfo);
    res.json({
        user: userInfo
    });
}
module.exports = AuthCtrl;