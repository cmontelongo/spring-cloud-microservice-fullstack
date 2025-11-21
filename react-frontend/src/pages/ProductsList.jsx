import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function ProductList() {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const products = [
        { id: 1, name: "Laptop" },
        { id: 2, name: "Smartphone" },
        { id: 3, name: "Tablet" },
    ];
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Lista de Productos</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    className="w-full border rounded-lg p-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <ul className="space-y-4">
                {filteredProducts.map(product => (
                    <li
                        key={product.id}
                        className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                        onClick={() => navigate(`/products/${product.id}`)}
                    >
                        {product.name}
                    </li>
                ))}
                {filteredProducts.length === 0 && (
                    <li className="text-gray-500">No se encontraron productos.</li>
                )}
            </ul>
        </div>
    );
}
