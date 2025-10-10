import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

const CartContext = createContext();
const STORAGE_KEY = 'milSaboresCart';

const loadInitialCart = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error parsing cart from storage', error);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadInitialCart);
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const notificationTimeout = useRef();

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => () => {
    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
    }
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
    }
    notificationTimeout.current = setTimeout(() => {
      setNotification(null);
    }, 2500);
  };

  const addItem = (product) => {
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.codigo === product.codigo);
      if (existing) {
        return prevItems.map((item) =>
          item.codigo === product.codigo
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }
      return [...prevItems, { ...product, cantidad: 1 }];
    });
    showNotification('¡Producto añadido al carrito!');
  };

  const removeItem = (codigo) => {
    setItems((prevItems) => prevItems.filter((item) => item.codigo !== codigo));
  };

  const updateQuantity = (codigo, delta) => {
    setItems((prevItems) =>
      prevItems
        .map((item) =>
          item.codigo === codigo ? { ...item, cantidad: item.cantidad + delta } : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);
  const dismissNotification = () => {
    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
    }
    setNotification(null);
  };

  const summary = useMemo(() => {
    const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);
    const total = items.reduce((acc, item) => acc + item.cantidad * item.precio, 0);
    return { totalItems, total };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      ...summary,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      notification,
      dismissNotification,
    }),
    [items, summary, isOpen, notification],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
