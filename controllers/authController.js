import admin from './firebase-service';

export const createUser = async (req, res) => {
const {
      email,
      phoneNumber,
      password,
      firstName,
      lastName,
      photoUrl
    } = req.body;

    const user = await admin.auth().createUser({
      email,
      phoneNumber,
      password,
      displayName: `${firstName} ${lastName}`,
      photoURL: photoUrl
    });

    return res.send(user);
}

// Função para definir reivindicações personalizadas de um usuário (tornar um usuário admin)
export const setCustomClaims = async (req, res) => {
  const { uid, claims } = req.body;
  try {
    await admin.auth().setCustomUserClaims(uid, claims);
    res.send({ uid, claims });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Função para verificar se o usuário é um admin
export const checkIfAdmin = async (req, res, next) => {
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
