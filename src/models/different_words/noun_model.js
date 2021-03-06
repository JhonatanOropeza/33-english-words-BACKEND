const {Schema, model} = require('mongoose');
//const user = mongoose.model('user');

const nounSchema = new Schema({
    word: String,
    track: String,
    meaning: String,
    type: String,
    user: { type: Schema.ObjectId, ref: 'User' } 
});

module.exports = model('nounSchema',nounSchema); 