const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const axios = require('axios');

require('dotenv').config();

const firebaseConfig = {
  apiKey: "AIzaSyDFYi4bhrjVP1SFv7feBKmxyPE1X1wpXZ4",
  authDomain: "api-auth-5eba3.firebaseapp.com",
  databaseURL: "https://api-auth-5eba3-default-rtdb.firebaseio.com",
  projectId: "api-auth-5eba3",
  storageBucket: "api-auth-5eba3.appspot.com",
  messagingSenderId: "601937009201",
  appId: "1:601937009201:web:55b139719033b5161b5310"
};

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://api-auth-5eba3-default-rtdb.firebaseio.com"
});

// Initialize Firebase Authentication
const firebaseApp = initializeApp(firebaseConfig);


const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    info: 'API de autenticação com Node.js, Express e Firebase',
    routes: {
      '/v1/signup': {
        method: 'POST',
        description: 'Criar um novo usuário',
      },
      '/v1/login': {
        method: 'POST',
        description: 'Fazer login e obter um token JWT',
      },
        '/v1/curriculos': {
        method: 'GET',
        description: 'Listar todos os currículos',
      },
      '/v1/curriculos/pessoa/:nome': {
        method: 'GET',
        description: 'Obter um currículo por nome',
      },
      '/v1/curriculos/:id': {
        method: 'PUT',
        description: 'Atualizar um currículo por ID',
      },
      '/curriculos/:id': {
        method: 'DELETE',
        description: 'Excluir um currículo por ID',
      },
    },
  });
});


const SECRET = "AIzaSyDFYi4bhrjVP1SFv7feBKmxyPE1X1wpXZ4";
// Rota para criar um novo usuário
app.post('/signup', async (req, res) => {
  try {
    const createUser = async (req, res) => {
      const {
            email,
            password
          } = req.body;
      
          const user = await admin.auth().createUser({
            email,
            password
          });
      
          return res.send(user);
      }
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
    const adminRef = admin.database().ref('admin');
    adminRef.child(user.uid).get().then((snapshot) => {
      if (snapshot.exists() && snapshot.val() === true) {
        // O usuário é um administrador
        const token = jwt.sign({ uid: user.uid, isAdmin: true }, SECRET, {
          expiresIn: '2h',
        });
        
        res.redirect('/admin');
        res.status(200).json({
          statusCode: 200,
          message: 'Bem vindo a área de administração',
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
          message: 'Login realizado com sucesso! Você é um usuário com permissão de Viewer. Fale com o seu administrador para alterar sua permissão',
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

// Função para definir reivindicações personalizadas de um usuário (tornar um usuário admin)
const setCustomClaims = async (req, res) => {
  const { uid, claims } = req.body;
  try {
    await admin.auth().setCustomUserClaims(uid, claims);
    res.send({ uid, claims });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Função para verificar se o usuário é um admin
const checkIfAdmin = async (req, res, next) => {
  const { uid } = req.authId;
  try {
    const user = await admin.auth().getUser(uid);
    if (user.customClaims && user.customClaims.admin === true) {
      next();
    } else {
      res.status(403).send({ message: 'Requer privilégios de administrador' });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const checkFirebaseToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(403).send({ error: 'Unauthorized' });
  }

  const token = authorization.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).send({ error: 'Unauthorized' });
  }
};
const verificarAdmin = (req, res, next) => {
  if (req.userData.isAdmin) {
    next(); // O usuário é um administrador, permita o acesso.
  } else {
    res.status(403).json({
      statusCode: 403,
      message: 'Acesso proibido! Você não é um administrador.',
    });
  }
};

app.get('/admin', checkFirebaseToken, checkIfAdmin, (req, res) => {
  // Apenas administradores podem acessar esta rota
  res.status(200).json({
    statusCode: 200,
    message: 'Você acessou a rota protegida para administradores.',
  });
});


// Rota para listar todos os currículos
app.get('/curriculos', async (req, res) => {
  try {
    const response = await axios.get('https://api-rest-curriculo.vercel.app/curriculos');
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rota para obter um currículo por nome
app.get('/curriculos/pessoa/:nome', async (req, res) => {
  try {
    const { nome } = req.params;
    const response = await axios.get(`https://api-rest-curriculo.vercel.app/curriculos/pessoa/${nome}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rota para criar um currículo
app.post('/curriculos', async (req, res) => {
  try {
    const response = await axios.post('https://api-rest-curriculo.vercel.app/curriculos', req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rota para atualizar um currículo por ID
app.put('/curriculos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.put(`https://api-rest-curriculo.vercel.app/curriculos/${id}`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rota para excluir um currículo por ID
app.delete('/curriculos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.delete(`https://api-rest-curriculo.vercel.app/curriculos/${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});
