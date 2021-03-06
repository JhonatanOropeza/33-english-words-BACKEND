const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        trim: true, //Limpieza de texto en blanco al inicio y termino
    },
    email: { 
        type: String,
        required: true,
        trim: true, 
        unique: true
    },
    password:{
        type: String,
        required: true
    }
});

//METHODS
// 1.- To encrypt password
userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
}

 //2.- To compare password
 userSchema.methods.comparePassword = async function (password){
     return bcrypt.compare(password, this.password);
 }
module.exports = model('User', userSchema)