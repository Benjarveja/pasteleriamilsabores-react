import {
  normalizeString,
  normalizeRun,
  formatRun,
  isValidRun,
  isValidEmail,
  normalizePhone,
  isValidChileanPhone,
  isValidBirthDate,
  hasMinLength,
  isNonEmpty,
} from '../../src/utils/validation.js';

describe('validation utilities', () => {
  it('normaliza textos eliminando acentos y espacios extra', () => {
    expect(normalizeString('  Ñandú Azúcar  ')).toBe('Nandu Azucar');
  });

  it('normaliza y formatea RUN chilenos', () => {
    const raw = '12.345.678-5';
    const normalized = normalizeRun(raw);
    expect(normalized).toBe('123456785');
    expect(formatRun(raw)).toBe('12.345.678-5');
    expect(isValidRun(raw)).toBeTrue();
    expect(isValidRun('12.345.678-4')).toBeFalse();
  });

  it('valida correos y teléfonos chilenos', () => {
    expect(isValidEmail('persona@mail.cl')).toBeTrue();
    expect(isValidEmail('correo@invalido')).toBeFalse();

    expect(normalizePhone('+56 9 1234 5678')).toBe('56912345678');
    expect(isValidChileanPhone('912345678')).toBeTrue();
    expect(isValidChileanPhone('12345678')).toBeFalse();
  });

  it('valida fechas de nacimiento con opción de permitir fechas futuras', () => {
    const todayIso = new Date().toISOString().split('T')[0];
    const future = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    expect(isValidBirthDate(todayIso)).toBeTrue();
    expect(isValidBirthDate(future)).toBeFalse();
    expect(isValidBirthDate(future, { allowFuture: true })).toBeTrue();
  });

  it('valida longitud mínima y valores no vacíos', () => {
    expect(hasMinLength('   hola   ', 4)).toBeTrue();
    expect(hasMinLength('   ho   ', 3)).toBeFalse();

    expect(isNonEmpty('texto')).toBeTrue();
    expect(isNonEmpty('   ')).toBeFalse();
    expect(isNonEmpty(['item'])).toBeTrue();
    expect(isNonEmpty([])).toBeFalse();
  });
});
