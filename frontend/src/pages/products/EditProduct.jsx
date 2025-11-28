import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/ProductForm.css"; // 👈 Reutilizamos los estilos del alta

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [sku, setSku] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [loadError, setLoadError] = useState(null);

    // === Validación ===
    const validate = () => {
        const newErrors = {};

        if (!sku.trim()) newErrors.sku = "El SKU es obligatorio";
        if (!name.trim()) newErrors.name = "El nombre es obligatorio";

        if (price === "" || isNaN(price) || Number(price) <= 0) {
            newErrors.price = "Ingresa un precio mayor a 0";
        }

        if (stock === "" || isNaN(stock) || Number(stock) < 0) {
            newErrors.stock = "Ingresa un stock mayor o igual a 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const clearError = (field) => {
        if (!errors[field]) return;
        setErrors((prev) => {
            const copy = { ...prev };
            delete copy[field];
            return copy;
        });
    };

    // === Cargar datos actuales del producto ===
    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                setLoadError(null);

                // 👇 Ajusta esta URL según tu backend / gateway
                const token = localStorage.getItem("accessToken");
                const res = await fetch(`http://localhost:8080/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error("Error cargando producto");
                const data = await res.json();

                // Ejemplo de mock para probar el diseño:
                /*const data = {
                    sku: "PROD-001",
                    name: "Producto de ejemplo",
                    description: "Descripción de ejemplo para edición",
                    price: 1234.56,
                    stock: 5,
                };*/

                setSku(data.sku || "");
                setName(data.name || "");
                setDescription(data.description || "");
                setPrice(data.price != null ? String(data.price) : "");
                setStock(data.stock != null ? String(data.stock) : "");

                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoadError("No se pudo cargar el producto");
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    // === Guardar cambios (PUT) ===
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        const payload = {
            sku,
            name,
            description,
            price: price ? parseFloat(price) : 0,
            stock: stock ? parseInt(stock, 10) : 0,
        };

        try {
            setSaving(true);

            // 👇 Ajusta URL y token según tu backend
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`http://localhost:8080/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Error al actualizar producto");

            console.log("Producto a actualizar:", payload);
            navigate(`/products/${id}`); // vuelve al detalle
        } catch (err) {
            console.error(err);
            alert("Ocurrió un error al actualizar el producto");
        } finally {
            setSaving(false);
        }
    };

    // === UI ===
    if (loading) {
        return (
            <div className="product-form-page">
                <div className="product-form-container">
                    <div className="product-form-card">
                        <p className="product-detail-loading">Cargando producto...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="product-form-page">
                <div className="product-form-container">
                    <div className="product-form-card">
                        <p className="product-detail-error">{loadError}</p>
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

    return (
        <div className="product-form-page">
            <div className="product-form-container">
                {/* Header */}
                <div className="product-form-header">
                    <div>
                        <h1 className="product-form-title">Editar producto</h1>
                        <p className="product-form-subtitle">
                            Actualiza la información del producto
                        </p>
                    </div>
                </div>

                {/* Tarjeta del formulario */}
                <div className="product-form-card">
                    <form className="product-form" onSubmit={handleSubmit}>
                        <div className="form-grid">
                            {/* SKU */}
                            <div className="form-field">
                                <label className="form-label">SKU</label>
                                <input
                                    type="text"
                                    className={
                                        "form-input" +
                                        (errors.sku ? " has-error" : "")
                                    }
                                    value={sku}
                                    onChange={(e) => {
                                        setSku(e.target.value);
                                        clearError("sku");
                                    }}
                                    placeholder="Ej. PROD-001"
                                    required
                                />
                                {errors.sku && (
                                    <p className="form-error">{errors.sku}</p>
                                )}
                            </div>

                            {/* Nombre */}
                            <div className="form-field">
                                <label className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className={
                                        "form-input" +
                                        (errors.name ? " has-error" : "")
                                    }
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        clearError("name");
                                    }}
                                    placeholder="Nombre del producto"
                                    required
                                />
                                {errors.name && (
                                    <p className="form-error">{errors.name}</p>
                                )}
                            </div>

                            {/* Precio */}
                            <div className="form-field">
                                <label className="form-label">Precio</label>
                                <div className="form-input-group">
                                    <span className="form-input-prefix">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={
                                            "form-input with-prefix" +
                                            (errors.price ? " has-error" : "")
                                        }
                                        value={price}
                                        onChange={(e) => {
                                            setPrice(e.target.value);
                                            clearError("price");
                                        }}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                {errors.price && (
                                    <p className="form-error">{errors.price}</p>
                                )}
                            </div>

                            {/* Stock */}
                            <div className="form-field">
                                <label className="form-label">Stock</label>
                                <input
                                    type="number"
                                    className={
                                        "form-input" +
                                        (errors.stock ? " has-error" : "")
                                    }
                                    value={stock}
                                    onChange={(e) => {
                                        setStock(e.target.value);
                                        clearError("stock");
                                    }}
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                                {errors.stock && (
                                    <p className="form-error">{errors.stock}</p>
                                )}
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="form-field">
                            <label className="form-label">Descripción</label>
                            <textarea
                                className={
                                    "form-textarea" +
                                    (errors.description ? " has-error" : "")
                                }
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    clearError("description");
                                }}
                                placeholder="Describe brevemente las características del producto"
                                rows={4}
                            />
                            {errors.description && (
                                <p className="form-error">{errors.description}</p>
                            )}
                        </div>

                        {/* Acciones */}
                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => navigate(`/products/${id}`)}
                                disabled={saving}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={saving}
                            >
                                {saving ? "Guardando cambios..." : "Guardar cambios"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}