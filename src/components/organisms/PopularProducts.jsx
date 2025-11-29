import React, { useMemo, useState } from 'react';
import ProductCard from '../molecules/ProductCard';
import SectionTitle from '../atoms/SectionTitle';
import ProductModal from './ProductModal';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import './PopularProducts.css';

const PopularProducts = () => {
  const { addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products, status } = useProducts();

  const popularProducts = useMemo(() => products.filter((product) => product.popular), [products]);

  const handleAddToCart = (product) => {
    addItem(product);
    if (selectedProduct && selectedProduct.codigo === product.codigo) {
      setSelectedProduct(null);
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => setSelectedProduct(null);

  return (
    <section className="popular-section" id="popular-products">
      <SectionTitle>Nuestros Populares</SectionTitle>
      <p className="popular-section__subtitle">
        Seleccionamos los favoritos de la semana según lo que más están pidiendo nuestros clientes.
      </p>
      {status === 'loaded' && popularProducts.length > 0 ? (
        <div className="productos-grid">
          {popularProducts.map((producto) => (
            <ProductCard
              key={producto.codigo}
              producto={producto}
              onAddToCart={handleAddToCart}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : null}
      <ProductModal
        product={selectedProduct}
        onAddToCart={handleAddToCart}
        onClose={closeModal}
      />
    </section>
  );
};

export default PopularProducts;