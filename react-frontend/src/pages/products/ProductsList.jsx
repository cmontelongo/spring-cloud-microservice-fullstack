import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProductsList() {
    const [products, setProducts] = useState([]);

   useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await fetch("http://localhost:8080/products", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Error al obtener productos");
                }

                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchProducts();
    }, []);


    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Productos</h1>

            <Link to="/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-xl mb-4 inline-block">
                Nuevo Producto
            </Link>

            <ul className="space-y-2">
                {products.map((p) => (
                    <li key={p.id} className="border p-4 rounded-xl flex justify-between">
                        <span>{p.name}</span>
                        <Link to={`/products/${p.id}`} className="text-blue-600">Ver</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}