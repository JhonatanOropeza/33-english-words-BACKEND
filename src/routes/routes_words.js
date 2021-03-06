//Express-Router
const { Router } = require('express');
const router_words = Router();
//Loading the functions for th English-Words-Application
const { getWords} = require('../controllers/words_controllers/1_getting_words');
const { getOneRandomNoun, getOneNoun, getNounWords, getAllNounWords,postNounWord, deleteNounWord, editNounWord} = require('../controllers/words_controllers/noun_actions');
const { getOneRandomVerb, getOneVerb, getVerbWords, getAllVerbWords, postVerbWord, deleteVerbWord, editVerbWord} = require('../controllers/words_controllers/verb_actions');
const { getOneRandomAdjective, getOneAdjective , getAdjectiveWords, getAllAdjectiveWords, postAdjectiveWord, deleteAdjectiveWord, editAdjectiveWord} = require('../controllers/words_controllers/adjective_actions');
const { getOneRandomOther, getOneOther, getOtherWords, getAllOtherWords,postOtherWord, deleteOtherWord, editOtherWord} = require('../controllers/words_controllers/other_actions');
//Building the Router
//0.- Consulting the 4 mongodb´s collections /api/auth/words/
router_words.route('/')
    .get(getWords);
//1.- Noun´s routes /api/auth/words/noun
router_words.route('/nouns/:page?').get(getNounWords);
router_words.route('/noun')
    .post(postNounWord)
    .get(getAllNounWords);
router_words.route('/noun/:id')
    .delete(deleteNounWord)
    .put(editNounWord)
    .get(getOneNoun);
router_words.get('/getOneRandomNoun/:id',getOneRandomNoun)

//2.- Verb´s routes
router_words.route('/verbs/:page?').get(getVerbWords);
router_words.route('/verb')
    .post(postVerbWord)
    .get(getAllVerbWords);
router_words.route('/verb/:id')
    .delete(deleteVerbWord) 
    .put(editVerbWord)
    .get(getOneVerb);
router_words.route('/getOneRandomVerb/:id').get(getOneRandomVerb);

//3.- Adjective´s routes
router_words.route('/adjectives/:page?').get(getAdjectiveWords);
router_words.route('/adjective')
    .post(postAdjectiveWord)
    .get(getAllAdjectiveWords);
router_words.route('/adjective/:id')
    .delete(deleteAdjectiveWord)
    .put(editAdjectiveWord)
    .get(getOneAdjective);
router_words.route('/getOneRandomAdjective/:id').get(getOneRandomAdjective);

//4.- Other word´s routes
router_words.route('/other_words/:page?').get(getOtherWords);
router_words.route('/other_word')
    .post(postOtherWord)
    .get(getAllOtherWords);
router_words.route('/other_word/:id')
    .delete(deleteOtherWord)
    .put(editOtherWord)
    .get(getOneOther);
router_words.route('/getOneRandomOther/:id').get(getOneRandomOther);

module.exports = router_words; 
