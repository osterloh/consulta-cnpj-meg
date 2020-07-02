import axios from 'axios';

export const api = axios.create({
  baseURL:
    'https://cors-anywhere.herokuapp.com/https://www.receitaws.com.br/v1/cnpj',
});

export const meg = axios.create({
  baseURL: 'http://127.0.0.1:8080/meg/clientes/',
});
