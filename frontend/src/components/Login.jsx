import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';


export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ email, password });
            navigate('/');
        } catch (err) {
            setError('Credenciales incorrectas');
        }
    };


    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>


                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}


                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 border rounded"
                    required
                />


                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-4 border rounded"
                    required
                />


                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                >
                    Entrar
                </button>


                <p className="text-center text-sm mt-4">
                    ¿No tienes cuenta? <a href="/register" className="text-blue-600">Regístrate</a>
                </p>
            </form>
        </div>
    );
}