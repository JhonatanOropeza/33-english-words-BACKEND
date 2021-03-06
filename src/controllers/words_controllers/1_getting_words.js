const getting_Ctrl = {};
const nounSchema = require('../../models/different_words/noun_model');
const verbSchema = require('../../models/different_words/verb_model');
const adjectiveSchema = require('../../models/different_words/adjective_model');
const otherSchema = require('../../models/different_words/other_model');

//Route('/')
getting_Ctrl.getWords = async (req, res) => {
    const results = [];
    const totales = [];
    //Getting a random document
    function randomSelection(words) {
        return words[Math.floor(Math.random() * words.length)]
    }
    try {
        //1.- GETTING DATA FROM DATABASE
        //A) Getting all the nouns that belong to the autenticated user
        const nouns = await nounSchema.find({ user: req.user._id });
        totales[0] = await nounSchema.countDocuments({ user: req.user._id });
        results[0] = randomSelection(nouns);
        //B) Getting verb
        const verbs = await verbSchema.find({ user: req.user._id });
        totales[1] = await verbSchema.countDocuments({ user: req.user._id });
        results[1] = randomSelection(verbs);
        //C) Getting adjective
        const adjectives = await adjectiveSchema.find({ user: req.user._id });
        totales[2] = await adjectiveSchema.countDocuments({ user: req.user._id });
        results[2] = randomSelection(adjectives);
        //D) Getting other word
        const others = await otherSchema.find({ user: req.user._id });
        totales[3] = await otherSchema.countDocuments({ user: req.user._id });
        results[3] = randomSelection(others);

        //2.- CHANGE undefined IF EXISTS IN RESULTS
        result = results.map(result => {
            if (result === undefined) {
                return {}
            } else
                return result;
        });

        //3.- RETURNING RESULT
        if (Object.keys(result[0]).length === 0 && Object.keys(result[1]).length === 0 && Object.keys(result[2]).length === 0 && Object.keys(result[3]).length === 0) {
            return res.status(404).send({ message: "No words have been entered to display" })
        }
        res.status(201).send({result, totales});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message:"Error en el servidor"})
    }
};

module.exports = getting_Ctrl;