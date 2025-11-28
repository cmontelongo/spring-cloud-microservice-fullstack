import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import "../css/Login.css";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login({ username, password });
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Credenciales incorrectas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                {/* Título superior */}
                <div className="register-header">
                    <h1 className="register-title">Panel de Administración</h1>
                    <p className="register-description">
                        Ingresa tus credenciales para continuar
                    </p>
                </div>

                {/* Tarjeta de registro */}
                <section className="login-card">
                    <h2>Iniciar sesión</h2>
                    <p className="login-subtitle">
                        Usa tu usuario y contraseña registrados
                    </p>

                    {error && <div className="login-error">{error}</div>}

                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Usuario</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="tu.usuario"
                                autoComplete="username"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <div className="login-options">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span>Recordarme en este equipo</span>
                            </label>

                            <button
                                type="button"
                                className="link-button"
                                onClick={() => alert("Funcionalidad por implementar")}
                            >
                                Olvidé mi contraseña
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? "Ingresando..." : "Entrar al sistema"}
                        </button>
                    </form>

                    <p className="login-footer">
                        © {new Date().getFullYear()} Tu Empresa. Todos los derechos
                        reservados.
                    </p>
                </section>
            </div>
        </div>
    );
}
