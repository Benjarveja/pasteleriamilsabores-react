const buildProductsIndex = (products) => {
  const index = new Map();
  products.forEach((product) => {
    index.set(product.codigo, product);
  });
  return index;
};

export const buildPurchaseSummary = ({ orders, userId, products }) => {
  if (!userId || !orders || orders.length === 0) {
    return [];
  }

  const productIndex = products ? buildProductsIndex(products) : new Map();
  const accumulator = new Map();

  orders
    .filter((order) => order.userId === userId)
    .forEach((order) => {
      order.items.forEach((item) => {
        const existing = accumulator.get(item.codigo);
        const quantity = Number(item.cantidad) || 0;
        const lineTotal = (Number(item.precio) || 0) * quantity;
        if (existing) {
          existing.cantidad += quantity;
          existing.total += lineTotal;
          const previousDate = new Date(existing.ultimaCompra);
          const currentDate = new Date(order.placedAt);
          if (currentDate > previousDate) {
            existing.ultimaCompra = order.placedAt;
          }
        } else {
          const product = productIndex.get(item.codigo);
          const fallbackName = `Producto${item.codigo ? ` ${item.codigo}` : ''}`;
          accumulator.set(item.codigo, {
            codigo: item.codigo,
            nombre: product?.nombre ?? item.nombre ?? fallbackName,
            imagen: product?.imagen,
            cantidad: quantity,
            total: lineTotal,
            ultimaCompra: order.placedAt,
          });
        }
      });
    });

  return Array.from(accumulator.values()).sort((a, b) => {
    if (b.cantidad === a.cantidad) {
      return new Date(b.ultimaCompra) - new Date(a.ultimaCompra);
    }
    return b.cantidad - a.cantidad;
  });
};

export const getRecommendedProducts = ({ summary, products, limit = 4 }) => {
  if (!summary || summary.length === 0) {
    return [];
  }

  const productIndex = buildProductsIndex(products);
  const ranked = summary.slice(0, limit);

  return ranked
    .map((entry) => {
      const product = productIndex.get(entry.codigo);
      if (!product) {
        return null;
      }
      return {
        ...product,
        recomendado: true,
        recommendationMeta: {
          cantidad: entry.cantidad,
          ultimaCompra: entry.ultimaCompra,
          totalGastado: entry.total,
        },
      };
    })
    .filter(Boolean);
};
