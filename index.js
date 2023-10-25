const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
import axios from 'axios';
import {auth} from './firebase-service';
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const auth = require('./middleware/auth');
const authController = require('./controllers/authController.json')
const app = express();
const db = require('./queries');
const port = 3000;

import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


export const createUserAccount = (data) => {
  return axios.post('https:// /auth/signup', data)
    .then(res => res.data)
}


export const loginUser = (email, password) => {
  return auth().signInWithEmailAndPassword(email, password);
}

  
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (request, response) => {
  response.json({ info: 'Esta API foi feita por Gabriel J. e você pode usá-la para manipular informações de currículo' });
});

app.get('/curriculos', db.getCurriculos);
app.get('/curriculos/pessoa/:nome', db.getCurriculoByNome);
app.post('/curriculos', db.createCurriculo);
app.put('/curriculos/:id', db.updateCurriculo);
app.delete('/curriculos/:id', db.deleteCurriculo);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
  }
);