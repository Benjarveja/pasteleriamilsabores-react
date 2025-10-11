import React, { useMemo, useState } from 'react';
import SectionTitle from '../atoms/SectionTitle';
import Button from '../atoms/Button';
import ProductModal from './ProductModal';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import products from '../../data/products';
import { buildPurchaseSummary, getRecommendedProducts } from '../../utils/recommendations';
import { formatCurrency } from '../../utils/formatCurrency';
import './RecommendedProducts.css';

const formatDate = (value) =>
  new Date(value).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

const RecommendedProducts = () => {
  const { user, orders } = useAuth();
  const { addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const recommendedProducts = useMemo(() => {
    if (!user) {
      return [];
    }
    const summary = buildPurchaseSummary({ orders, userId: user.id, products });
    return getRecommendedProducts({ summary, products, limit: 4 });
  }, [orders, user]);

  if (!user || recommendedProducts.length === 0) {
    return null;
  }

  const sanitizeProduct = (product) => {
    if (!product) return null;
    // eslint-disable-next-line no-unused-vars
    const { recommendationMeta, recomendado, ...rest } = product;
    return rest;
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(sanitizeProduct(product));
  };

  const handleCloseModal = () => setSelectedProduct(null);

  const handleAddToCart = (product) => {
    addItem(sanitizeProduct(product));
    setSelectedProduct(null);
  };

  return (
    <section className="recommended-products" aria-labelledby="recommended-products-title">
      <SectionTitle align="left" as="h2" id="recommended-products-title">
        Recomendado para ti
      </SectionTitle>
      <p className="recommended-products__subtitle">
        Basado en lo que has encargado recientemente en Mil Sabores.
      </p>
      <div className="recommended-products__grid">
        {recommendedProducts.map((product) => (
          <article key={product.codigo} className="recommended-products__card">
            <button
              type="button"
              className="recommended-products__image"
              onClick={() => handleViewDetails(product)}
              aria-label={`Ver detalles de ${product.nombre}`}
            >
              <img src={product.imagen} alt={product.nombre} loading="lazy" />
            </button>
            <div className="recommended-products__content">
              <header>
                <h3>{product.nombre}</h3>
                <span>{formatCurrency(product.precio)}</span>
              </header>
              <dl className="recommended-products__meta">
                <div>
                  <dt>Última compra</dt>
                  <dd>{formatDate(product.recommendationMeta.ultimaCompra)}</dd>
                </div>
                <div>
                  <dt>Veces encargada</dt>
                  <dd>{product.recommendationMeta.cantidad}</dd>
                </div>
                <div>
                  <dt>Total invertido</dt>
                  <dd>{formatCurrency(product.recommendationMeta.totalGastado)}</dd>
                </div>
              </dl>
              <div className="recommended-products__actions">
                <Button variant="ghost" size="sm" onClick={() => handleViewDetails(product)}>
                  Ver detalles
                </Button>
                <Button variant="primary" size="sm" onClick={() => handleAddToCart(product)}>
                  Agregar al carrito
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <ProductModal product={selectedProduct} onAddToCart={handleAddToCart} onClose={handleCloseModal} />
    </section>
  );
};

export default RecommendedProducts;
