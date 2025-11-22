// import axios from 'axios';

// const API = axios.create(
//     {
//         baseURL: 'http://localhost:5000',//backend server address
//     }
// );


// API.interceptors.request.use((req)=>
// {
//     const token =localStorage.getItem('token');
//     if(token)req.headers.Authorization="Bearer "+token;
//     return req;
// }
// )
// export default API;
// api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// attach token to every request
API.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

export default API;
