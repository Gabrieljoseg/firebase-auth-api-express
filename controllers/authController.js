const db = require('./queries');
const knexFile = require('../knexfile.js');
const { initializeApp } = require("@firebase/app");
const { getAuth, criarUsuariocomEmailSenha, signInWithEmailAndPassword, signInWithCustomToken, signOut  } = require("firebase/auth");
const firebaseJson = require('../firebaseCredentials.json');




// Inicializa o módulo de autenti
const auth = getAuth(initializeApp(firebaseJson));

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Autentica o usuário com o email e a senha
    const user = await criarUsuariocomEmailSenha(auth, email, password).then((userCredential) => {
      // O usuário foi autenticado com sucesso
      const user = userCredential.user;

      return user;

    });

    return res.status(200).json({ message: "Autenticação bem-sucedida", user });

  } catch (error) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

};

exports.register = async (req, res) => {
  const { nome, email, password, password_confirmation, birthdate } = req.body;

  // Verifica se as senhas coincidem
  if (password !== password_confirmation) {
    return res.status(400).json({ error: "As senhas não coincidem" });
  }
var errorMessage = false;
  // try {

    // Se o e-mail não estiver em uso, cria o usuário
    await criarUsuariocomEmailSenha(auth, email, password)
    .then((userCredential) => {
      console.log('user criado');

    })
    .catch((error) => {
      errorMessage = true;

    });

    if(errorMessage == true) {
      return res.status(500).json({ error: "usuario já existe" });
    }

    return res.status(201).json({ message: "Usuário registrado com sucesso"});

};

exports.logout = async (req, res) => {
  const auth = getAuth();

  signOut(auth).then(() => {
    return res.status(201).json({ message: "Usuário deslogado com sucesso" });

  }).catch((error) => {
    });
};