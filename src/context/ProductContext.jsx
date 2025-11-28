import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { productService } from '../services/productService';

const ProductContext = createContext({
  products: [],
  categories: [],
  priceBounds: { min: 0, max: 0 },
  status: 'idle',
  error: null,
  refresh: async () => {},
  findByCode: () => null,
});

const computeBounds = (items) => {
  if (!items.length) return { min: 0, max: 0 };
  return items.reduce(
    (acc, product) => ({
      min: Math.min(acc.min, product.precio),
      max: Math.max(acc.max, product.precio),
    }),
    { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
  );
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 0 });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const [items, remoteCategories] = await Promise.all([
        productService.getAll(),
        productService.getCategories(),
      ]);
      setProducts(items);
      setCategories(remoteCategories);
      const bounds = computeBounds(items);
      setPriceBounds({
        min: bounds.min === Number.POSITIVE_INFINITY ? 0 : bounds.min,
        max: bounds.max === Number.NEGATIVE_INFINITY ? 0 : bounds.max,
      });
      setStatus('loaded');
    } catch (err) {
      setError(err.message || 'No pudimos cargar el catálogo.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const formattedCategories = useMemo(
    () => categories.map((categoria) => ({
      id: categoria.toLowerCase().replace(/[^a-z0-9]+/gi, '-'),
      label: categoria,
      value: categoria,
    })),
    [categories],
  );

  const normalizedBounds = useMemo(() => priceBounds, [priceBounds]);

  const findByCode = useCallback(
    (codigo) => products.find((product) => product.codigo === codigo) ?? null,
    [products],
  );

  const value = useMemo(
    () => ({
      products,
      categories: formattedCategories,
      priceBounds: normalizedBounds,
      status,
      error,
      refresh: loadProducts,
      findByCode,
    }),
    [products, formattedCategories, normalizedBounds, status, error, loadProducts, findByCode],
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts debe utilizarse dentro de ProductProvider');
  }
  return context;
};
