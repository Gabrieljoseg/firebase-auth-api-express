const express = require('express');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.get('/', (req, res) => {
  res.json({ info: 'API de autenticação com Node.js, Express e Firebase' });
});

// Rota para criar um novo usuário
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
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
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Gere um token JWT
    const token = jwt.sign({ uid: user.uid }, SECRET, {
      expiresIn: '2h', // Token expira em 2 horas
    });

    res.status(200).json({
      statusCode: 200,
      message: 'Login realizado com sucesso!',
      data: {
        token,
      },
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

// Servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});
