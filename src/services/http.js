import axios from 'axios';
import jwtDecode from 'jwt-decode';

const baseURL = process.env.REACT_APP_API_URL;
const createAxios = axios.create(
  {
    baseURL
  },
  {
    headers: {
      'Content-Type': 'application/json'
    }
  }
);

createAxios.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  // Throws an error for bad token
  try {
    //console.log(jwtDecode(token));
  } catch (error) {
    //onsole.log("token doesn't work: ", error);
  }
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default createAxios;
