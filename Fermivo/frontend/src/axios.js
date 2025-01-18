import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // URL-ul backend-ului tău
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
