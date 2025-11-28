import api from '../api/api';


export async function loginRequest({ username, password }) {
  const credentials = {
    username: username,
    password: password
  };
  const { data } = await api.post('/auth/login', credentials);
  // Espera respuesta { token: '...' }
  return data;
}

export async function registerRequest(data) {
  const response = await api.post("/auth/register", data);
  return response.data;
}
