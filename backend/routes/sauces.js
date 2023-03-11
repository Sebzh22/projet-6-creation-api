const express = require('express');
//Création des routeurs séparés pour chaque route principale de l'application
const router = express.Router();

const productCtrl = require ('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const validate = require('../middleware/validate-inputs');


router.post('/', auth, multer, validate.sauce, productCtrl.createSauce);
router.post('/:id/like', auth, validate.id, validate.like, productCtrl.likeSauce);
router.get('/', auth, productCtrl.getAllSauces);
router.get('/:id', auth, validate.id, productCtrl.getOneSauce);
router.put('/:id', auth, multer, validate.id, validate.sauce, productCtrl.modifySauce);
router.delete('/:id', auth, validate.id, productCtrl.deleteSauce);


module.exports = router;