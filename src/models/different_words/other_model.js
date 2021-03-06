const {Schema, model} = require('mongoose');

const otherSchema = new Schema({
    word: String,
    track: String,
    meaning: String,
    type: String,
    user: { type: Schema.ObjectId, ref: 'User' }  
});

module.exports = model('otherSchema',otherSchema);