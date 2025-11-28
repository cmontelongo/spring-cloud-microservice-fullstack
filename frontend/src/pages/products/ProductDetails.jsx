import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../css/ProductDetails.css";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Formato de moneda
    const formatPrice = (value) => {
        if (value == null) return "-";
        return value.toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                setError(null);
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
                setProduct({
                    id: data.id,
                    sku: data.sku,
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    stock: data.stock,
                    createdAt: "2025-11-01",
                    updatedAt: "2025-11-20",
                });
                setLoading(false);
                /*setTimeout(() => {
                     setProduct({
                         id,
                         sku: "PROD-001",
                         name: "Producto de ejemplo",
                         description:
                             "Este es un producto de ejemplo con una descripción un poco más larga para probar el diseño de la ficha.",
                         price: 1599.99,
                         stock: 12,
                         createdAt: "2025-11-01",
                         updatedAt: "2025-11-20",
                     });
                     setLoading(false);
                 }, 300);*/
            } catch (err) {
                console.error(err);
                setError("No se pudo cargar la información del producto");
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="product-detail-page">
                <div className="product-detail-container">
                    <div className="product-detail-card">
                        <p className="product-detail-loading">Cargando producto...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-detail-page">
                <div className="product-detail-container">
                    <div className="product-detail-card">
                        <p className="product-detail-error">{error || "Producto no encontrado"}</p>
                        <button
                            className="btn-secondary"
                            onClick={() => navigate("/products")}
                        >
                            Volver al listado
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const hasStock = product.stock > 0;

    return (
        <div className="product-detail-page">
            <div className="product-detail-container">
                {/* Header con breadcrumb */}
                <div className="product-detail-header">
                    <div className="breadcrumb">
                        <Link to="/products" className="breadcrumb-link">
                            ← Volver a productos
                        </Link>
                    </div>

                    <div className="product-detail-header-main">
                        <div>
                            <h1 className="product-detail-title">
                                {product.name}
                            </h1>
                            <p className="product-detail-sku">
                                SKU: <span>{product.sku}</span>
                            </p>
                        </div>

                        <span
                            className={
                                "badge " +
                                (hasStock ? "badge-success" : "badge-danger")
                            }
                        >
                            {hasStock ? "Con stock" : "Sin stock"}
                        </span>
                    </div>
                </div>

                {/* Tarjeta principal */}
                <div className="product-detail-card">
                    <div className="product-detail-layout">
                        {/* Columna izquierda: info principal */}
                        <div className="product-detail-main">
                            <div className="detail-block">
                                <h2 className="detail-block-title">
                                    Información general
                                </h2>
                                <div className="detail-row">
                                    <span className="detail-label">Nombre</span>
                                    <span className="detail-value">
                                        {product.name}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">SKU</span>
                                    <span className="detail-value">
                                        {product.sku}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Precio</span>
                                    <span className="detail-value">
                                        {formatPrice(product.price)}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Stock</span>
                                    <span className="detail-value">
                                        {product.stock}
                                    </span>
                                </div>
                            </div>

                            <div className="detail-block">
                                <h2 className="detail-block-title">
                                    Descripción
                                </h2>
                                <p className="detail-description">
                                    {product.description || "Sin descripción"}
                                </p>
                            </div>
                        </div>

                        {/* Columna derecha: metadata */}
                        <div className="product-detail-side">
                            <div className="detail-block side-block">
                                <h2 className="detail-block-title">
                                    Información adicional
                                </h2>
                                <div className="detail-row">
                                    <span className="detail-label">
                                        ID interno
                                    </span>
                                    <span className="detail-value mono">
                                        {product.id}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">
                                        Creado el
                                    </span>
                                    <span className="detail-value">
                                        {product.createdAt || "-"}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">
                                        Actualizado el
                                    </span>
                                    <span className="detail-value">
                                        {product.updatedAt || "-"}
                                    </span>
                                </div>
                            </div>

                            <div className="detail-actions">
                                <div className="detail-actions">
                                    <button
                                        className="btn-secondary"
                                        onClick={() => navigate("/products")}
                                    >
                                        Volver
                                    </button>

                                    <button
                                        className="btn-primary"
                                        onClick={() => navigate(`/products/${id}/edit`)}
                                    >
                                        ✏️ Editar producto
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}