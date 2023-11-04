// admin-routes.js
import express from 'express';
import { createUser, setCustomClaims, checkIfAdmin } from './auth-controller';
import { checkIfAuthenticated } from './auth-middleware';

const router = express.Router();

// Rota para criar um novo usuário
router.post('/auth/signup', createUser);

// Rota para definir reivindicações personalizadas (tornar um usuário admin)
router.post('/auth/setCustomClaims', checkIfAuthenticated, checkIfAdmin, setCustomClaims);

export default router;
