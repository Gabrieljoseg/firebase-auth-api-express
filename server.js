const express = require('express');
const { initializeApp } = require ("firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./queries.js');

const app = express();
app.use(cors());
app.use(express.json());

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

require('dotenv').config();
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),

});

app.get('/', (req, res) => {
  res.json({ info: 'API de autenticação com Node.js, Express e Firebase' });
});

const SECRET = process.env.FIREBASE_API_KEY;
// Rota para criar um novo usuário
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const auth = getAuth(firebaseApp);
    
    await createUserWithEmailAndPassword(auth, email, password);
    
    res.status(200).json({
      statusCode: 200,
      message: 'Usuário criado com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Erro ao criar usuário.',
    });
  }
});

// Rota para fazer login e obter um token JWT
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const auth = getAuth(firebaseApp);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Verifique se o usuário é um administrador
    const adminRef = admin.database().ref('admins');
    adminRef.child(user.uid).get().then((snapshot) => {
      if (snapshot.exists() && snapshot.val() === true) {
        // O usuário é um administrador
        const token = jwt.sign({ uid: user.uid, isAdmin: true }, SECRET, {
          expiresIn: '2h',
        });

        res.status(200).json({
          statusCode: 200,
          message: 'Login realizado com sucesso!',
          data: {
            token,
          },
        });
      } else {
        // O usuário não é um administrador
        const token = jwt.sign({ uid: user.uid, isAdmin: false }, SECRET, {
          expiresIn: '2h',
        });

        res.status(200).json({
          statusCode: 200,
          message: 'Login realizado com sucesso!',
          data: {
            token,
          },
        });
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(401).json({
      statusCode: 401,
      message: 'Não autorizado! Usuário não encontrado ou senha incorreta.',
    });
  }
});

// Middleware para verificar o token JWT
const verificarToken = (req, res, next) => {
  const tokenHeader = req.headers['authorization'];
  const token = tokenHeader && tokenHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      message: 'Não autorizado! Token não fornecido.',
    });
  }

  try {
    const decodedToken = jwt.verify(token, SECRET);
    req.uid = decodedToken.uid;
    next();
  } catch (error) {
    console.error('Erro ao verificar o token:', error);
    res.status(401).json({
      statusCode: 401,
      message: 'Não autorizado! Token inválido.',
    });
  }
};

app.get('/rotaApenasAdmin', verificarToken, (req, res) => {
  // Apenas administradores podem acessar esta rota
  res.status(200).json({
    statusCode: 200,
    message: 'Você acessou a rota protegida para administradores.',
  });
});

// Rota protegida que requer token JWT
app.get('/rotaAutenticada', verificarToken, (req, res) => {
  res.status(200).json({
    statusCode: 200,
    message: 'Rota protegida: acesso permitido!',
    data: {
      uid: req.uid,
    },
  });
});

// Rota para listar todos os currículos
app.get('/curriculos', verificarToken, db.getCurriculos);

// Rota para obter um currículo por nome
app.get('/curriculos/pessoa/:nome', verificarToken, db.getCurriculoByNome);

// Rota para criar um currículo
app.post('/curriculos', verificarToken, db.createCurriculo);

// Rota para atualizar um currículo por ID
app.put('/curriculos/:id', verificarToken, db.updateCurriculo);

// Rota para excluir um currículo por ID
app.delete('/curriculos/:id', verificarToken, db.deleteCurriculo);

// Servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});
