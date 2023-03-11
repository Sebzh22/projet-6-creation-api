const express = require('express');
//Création des routeurs séparés pour chaque route principale de l'application
const router = express.Router();

const userCtrl = require('../controllers/user');
const validate = require('../middleware/validate-inputs');


router.post('/signup',validate.user,  userCtrl.signup );
router.post('/login', validate.user, userCtrl.login);


module.exports = router;
