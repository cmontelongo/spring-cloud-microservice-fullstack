import React, { createContext, useReducer, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginRequest } from '../services/authService';


const AuthContext = createContext();
import { useContext } from "react";
export const useAuth = () => useContext(AuthContext);

const initialState = {
  user: null,
  token: localStorage.getItem('accessToken') || null,
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, loading: false, token: action.payload.token, user: action.payload.user };
    case 'AUTH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { user: null, token: null, loading: false, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);


  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const user = jwtDecode(token);
        // Si el token expiró, eliminarlo
        if (user.exp * 1000 < Date.now()) {
          localStorage.removeItem('accessToken');
          dispatch({ type: 'LOGOUT' });
        } else {
          dispatch({ type: 'AUTH_SUCCESS', payload: { token, user } });
        }
      } catch (e) {
        localStorage.removeItem('accessToken');
      }
    }
  }, []);

  const login = async ({ username, password }) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const data = await loginRequest({ username, password });
      console.log("Data recibida en AuthContext:");
      console.log(data);
      if (!data || !data.accessToken) throw new Error('Respuesta inválida del servidor');
      const token = data.accessToken;
      const user = jwtDecode(token);
      localStorage.setItem('accessToken', token);
      dispatch({ type: 'AUTH_SUCCESS', payload: { token, user } });
      return user;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Error al autenticar';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    dispatch({ type: 'LOGOUT' });
  };


  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}


export default AuthContext;
