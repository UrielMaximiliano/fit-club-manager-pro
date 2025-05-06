
// Utility functions for formatting data

// Formatear tiempo relativo (ej: "hace 2 horas")
export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 60) {
    return `Hace ${diffMins} minutos`;
  } else if (diffHours < 24) {
    return `Hace ${diffHours} horas`;
  } else {
    return `Hace ${diffDays} días`;
  }
};

// Formatear moneda (ej: "$1,234.56")
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(amount);
};

// Formatear fecha (ej: "15 de marzo, 2023")
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

// Formatear número con separadores de miles (ej: "1,234")
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-MX').format(num);
};
