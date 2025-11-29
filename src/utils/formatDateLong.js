const LONG_FORMATTER = new Intl.DateTimeFormat('es-CL', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const SHORT_FALLBACK_FORMATTER = new Intl.DateTimeFormat('es-CL', {
  dateStyle: 'short',
  timeStyle: 'short',
});

export const formatDateLong = (value) => {
  if (!value) {
    return '';
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  try {
    return LONG_FORMATTER.format(date);
  } catch (error) {
    console.warn('[formatDateLong] Falling back due to error:', error);
    return SHORT_FALLBACK_FORMATTER.format(date);
  }
};

