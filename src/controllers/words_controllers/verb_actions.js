const verb_Ctrl = {};
const verbSchema = require('../../models/different_words/verb_model');

//1.- Adding verb
verb_Ctrl.postVerbWord = async (req, res) => {
    //1.- Getting the dates of the user
    const { word, track, meaning, type } = req.body;
    const user = req.user._id;
    //2.- Storing the dates in the model
    const new_verb = new verbSchema({
        word,
        track,
        meaning,
        type,
        user
    });
    try {
        let result = await new_verb.save();
        res.status(200).send({ messages: 'Verb saved', result });
    } catch (e) {
        console.log(e)
    }
};
//2.1 - Geting the verbs with PAGINATION
verb_Ctrl.getVerbWords = async (req, res) => {
    //Determining variables for pagination
    var actual_page = 1;
    if (req.params.page) {
        actual_page = req.params.page;
    }
    var itemsPerPage = 5;
    var skip = (actual_page * itemsPerPage) - itemsPerPage;
    //--
    try {
        let result = await verbSchema.find({ user: req.user._id }).skip(skip).limit(itemsPerPage);
        let total = await verbSchema.find({ user: req.user._id }).countDocuments();
        if (!result) return res.status(404).send({ message: 'No verbs stored' });
        return res.status(200).send({ actual_page, itemsPerPage, total, result });
    } catch (e) {
        console.log(e);
    }
}
//2.2 - Geting all the verbs
verb_Ctrl.getAllVerbWords = async (req, res) => {
    try {
        let result = await verbSchema.find({ user: req.user._id });
        if (!result) return res.status(404).send({ message: 'No verbs stored' });
        return res.status(200).send({ result });
    } catch (e) {
        console.log(e);
    }
}
//2.3 - Getting only one Verb
verb_Ctrl.getOneVerb = async (req, res) => {
    try {
        const result = await verbSchema.findById(req.params.id);
        if (!result) return res.status(404).send({ message: 'The verb isn´t stored' });
        res.status(200).send(result);
    } catch (e) {
        console.log(e);
    }
}

//3.- Editing of the word
verb_Ctrl.editVerbWord = async (req, res) => {
    //Getting the dates sended for the user with req.params.id
    const { word, track, meaning, type } = req.body;
    try {
        let result = await verbSchema.updateOne({ '_id': req.params.id, 'user': req.user._id }, {
            $set: {
                word,
                track,
                meaning,
                type
            }
        });
        if(result.nModified === 0) return res.status(200).send({ message: 'The verb didn´t receive modifications' });
        res.status(200).send({
            message: 'The verb was successfully modified',
            result
        });
    } catch (e) {
        console.log(e)
    }
};

//4.- Deleting route('/:id')
verb_Ctrl.deleteVerbWord = async (req, res) => {
    try {
        let result = await verbSchema.deleteOne({ '_id': req.params.id, 'user': req.user._id });
        res.status(200).send({ message: 'Verb deleted', result });
    } catch (e) {
        console.log(e);
    }
};

//5.- New random words
verb_Ctrl.getOneRandomVerb = async (req, res) => {
    try {
        function randomSelection(words) {
            return words[Math.floor(Math.random() * words.length)]
        }
        async function selectioningNewWord() {
            const oldId = req.params.id;
            var nouns = await verbSchema.find({ user: req.user._id });
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

module.exports = verb_Ctrl;