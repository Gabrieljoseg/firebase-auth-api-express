const express = require('express');
const axios = require('axios');
const verificarToken = require('./middlewares/verificarToken'); // Ajuste o caminho conforme necessário
const router = express.Router();

// Rota para listar todos os currículos
router.get('/curriculos', async (req, res) => {
  try {
    const response = await axios.get('https://api-rest-curriculo.vercel.app/curriculos');
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rota para obter um currículo por nome
router.get('/curriculos/pessoa/:nome', async (req, res) => {
  try {
    const { nome } = req.params;
    const response = await axios.get(`https://api-rest-curriculo.vercel.app/curriculos/pessoa/${nome}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rota para criar um currículo
router.post('/curriculos', async (req, res) => {
  try {
    const response = await axios.post('https://api-rest-curriculo.vercel.app/curriculos', req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rota para atualizar um currículo por ID
router.put('/curriculos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.put(`https://api-rest-curriculo.vercel.app/curriculos/${id}`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rota para excluir um currículo por ID
router.delete('/curriculos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.delete(`https://api-rest-curriculo.vercel.app/curriculos/${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
