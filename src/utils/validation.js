export const normalizeString = (value = '') => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

export const normalizeRun = (value = '') =>
  value
    .replace(/\./g, '')
    .replace(/-/g, '')
    .toUpperCase()
    .trim();

export const formatRun = (value = '') => {
  const cleaned = normalizeRun(value);
  if (cleaned.length < 2) return value.trim();
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  const reversed = body.split('').reverse().join('');
  const grouped = reversed.replace(/(.{3})/g, '$1.').split('').reverse().join('').replace(/^\./, '');
  return `${grouped}-${dv}`;
};

export const isValidRun = (value = '') => {
  const cleaned = normalizeRun(value);
  if (cleaned.length < 2) return false;
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  if (!/^[0-9]+$/.test(body)) return false;
  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i -= 1) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  let expected = 11 - (sum % 11);
  if (expected === 11) expected = '0';
  else if (expected === 10) expected = 'K';
  else expected = expected.toString();
  return expected === dv;
};

const EMAIL_PATTERN = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/i;

export const isValidEmail = (value = '') => EMAIL_PATTERN.test(value.trim());

export const normalizePhone = (value = '') => value.replace(/[^0-9]/g, '');

export const isValidChileanPhone = (value = '') => /^9\d{8}$/.test(normalizePhone(value));

export const isValidBirthDate = (value = '', { allowFuture = false } = {}) => {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  if (allowFuture) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const candidate = new Date(date.getTime());
  candidate.setHours(0, 0, 0, 0);
  return candidate <= today;
};

export const hasMinLength = (value = '', length = 1) => value.trim().length >= length;

export const isNonEmpty = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value && value.toString().trim());
};
