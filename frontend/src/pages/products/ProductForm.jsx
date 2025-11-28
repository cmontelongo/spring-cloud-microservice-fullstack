import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/ProductForm.css";

export default function ProductForm() {
    const navigate = useNavigate();

    const [sku, setSku] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({}); // 👈 errores por campo

    // --- Validación de campos ---
    const validate = () => {
        const newErrors = {};

        if (!sku.trim()) {
            newErrors.sku = "El SKU es obligatorio";
        }

        if (!name.trim()) {
            newErrors.name = "El nombre es obligatorio";
        }

        if (price === "" || isNaN(price) || Number(price) <= 0) {
            newErrors.price = "Ingresa un precio mayor a 0";
        }

        if (stock === "" || isNaN(stock) || Number(stock) < 0) {
            newErrors.stock = "Ingresa un stock mayor o igual a 0";
        }

        // descripción opcional, pero si quieres:
        // if (!description.trim()) {
        //     newErrors.description = "La descripción es obligatoria";
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return; // 👈 no mandamos el POST si hay errores
        }

        const payload = {
            sku,
            name,
            description,
            price: price ? parseFloat(price) : 0,
            stock: stock ? parseInt(stock, 10) : 0,
        };

        try {
            setLoading(true);

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
        } catch (err) {
            console.error(err);
            alert("Ocurrió un error al guardar el producto");
        } finally {
            setLoading(false);
        }
    };

    // Helper para limpiar error de un campo al escribir
    const clearError = (field) => {
        if (!errors[field]) return;
        setErrors((prev) => {
            const copy = { ...prev };
            delete copy[field];
            return copy;
        });
    };

    return (
        <div className="product-form-page">
            <div className="product-form-container">
                <div className="product-form-header">
                    <div>
                        <h1 className="product-form-title">Nuevo Producto</h1>
                        <p className="product-form-subtitle">
                            Registra un nuevo producto en el catálogo
                        </p>
                    </div>
                </div>

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

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => navigate("/products")}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading ? "Guardando..." : "Guardar Producto"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}