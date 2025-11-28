import { Link , useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import "../../css/OrderDetails.css";


function formatCurrency(value) {
    if (value == null || isNaN(value)) return "-";
    return Number(value).toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
    });
}

function getStatusClass(status) {
    if (!status) return "status-badge status-default";
    const s = status.toString().toLowerCase();

    if (s.includes("complet") || s.includes("pag")) {
        return "status-badge status-success";
    }
    if (s.includes("pend")) {
        return "status-badge status-warning";
    }
    if (s.includes("cancel") || s.includes("rech")) {
        return "status-badge status-danger";
    }
    return "status-badge status-default";
}


export default function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await fetch(`http://localhost:8080/orders/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Error obteniendo la orden");
                }

                const data = await response.json();
                setOrder(data);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="order-page">
                <div className="order-card">
                    <p className="order-loading">Cargando orden...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="order-page">
                <div className="order-card">
                    <p className="order-loading">No se encontró la orden.</p>
                    <div className="order-footer">
                        <Link to="/orders" className="order-back-btn">
                            ← Volver al listado
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const createdDate = order.createdAt
        ? new Date(order.createdAt).toLocaleString("es-MX")
        : "-";

    const items = order.items || [];

    const itemsTotal = items.reduce(
        (acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 0),
        0
    );


    return (
        <div className="order-page">
            <div className="order-card">
                {/* Encabezado */}
                <div className="order-header">
                    <div>
                        <p className="order-breadcrumb">
                            <Link to="/orders">Órdenes</Link> / Detalle
                        </p>
                        <h1>Orden #{order.id}</h1>
                        <p className="order-subtitle">Generada el {createdDate}</p>
                    </div>
                    <span className={getStatusClass(order.status)}>
                        {order.status || "N/A"}
                    </span>
                </div>

                {/* Resumen principal */}
                <div className="order-summary-grid">
                    <div className="order-summary-box">
                        <h2>Cliente</h2>
                        <p className="order-summary-main">
                            {order.customerName || order.customer || "-"}
                        </p>
                        {order.customerEmail && (
                            <p className="order-muted">{order.customerEmail}</p>
                        )}
                    </div>

                    <div className="order-summary-box">
                        <h2>Total</h2>
                        <p className="order-total">{formatCurrency(order.total)}</p>
                        <p className="order-muted">
                            Subtotal calculado: {formatCurrency(itemsTotal)}
                        </p>
                    </div>

                    <div className="order-summary-box">
                        <h2>Información</h2>
                        <p>
                            <span className="order-label">Fecha:</span> {createdDate}
                        </p>
                        {order.paymentMethod && (
                            <p>
                                <span className="order-label">Pago:</span>{" "}
                                {order.paymentMethod}
                            </p>
                        )}
                    </div>
                </div>

                {/* Items */}
                <div className="order-items-section">
                    <h2>Productos de la orden</h2>
                    {items.length === 0 ? (
                        <p className="order-empty-items">
                            Esta orden no tiene productos registrados.
                        </p>
                    ) : (
                        <div className="order-items-table-wrapper">
                            <table className="order-items-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio unitario</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => {
                                        const subtotal =
                                            (Number(item.price) || 0) *
                                            (Number(item.quantity) || 0);
                                        return (
                                            <tr key={item.id || index}>
                                                <td>{index + 1}</td>
                                                <td>{item.productName || item.name || "-"}</td>
                                                <td>{item.quantity}</td>
                                                <td>{formatCurrency(item.price)}</td>
                                                <td>{formatCurrency(subtotal)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="order-footer">
                    <Link to="/orders" className="order-back-btn">
                        ← Volver al listado
                    </Link>
                </div>
            </div>
        </div>
    );
}