import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../css/OrdersList.css";


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


export default function OrdersList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
       const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const resp = await fetch("http://localhost:8080/orders", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!resp.ok) {
                    throw new Error("Error al obtener órdenes");
                }

                const data = await resp.json();
                setOrders(data);
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar las órdenes");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);


     if (loading) return <div className="p-8">Cargando órdenes...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;

    return (
   <div className="orders-page">
      <div className="orders-card">
        <div className="orders-header">
          <div>
            <h1>Órdenes</h1>
            <p className="orders-subtitle">
              Consulta el historial de órdenes generadas en el sistema.
            </p>
          </div>

          <Link to="/orders/new" className="orders-new-btn">
            + Nueva Orden
          </Link>
        </div>

        {loading ? (
          <p className="orders-empty">Cargando órdenes...</p>
        ) : orders.length === 0 ? (
          <p className="orders-empty">
            No hay órdenes registradas aún. Crea la primera con el botón{" "}
            <b>Nueva Orden</b>.
          </p>
        ) : (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th className="col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.customerName || o.customer || "-"}</td>
                    <td>
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleString("es-MX")
                        : "-"}
                    </td>
                    <td>{formatCurrency(o.total)}</td>
                    <td>
                      <span className={getStatusClass(o.status)}>
                        {o.status || "N/A"}
                      </span>
                    </td>
                    <td className="col-actions">
                      <Link
                        to={`/orders/${o.id}`}
                        className="orders-view-link"
                      >
                        Ver detalle
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
    );
}