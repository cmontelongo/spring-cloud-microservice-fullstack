import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await fetch(`http://localhost:8080/products/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Error al obtener el producto");
                }

                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!product) return <p>No se encontró el producto</p>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="mt-2">SKU: {product.sku}</p>
            <p className="mt-2">Descripción: {product.description}</p>
            <p className="mt-2">Precio: ${product.price}</p>
            <p className="mt-2">Stock: {product.stock}</p>
        </div>
    );
}
