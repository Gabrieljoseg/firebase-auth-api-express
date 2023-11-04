const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://api-auth-5eba3-default-rtdb.firebaseio.com"
});

module.exports = admin;
