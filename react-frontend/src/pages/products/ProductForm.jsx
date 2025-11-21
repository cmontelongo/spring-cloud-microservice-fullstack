import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductForm() {
    const [sku, setSku] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("accessToken");
            console.log("Token en ProductForm:", token);
            const response = await fetch("http://localhost:8080/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    sku,
                    name,
                    description,
                    price,
                    stock
                })
            });

            if (!response.ok) {
                throw new Error("Error al guardar el producto");
            }

            navigate("/products");

        } catch (error) {
            console.error(error);
            alert("Hubo un error al guardar el producto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Nuevo Producto</h1>

            <form className="space-y-4" onSubmit={handleSubmit}>
                
                <div>
                    <label className="block">SKU</label>
                    <input
                        type="text"
                        className="border p-2 w-full rounded-lg"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block">Nombre</label>
                    <input
                        type="text"
                        className="border p-2 w-full rounded-lg"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block">Descripción</label>
                    <textarea
                        className="border p-2 w-full rounded-lg"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>

                <div>
                    <label className="block">Precio</label>
                    <input
                        type="number"
                        step="0.01"
                        className="border p-2 w-full rounded-lg"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                        required
                    />
                </div>

                <div>
                    <label className="block">Stock</label>
                    <input
                        type="number"
                        className="border p-2 w-full rounded-lg"
                        value={stock}
                        onChange={(e) => setStock(parseInt(e.target.value))}
                        required
                    />
                </div>

                <button
                    className="bg-green-600 text-white px-4 py-2 rounded-xl disabled:bg-green-300"
                    disabled={loading}
                >
                    {loading ? "Guardando..." : "Guardar"}
                </button>
            </form>
        </div>
    );
}
