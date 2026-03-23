import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.hgbrasil.com/weather',
});

export const getWeather = async () => {
  try {
    const response = await api.get('?key=ba94c742&city_name=Recife,PE');
    if (response.data && response.data.results) {
      return response.data.results;
    } else {
      return null;
    }
  } catch (error) {
    console.log('Erro na API:', error.response ? error.response.data : error.message);
    return null;
  }
};