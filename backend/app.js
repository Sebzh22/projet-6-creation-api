const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();


const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

const app = express();


mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASSWORD+'@cluster0.lubyk4g.mongodb.net/'+process.env.DB_DATABASE+'?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
 });

 app.use(helmet({
  crossOriginResourcePolicy: false,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true}));



app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;