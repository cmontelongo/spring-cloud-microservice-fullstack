import { getToken } from "../utils/auth";  // O donde manejes tus tokens

const API_URL = "http://localhost:8080";  // Ajusta si tu gateway usa otro

export async function fetchDashboardData() {
  const token = getToken();

  const res = await fetch(`${API_URL}/dashboard/summary`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  });

  if (!res.ok) throw new Error("Error obteniendo dashboard");

  return res.json();
}

export async function fetchMonthlySales() {
  const token = getToken();

  const res = await fetch(`${API_URL}/dashboard/sales`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  });

  if (!res.ok) throw new Error("Error obteniendo ventas mensuales");

  return res.json();
}

export async function fetchStockData() {
  const token = getToken();

  const res = await fetch(`${API_URL}/products/stock-summary`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  });

  if (!res.ok) throw new Error("Error obteniendo stock");

  return res.json();
}
