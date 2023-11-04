// src/middlewares/authMiddleware.js
const admin = require('/workspaces/firebase-auth-api-express/service/firebase-service.jsw');

const checkIfAuthenticated = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  const split = authorization.split('Bearer ');
  if (split.length !== 2) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  const token = split[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Authenticated', decodedToken);
    return next();
  } catch (e) {
    console.error('Error verifying auth token', e);
    return res.status(401).send({ message: 'Unauthorized' });
  }
};

module.exports = checkIfAuthenticated;
