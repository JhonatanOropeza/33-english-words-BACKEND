const other_Ctrl = {};
const otherSchema = require('../../models/different_words/other_model');

//1.- Adding other word
other_Ctrl.postOtherWord = async (req, res) => {
    //1.- Getting the dates of the user
    const { word, track, meaning, type } = req.body;
    const user = req.user._id;
    //2.- Storing the dates in the model
    const new_other = new otherSchema({
        word,
        track,
        meaning,
        type,
        user
    });
    try {
        let result = await new_other.save();
        res.status(200).send({ messages: 'Other word saved', result });
    } catch (e) {
        console.log(e)
    }
};
//2.1 - Geting the others with PAGINATION
other_Ctrl.getOtherWords = async (req, res) => {
    //Determining variables for pagination
    var actual_page = 1;
    if (req.params.page) {
        actual_page = req.params.page;
    }
    var itemsPerPage = 5;
    var skip = (actual_page * itemsPerPage) - itemsPerPage;
    //--
    try {
        let result = await otherSchema.find({ user: req.user._id }).skip(skip).limit(itemsPerPage);
        let total = await otherSchema.find({ user: req.user._id }).countDocuments();
        if (!result) return res.status(404).send({ message: 'No others words stored' });
        return res.status(200).send({ actual_page, itemsPerPage, total,  result });
    } catch (e) {
        console.log(e);
    }
}
//2.2 - Geting all the other_words
other_Ctrl.getAllOtherWords = async (req, res) => {
    try {
        let result = await otherSchema.find({ user: req.user._id });
        if (!result) return res.status(404).send({ message: 'No others stored' });
        return res.status(200).send({ result });
    } catch (e) {
        console.log(e);
    }
}
//2.3 - Getting only one other word
other_Ctrl.getOneOther = async (req, res) => {
    try {
        const result = await otherSchema.findById(req.params.id);
        if (!result) return res.status(404).send({ message: 'The other word isn´t stored' });
        res.status(200).send(result);
    } catch (e) {
        console.log(e);
    }
}

//3.- Editing of the word
other_Ctrl.editOtherWord = async (req, res) => {
    //Getting the dates sended for the user with req.params.id
    const { word, track, meaning, type } = req.body;
    try {
        let result = await otherSchema.updateOne({ '_id': req.params.id, 'user': req.user._id }, {
            $set: {
                word,
                track,
                meaning,
                type
            }
        });
        if(result.nModified === 0) return res.status(200).send({ message: 'The other word didn´t receive modifications' });
        res.status(200).send({
            message: 'The other word was successfully modified',
            result
        });
    } catch (e) {
        console.log(e)
    }
};

//4.- Deleting route('/:id')
other_Ctrl.deleteOtherWord = async (req, res) => {
    try {
        let result = await otherSchema.deleteOne({ '_id': req.params.id, 'user': req.user._id });
        res.status(200).send({ message: 'Other word deleted', result });
    } catch (e) {
        console.log(e);
    }
};

//5.- New random words
other_Ctrl.getOneRandomOther = async (req, res) => {
    try {
        function randomSelection(words) {
            return words[Math.floor(Math.random() * words.length)]
        }
        async function selectioningNewWord() {
            const oldId = req.params.id;
            var nouns = await otherSchema.find({ user: req.user._id });
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

module.exports = other_Ctrl;