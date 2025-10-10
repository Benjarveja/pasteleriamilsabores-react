const clpFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  minimumFractionDigits: 0,
});

export const formatCurrency = (value) => clpFormatter.format(value);
