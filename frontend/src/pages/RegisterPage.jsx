import { useState } from "react";
import { registerRequest } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../css/Register.css";


export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);


        try {
            await registerRequest(formData);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Error al registrarse");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                {/* Título superior */}
                <div className="register-header">
                    <h1 className="register-title">Crear cuenta</h1>
                    <p className="register-description">
                        Registra tus datos para acceder al panel
                    </p>
                </div>

                {/* Tarjeta de registro */}
                <section className="register-card">
                    <h2>Registro</h2>
                    <p className="register-subtitle">
                        Completa la información para crear tu usuario
                    </p>

                    {/* Si tienes manejo de error, úsalo aquí */}
                    {error && <div className="register-error">{error}</div>}

                    <form className="register-form" onSubmit={handleSubmit}>
                        {/* Ejemplo de campos, adapta a los tuyos */}
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Tu nombre"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Usuario</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="tu.tucorreo@empresa.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="register-button"
                            disabled={loading}
                        >
                            {loading ? "Creando cuenta..." : "Crear cuenta"}
                        </button>
                    </form>

                    <p className="register-footer">
                        ¿Ya tienes cuenta?{" "}
                        <a href="/login" className="register-link">
                            Inicia sesión
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}