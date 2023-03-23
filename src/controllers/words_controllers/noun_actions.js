const noun_Ctrl = {};
const nounSchema = require('../../models/different_words/noun_model');
const mongoose = require('mongoose');

//1.- Adding noun
noun_Ctrl.postNounWord = async (req, res) => {
    //1.- Getting the dates of the user
    const { word, track, meaning, type } = req.body;
    const user = req.user._id;
    //2.- Storing the dates in the model
    const new_noun = new nounSchema({
        word,
        track,
        meaning,
        type,
        user
    });
    try {
        let result = await new_noun.save();
        res.status(200).send({ messages: 'Noun saved', result });
    } catch (e) {
        console.log(e)
    }
};
//2.1 - Geting the nouns with PAGINATION
noun_Ctrl.getNounWords = async (req, res) => {
    //Determining variables for pagination
    var actual_page = 1;
    if (req.params.page) {
        actual_page = req.params.page;
    }
    var itemsPerPage = 5;
    var skip = (actual_page * itemsPerPage) - itemsPerPage;

    //--
    try {
        let result = await nounSchema.find({ user: req.user._id }).skip(skip).limit(itemsPerPage);
        let total = await nounSchema.find({ user: req.user._id }).countDocuments();
        if (!result) return res.status(404).send({ message: 'No nouns stored' });
        return res.status(200).send({ actual_page, itemsPerPage, total, result });
    } catch (e) {
        console.log(e);
    }
}
//2.2 - Geting all the nouns
noun_Ctrl.getAllNounWords = async (req, res) => {
    try {
        let result = await nounSchema.find({ user: req.user._id });
        if (!result) return res.status(404).send({ message: 'No nouns stored' });
        return res.status(200).send({ result });
    } catch (e) {
        console.log(e);
    }
}
//2.3 - Getting only one noun
noun_Ctrl.getOneNoun = async (req, res) => {
    try {
        const result = await nounSchema.findById(req.params.id);
        if (!result) return res.status(404).send({ message: 'The noun isn´t stored' });
        res.status(200).send(result);
    } catch (e) {
        console.log(e);
    }
}

//3.- Editing of the word
noun_Ctrl.editNounWord = async (req, res) => {
    //Getting the dates sended for the user with req.params.id
    const { word, track, meaning, type } = req.body;
    try {
        let result = await nounSchema.updateOne({ '_id': req.params.id, 'user': req.user._id }, {
            $set: {
                word,
                track,
                meaning,
                type
            }
        });
        if (result.nModified === 0) return res.status(200).send({ message: 'The noun didn´t receive modifications' });
        res.status(200).send({
            message: 'The noun was successfully modified',
            result
        });
    } catch (e) {
        console.log(e)
    }
};

//4.- Deleting route('/:id')
noun_Ctrl.deleteNounWord = async (req, res) => {
    try {
        let result = await nounSchema.deleteOne({ '_id': req.params.id, 'user': req.user._id });
        res.status(200).send({ message: 'Noun deleted', result });
    } catch (e) {
        console.log(e);
    }
};

//5.- New random words
noun_Ctrl.getOneRandomNoun = async (req, res) => {
    try {
        function randomSelection(words) {
            return words[Math.floor(Math.random() * words.length)]
        }
        async function selectioningNewWord() {
            const oldId = req.params.id;
            var nouns = await nounSchema.find({ user: req.user._id });
            var newNoun = randomSelection(nouns);
            const newId = newNoun._id.toString();
            if (newId === oldId) {
                selectioningNewWord();
            } else {
                res.status(200).send(newNoun);
            }
        }
        selectioningNewWord();
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Server error trying to search new word" });
    }
}

module.exports = noun_Ctrl;