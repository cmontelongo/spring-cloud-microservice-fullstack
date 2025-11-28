// src/utils/formatters.js

// 🔹 Números enteros con separador de miles
export const formatNumber = (value) => {
  if (value == null || isNaN(value)) return "";
  return Number(value).toLocaleString("es-MX");
};

// 🔹 Monto en moneda (pesos MXN) con 2 decimales
export const formatMoney = (value) => {
  if (value == null || isNaN(value)) return "";
  return Number(value).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// 🔹 Porcentaje con 2 decimales (ej: 12.34%)
export const formatPercent = (value) => {
  if (value == null || isNaN(value)) return "";
  return `${Number(value).toFixed(2)}%`;
};

// 🔹 Formato compacto (ej: 1,2 K / 3,4 M)
export const formatCompact = (value) => {
  if (value == null || isNaN(value)) return "";
  return Number(value).toLocaleString("es-MX", {
    notation: "compact",
    maximumFractionDigits: 1,
  });
};
