import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import { formatNumber, formatMoney } from "../utils/formatters";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (e) {
      console.error("Error al cargar estadísticas:", e);
    }
  };

  if (!stats) {
    return (
      <div className="dashboard-container">
        <h1 className="dashboard-title">Dashboard</h1>
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  // Datos para gráfica de barras
  const barData = [
    { name: "Productos", value: stats.totalProducts },
    { name: "Sin stock", value: stats.outOfStockProducts },
    { name: "Órdenes", value: stats.totalOrders },
  ];

  // Datos para gráfica de pastel (stock vs sin stock)
  const inStock = stats.totalProducts - stats.outOfStockProducts;
  const pieData = [
    { name: "Con stock", value: inStock < 0 ? 0 : inStock },
    { name: "Sin stock", value: stats.outOfStockProducts },
  ];

  const pieColors = ["#2563eb", "#f97316"];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard general</h1>

      <div className="cards-container">
        <div className="card">
          <h3>Total de productos</h3>
          <div className="card-number">{formatNumber(stats.totalProducts)}</div>
        </div>

        <div className="card">
          <h3>Sin stock</h3>
          <div className="card-number">{formatNumber(stats.outOfStockProducts)}</div>
        </div>

        <div className="card">
          <h3>Total de órdenes</h3>
          <div className="card-number">{formatNumber(stats.totalOrders)}</div>
        </div>

        <div className="card">
          <h3>Ventas totales</h3>
          <div className="card-number">{formatMoney(stats.totalSales)}</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-box">
          <h2 className="chart-title">Resumen de métricas</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica de pastel */}
        <div className="chart-box">
          <h2 className="chart-title">Productos con / sin stock</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
