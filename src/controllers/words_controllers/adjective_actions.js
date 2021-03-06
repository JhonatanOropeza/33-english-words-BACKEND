const adjective_Ctrl = {};
const adjectiveSchema = require('../../models/different_words/adjective_model');

//1.- Adding adjective
adjective_Ctrl.postAdjectiveWord = async (req, res) => {
    //1.- Getting the dates of the user
    const { word, track, meaning, type } = req.body;
    const user = req.user._id;
    //2.- Storing the dates in the model
    const new_adjective = new adjectiveSchema({
        word,
        track,
        meaning,
        type,
        user
    });
    try {
        let result = await new_adjective.save();
        res.status(200).send({ messages: 'Adjective saved', result });
    } catch (e) {
        console.log(e)
    }
};
//2.1 - Geting the adjectives with PAGINATION
adjective_Ctrl.getAdjectiveWords = async (req, res) => {
    //Determining variables for pagination
    var actual_page = 1;
    if (req.params.page) {
        actual_page = req.params.page;
    }
    var itemsPerPage = 10;
    var skip = (actual_page * itemsPerPage) - itemsPerPage;
    //--
    try {
        let result = await adjectiveSchema.find({ user: req.user._id }).skip(skip).limit(itemsPerPage);
        let total = await adjectiveSchema.find({ user: req.user._id }).countDocuments();
        if (!result) return res.status(404).send({ message: 'No adjectives stored' });
        return res.status(200).send({ actual_page, itemsPerPage, total, result });
    } catch (e) {
        console.log(e);
    }
}
//2.2 - Geting all the adjectives
adjective_Ctrl.getAllAdjectiveWords = async (req, res) => {
    try {
        let result = await adjectiveSchema.find({ user: req.user._id });
        if (!result) return res.status(404).send({ message: 'No adjectives stored' });
        return res.status(200).send({ result });
    } catch (e) {
        console.log(e);
    }
}

//2.3 - Getting only one adjective
adjective_Ctrl.getOneAdjective = async (req, res) => {
    try {
        const result = await adjectiveSchema.findById(req.params.id);
        if (!result) return res.status(404).send({ message: 'The adjective isn´t stored' });
        res.status(200).send(result);
    } catch (e) {
        console.log(e);
    }
}

//3.- Editing of the word
adjective_Ctrl.editAdjectiveWord = async (req, res) => {
    //Getting the dates sended for the user with req.params.id
    const { word, track, meaning, type } = req.body;
    try {
        let result = await adjectiveSchema.updateOne({ '_id': req.params.id, 'user': req.user._id }, {
            $set: {
                word,
                track,
                meaning,
                type
            }
        });
        if(result.nModified === 0) return res.status(200).send({ message: 'The adjective didn´t receive modifications' });
        res.status(200).send({
            message: 'The adjective was successfully modified',
            result
        });
    } catch (e) {
        console.log(e)
    }
};

//4.- Deleting route('/:id')
adjective_Ctrl.deleteAdjectiveWord = async (req, res) => {
    try {
        let result = await adjectiveSchema.deleteOne({ '_id': req.params.id, 'user': req.user._id });
        res.status(200).send({ message: 'Adjective deleted', result });
    } catch (e) {
        console.log(e);
    }
};

//5.- New random words
adjective_Ctrl.getOneRandomAdjective = async (req, res) => {
    try {
        function randomSelection(words) {
            return words[Math.floor(Math.random() * words.length)]
        }
        async function selectioningNewWord() {
            const oldId = req.params.id;
            var nouns = await adjectiveSchema.find({ user: req.user._id });
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

adjective_Ctrl.adjectivesInBD = async (req, res) => {
    try {
        let result = await adjectiveSchema.find();
        if (!result) return res.status(404).send({ message: 'No adjectives stored' });
        return res.status(200).send({ message: "adjectivesBD", result });
    } catch (e) {
        console.log(e);
    }
}
module.exports = adjective_Ctrl;