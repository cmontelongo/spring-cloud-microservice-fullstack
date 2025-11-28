import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../css/OrderForm.css";

function formatCurrency(value) {
  if (value == null || isNaN(value)) return "-";
  return Number(value).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  });
}

export default function OrderForm() {
    const navigate = useNavigate();

    const [customer, setCustomer] = useState("");
    const [items, setItems] = useState([{ productId: "", quantity: 1, price: 0 }]);
    const [products, setProducts] = useState([]); // 🔹 productos disponibles
    const [total, setTotal] = useState(0);
    const [saving, setSaving] = useState(false);

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
  useEffect(() => {
    const newTotal = items.reduce((acc, it) => {
      const price = Number(it.price) || 0;
      const qty = Number(it.quantity) || 0;
      return acc + price * qty;
    }, 0);
    setTotal(newTotal);
  }, [items]);


  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== index) return it;

        if (field === "productId") {
          const product = products.find((p) => String(p.id) === value);
          return {
            ...it,
            productId: value,
            // si tu producto trae price, úsalo aquí
            price: product ? product.price : it.price,
          };
        }

        return { ...it, [field]: value };
      })
    );
  };

  const handleAddItem = () => {
    setItems((prev) => [...prev, { productId: "", quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
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
    <div className="order-form-page">
      <div className="order-form-card">
        <div className="order-form-header">
          <div>
            <p className="order-form-breadcrumb">
              <Link to="/orders">Órdenes</Link> / Nueva orden
            </p>
            <h1>Crear nueva orden</h1>
            <p className="order-form-subtitle">
              Captura el cliente y los productos para generar una nueva orden.
            </p>
          </div>
          <div className="order-form-summary-mini">
            <span>Total actual</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="order-form-grid">
            {/* Columna izquierda: datos generales + items */}
            <div className="order-form-left">
              {/* Datos generales */}
              <div className="order-form-section">
                <h2>Datos del cliente</h2>

                <div className="order-form-field">
                  <label className="order-form-label">Cliente</label>
                  <input
                    type="text"
                    className="order-form-input"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    placeholder="ID o nombre del cliente"
                    required
                  />
                </div>
              </div>

              {/* Items */}
              <div className="order-form-section">
                <h2>Productos</h2>
                <p className="order-form-help">
                  Agrega uno o más productos a la orden. El total se calcula
                  automáticamente.
                </p>

                <div className="order-form-items-wrapper">
                  <table className="order-form-items-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => {
                        const price = Number(item.price) || 0;
                        const qty = Number(item.quantity) || 0;
                        const subtotal = price * qty;

                        return (
                          <tr key={index}>
                            <td>
                              <select
                                className="order-form-select"
                                value={item.productId}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "productId",
                                    e.target.value
                                  )
                                }
                                required
                              >
                                <option value="">Selecciona un producto</option>
                                {products.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <input
                                type="number"
                                min="1"
                                className="order-form-input order-form-input-qty"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </td>
                            <td className="order-form-col-right">
                              {formatCurrency(item.price)}
                            </td>
                            <td className="order-form-col-right">
                              {formatCurrency(subtotal)}
                            </td>
                            <td className="order-form-col-center">
                              {items.length > 1 && (
                                <button
                                  type="button"
                                  className="order-form-remove-item"
                                  onClick={() => handleRemoveItem(index)}
                                >
                                  ✕
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <button
                    type="button"
                    className="order-form-add-item"
                    onClick={handleAddItem}
                  >
                    + Agregar producto
                  </button>
                </div>
              </div>
            </div>

            {/* Columna derecha: resumen */}
            <div className="order-form-right">
              <div className="order-form-summary-card">
                <h2>Resumen</h2>
                <div className="order-form-summary-row">
                  <span>Productos</span>
                  <span>{items.length}</span>
                </div>
                <div className="order-form-summary-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                <div className="order-form-summary-total">
                  <span>Total a pagar</span>
                  <strong>{formatCurrency(total)}</strong>
                </div>

                <p className="order-form-summary-note">
                  Revisa los datos antes de guardar la orden. Podrás ver el
                  detalle completo en el listado de órdenes.
                </p>
              </div>
            </div>
          </div>

          <div className="order-form-actions">
            <Link to="/orders" className="order-form-btn-cancel">
              Cancelar
            </Link>
            <button
              type="submit"
              className="order-form-btn-submit"
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar orden"}
            </button>
          </div>
        </form>
      </div>
    </div>
    );
}