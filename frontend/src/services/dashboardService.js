
const API_URL = "http://localhost:8080";  // Ajusta si tu gateway usa otro
const token = localStorage.getItem("accessToken");

export async function getDashboardStats() {
    const res = await fetch("http://localhost:8080/dashboard", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error("Error obteniendo estadísticas del dashboard");
    }

    return res.json();
}
