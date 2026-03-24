const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = 3000;
const API_KEY = 'ba94c742';

app.get('/weather', async (req, res) => {
  const city = req.query.city || 'Recife,PE';

  try {
    const response = await axios.get(
      `https://api.hgbrasil.com/weather?key=${API_KEY}&city_name=${city}`
    );

    res.json(response.data.results);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Erro ao buscar clima' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});