import { LogoutButton } from "../components/LogoutButton";
import { Link } from "react-router-dom";
import { Bar, Line } from "react-chartjs-2";
import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [sales, setSales] = useState(null);
  const [stock, setStock] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const summaryRes = await fetchDashboardData();
        const salesRes = await fetchMonthlySales();
        const stockRes = await fetchStockData();

        setSummary(summaryRes);
        setSales(salesRes);
        setStock(stockRes);

      } catch (error) {
        console.error("Error cargando dashboard:", error);
      }
    }

    loadData();
  }, []);

  return (
    <div className="dashboard">
      <h1 className="title">Dashboard</h1>

      {/* Botones */}
      <div className="dashboard-links">
        <Link to="/products" className="btn btn-primary">Productos</Link>
        <Link to="/orders" className="btn btn-success">Órdenes</Link>
      </div>

      <LogoutButton />
    </div>
  );
}
