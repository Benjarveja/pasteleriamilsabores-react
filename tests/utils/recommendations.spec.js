import { buildPurchaseSummary, getRecommendedProducts } from '../../src/utils/recommendations.js';

describe('recommendations utilities', () => {
  const productsCatalog = [
    { codigo: 'A1', nombre: 'Torta Tres Leches', imagen: '/img/a1.jpg', categoria: 'Tortas' },
    { codigo: 'B2', nombre: 'Pie de Limón', imagen: '/img/b2.jpg', categoria: 'Pies' },
    { codigo: 'C3', nombre: 'Cheesecake', imagen: '/img/c3.jpg', categoria: 'Cheesecake' },
  ];

  const orders = [
    {
      id: 'order-1',
      userId: 'user-1',
      placedAt: '2025-02-10T10:00:00Z',
      items: [
        { codigo: 'A1', cantidad: 1, precio: 10000 },
        { codigo: 'B2', cantidad: 2, precio: 5000 },
      ],
    },
    {
      id: 'order-2',
      userId: 'user-1',
      placedAt: '2025-02-20T10:00:00Z',
      items: [
        { codigo: 'B2', cantidad: 1, precio: 5000 },
        { codigo: 'C3', cantidad: 4, precio: 6000 },
      ],
    },
    {
      id: 'order-3',
      userId: 'user-2',
      placedAt: '2025-01-01T10:00:00Z',
      items: [{ codigo: 'A1', cantidad: 10, precio: 12000 }],
    },
  ];

  it('construye el resumen de compras agregando cantidades y ordenando por popularidad', () => {
    const summary = buildPurchaseSummary({ orders, userId: 'user-1', products: productsCatalog });

    expect(summary.length).toBe(3);
    expect(summary[0].codigo).toBe('C3');
    expect(summary[0].cantidad).toBe(4);
    expect(summary[1].codigo).toBe('B2');
    expect(summary[1].cantidad).toBe(3);
    expect(summary[1].total).toBe(15000);
    expect(summary[2].codigo).toBe('A1');
    expect(summary[2].ultimaCompra).toBe('2025-02-10T10:00:00Z');
  });

  it('usa valores por defecto cuando el catálogo no tiene el producto', () => {
    const summary = buildPurchaseSummary({
      orders: [
        {
          id: 'order-x',
          userId: 'user-3',
          placedAt: '2025-03-01T09:00:00Z',
          items: [{ codigo: 'Z9', cantidad: 1, precio: 9000 }],
        },
      ],
      userId: 'user-3',
      products: [],
    });

    expect(summary[0]).toEqual(
      jasmine.objectContaining({
        codigo: 'Z9',
        nombre: 'Producto Z9',
        imagen: undefined,
      }),
    );
  });

  it('limita resultados y adjunta metadatos en recomendaciones finales', () => {
    const summary = buildPurchaseSummary({ orders, userId: 'user-1', products: productsCatalog });
    const recommendations = getRecommendedProducts({ summary, products: productsCatalog, limit: 2 });

    expect(recommendations.length).toBe(2);
    expect(recommendations[0]).toEqual(
      jasmine.objectContaining({
        codigo: 'C3',
        recomendado: true,
        recommendationMeta: jasmine.objectContaining({ cantidad: 4, totalGastado: 24000 }),
      }),
    );
    expect(recommendations.some((item) => item.codigo === 'A1')).toBeFalse();
  });

  it('retorna arreglo vacío cuando no hay datos suficientes', () => {
    expect(buildPurchaseSummary({ orders: [], userId: 'user-1', products: productsCatalog })).toEqual([]);
    expect(getRecommendedProducts({ summary: [], products: productsCatalog })).toEqual([]);
  });
});
