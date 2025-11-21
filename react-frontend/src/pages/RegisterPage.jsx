import { useState } from "react";
import { registerRequest } from "../services/authService";
import { useNavigate } from "react-router-dom";


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
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Registro</h2>


                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}


                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block font-semibold">Nombre</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>


                    <div className="mb-4">
                        <label className="block font-semibold">Email</label>
                        <input
                            type="email"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>


                    <div className="mb-4">
                        <label className="block font-semibold">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        {loading ? "Registrando..." : "Registrarse"}
                    </button>
                </form>


                <p className="mt-4 text-center text-sm">
                    ¿Ya tienes cuenta? <a href="/login" className="text-blue-600">Inicia sesión</a>
                </p>
            </div>
        </div>
    );
}