import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderForm() {
    const navigate = useNavigate();

    const [customer, setCustomer] = useState("");
    const [items, setItems] = useState([{ productId: "", quantity: 1, price: 0 }]);
    const [products, setProducts] = useState([]); // 🔹 productos disponibles
    const [total, setTotal] = useState(0);

    // ================================
    // ✔ Obtener lista de productos
    // ================================
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const res = await fetch("http://localhost:8080/products", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                    }
                });

                if (!res.ok) throw new Error("Error cargando productos");

                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error(err);
                alert("No se pudieron cargar los productos");
            }
        };

        loadProducts();
    }, []);


    // ================================
    // ✔ Recalcular TOTAL
    // ================================
    const recalcTotal = (itemsList) => {
        const sum = itemsList.reduce((acc, item) => {
            return acc + item.quantity * item.price;
        }, 0);

        setTotal(sum);
    };


    // ================================
    // ✔ Actualizar item correctamente
    // ================================
    const updateItem = (index, field, value) => {
        const updated = [...items];

        if (field === "productId") {
            updated[index].productId = Number(value);

            // Buscar el producto seleccionado
            const product = products.find(p => p.id === Number(value));

            if (product) {
                updated[index].price = product.price; // 🟢 asignar precio
            } else {
                updated[index].price = 0;
            }
        }

        if (field === "quantity") {
            updated[index].quantity = Number(value);
        }

        setItems(updated);
        recalcTotal(updated); // 🟢 Recalcular total después de actualizar
    };
    
    // Agregar nueva línea
    const addItem = () => {
        const updated = [...items, { productId: "", quantity: 1, price: 0 }];
        setItems(updated);
        recalcTotal(updated);
    };

    // Eliminar línea
    const removeItem = (index) => {
        const updated = items.filter((_, i) => i !== index);
        setItems(updated);
        recalcTotal(updated);
    };

    // ================================
    // ✔ Enviar orden
    // ================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const order = {
            customer,
            items: items.map(i => ({
                productId: i.productId,
                quantity: i.quantity,
                price: i.price
            })),
            total
        };

        try {
            const res = await fetch("http://localhost:8080/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify(order)
            });

            if (!res.ok) throw new Error("Error creando la orden");

            navigate("/orders");

        } catch (err) {
            console.error(err);
            alert("Error al guardar la orden");
        }
    };

    
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Nueva Orden</h1>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* CLIENTE */}
                <div>
                    <label className="block font-semibold">Cliente:</label>
                    <input
                        type="text"
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                        className="border px-3 py-2 rounded w-full"
                        required
                    />
                </div>

                {/* PRODUCTOS */}
                <div>
                    <label className="block font-semibold mb-2">Productos:</label>

                    {items.map((item, index) => (
                        <div key={index} className="flex gap-3 mb-2 items-center">

                            {/* SELECT DE PRODUCTOS */}
                            <select
                                className="border px-3 py-2 rounded w-1/3"
                                value={item.productId}
                                onChange={(e) =>
                                    updateItem(index, "productId", e.target.value)
                                }
                                required
                            >
                                <option value="">Seleccionar producto...</option>

                                {products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} (${p.price})
                                    </option>
                                ))}
                            </select>

                            {/* CANTIDAD */}
                            <input
                                type="number"
                                min="1"
                                className="border px-3 py-2 rounded w-20"
                                value={item.quantity}
                                onChange={(e) =>
                                    updateItem(index, "quantity", e.target.value)
                                }
                            />

                            {/* PRECIO */}
                            <p className="w-24 text-right">
                                ${item.price.toFixed(2)}
                            </p>

                            {/* SUBTOTAL */}
                            <p className="w-28 text-right font-semibold">
                                {(item.quantity * item.price).toFixed(2)}
                            </p>

                            {index > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="text-red-600 text-xl"
                                >
                                    ✖
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addItem}
                        className="bg-blue-500 text-white px-4 py-1 rounded mt-2"
                    >
                        + Agregar Producto
                    </button>
                </div>

                {/* TOTAL */}
                <div className="text-right text-xl font-bold mt-4">
                    Total: ${total.toFixed(2)}
                </div>

                <button className="bg-green-600 text-white px-4 py-2 rounded-xl">
                    Guardar Orden
                </button>
            </form>
        </div>
    );
}