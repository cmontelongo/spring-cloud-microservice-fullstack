import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";


export default function OrderDetails() {
    const { id } = useParams();

    const [order, setOrder] = useState(null);

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
            }
        };

        fetchOrder();
    }, [id]);

    if (!order) return <p>Cargando...</p>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Orden #{order.id}</h1>

            <div className="mt-4 bg-white p-4 shadow rounded">
                <p><strong>Cliente:</strong> {order.customer}</p>
                <p><strong>Total:</strong> ${order.total}</p>
            </div>

            <h2 className="text-xl font-semibold mt-6">Items</h2>

            <div className="mt-2 space-y-3">
                {order.items.map((item, idx) => (
                    <div key={idx} className="border p-3 rounded">
                        <p><strong>Producto:</strong> {item.name}</p>
                        <p><strong>Cantidad:</strong> {item.quantity}</p>
                        <p><strong>Precio:</strong> ${item.price}</p>
                        <p><strong>Subtotal:</strong> ${item.price * item.quantity}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}