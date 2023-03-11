const fs = require('fs');
const Sauce = require('../models/sauces');


// Créer (ajouter) une bière
  exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    });

    sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré avec succès !' }))
        .catch(error => res.status(400).json({ error }));
  };

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({error}));
}

exports.modifySauce = (req, res, next) => {
    //Regarde si req.file existe ou non
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    } : {...req.body};

    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Not authorized'});
        } else {
            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Sauce modifié!'}))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
};




exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Sauce supprimé !'})})
                        .catch(error => res.status(400).json({ error }));
                });
        })
        .catch( error => 
            res.status(500).json({ error }));
 };


 exports.likeSauce = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;
    const sauceId = req.params.id;
    Sauce.findOne({ _id: sauceId })
       .then(sauce => {
          // nouvelles valeurs à Modifier
          const newValues = {
             usersLiked: sauce.usersLiked,
             usersDisliked: sauce.usersDisliked,
             likes: 0,
             dislikes: 0
          }
          // Suivant les cas :
          switch (like) {
             // Lorsque bière est "liké"
             case 1:
                newValues.usersLiked.push(userId);
                break;
             // Lorsque bière "disliké"
             case -1:
                newValues.usersDisliked.push(userId);
                break;
             // lorsque pas d'avis ou annulation du like ou dislike
             case 0:
                if(newValues.usersLiked.includes(userId)) {
                   // Si annulation du like
                   const index = newValues.usersLiked.indexOf(userId);
                   newValues.usersLiked.splice(index, 1);
                } else {
                   // Si annulation du Dislike
                   const index = newValues.usersDisliked.indexOf(userId);
                   newValues.usersDisliked.splice(index, 1);
                }
                break;
          };
          // Calcul du nombre de likes et de dislikes
          newValues.likes = newValues.usersLiked.length;
          newValues.dislikes = newValues.usersDisliked.length;
          // Mise à jour des nouvelles valeurs de la bière
          Sauce.updateOne({ _id: sauceId }, newValues )
             .then(() => res.status(200).json({ message: 'Note attribuée avec succès à cette sauce !' }))
             .catch(error => res.status(500).json({ error }))
       })
       .catch(error => res.status(500).json({ error }));
 };