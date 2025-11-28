import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


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
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Órdenes</h1>

            <Link
                to="/orders/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl mb-4 inline-block"
            >
                Nueva Orden
            </Link>

            <ul className="space-y-2">
                {orders.map((o) => (
                    <li
                        key={o.id}
                        className="border p-4 rounded-xl flex justify-between"
                    >
                        <span>Orden #{o.id}</span>
                        <Link
                            to={`/orders/${o.id}`}
                            className="text-blue-600"
                        >
                            Ver
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}