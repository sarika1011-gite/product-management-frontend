import axios from "axios";

const api = axios.create({
  // Backend port standard pipeline declaration
  // ✅ इथे फक्त शेवटी /api जोडलं आहे, जेणेकरून तुमचे सर्व राऊट्स (/api/auth आणि /api/products) परफेक्ट मॅच होतील
  baseURL: "https://product-management-backend-ibmd.onrender.com/api",
});

// Request interceptor: dynamic local storage authentication tokens parsing
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
