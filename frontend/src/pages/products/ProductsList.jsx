import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../css/ProductsList.css"; // 👈 importa el CSS

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
    const formatPrice = (value) => {
        if (value == null) return "-";
        return value.toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    return (
        <div className="products-page">
            <div className="products-container">
                {/* Encabezado */}
                <div className="products-header">
                    <div>
                        <h1 className="products-title">Productos</h1>
                        <p className="products-subtitle">
                            Administración de catálogo de productos
                        </p>
                    </div>

                    <Link to="/products/new" className="btn-primary">
                        <span className="btn-plus">＋</span>
                        <span>Nuevo Producto</span>
                    </Link>
                </div>

                {/* Tarjeta tabla */}
                <div className="card">
                    {products.length === 0 ? (
                        <div className="card-empty">
                            No hay productos registrados todavía.
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table className="table-products">
                                <thead>
                                    <tr>
                                        <th>SKU</th>
                                        <th>Nombre</th>
                                        <th className="text-right">Precio</th>
                                        <th className="text-right">Stock</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p, index) => (
                                        <tr key={p.id} className="table-row">
                                            <td>{p.sku}</td>
                                            <td className="cell-name">{p.name}</td>
                                            <td className="text-right">
                                                {formatPrice(p.price)}
                                            </td>
                                            <td className="text-right">
                                                <span
                                                    className={
                                                        "badge " +
                                                        (p.stock > 0
                                                            ? "badge-success"
                                                            : "badge-danger")
                                                    }
                                                >
                                                    {p.stock}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <Link
                                                    to={`/products/${p.id}`}
                                                    className="link-action"
                                                >
                                                    Ver
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}