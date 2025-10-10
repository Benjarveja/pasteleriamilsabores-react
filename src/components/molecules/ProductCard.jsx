import React from 'react';
import Button from '../atoms/Button';
import './ProductCard.css';

const ProductCard = ({ producto, onAddToCart, onViewDetails }) => {
  const { codigo, nombre, categoria, precio, imagen } = producto;

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(producto);
    }
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();
    if (onAddToCart) {
      onAddToCart(producto);
    }
  };

  return (
    <article className="producto-card" data-id={codigo} onClick={handleViewDetails}>
      <img src={imagen} alt={nombre} loading="lazy" />
      <h3>{nombre}</h3>
      <p className="producto-card__category">{categoria}</p>
      <p className="producto-card__price">${precio.toLocaleString('es-CL')} CLP</p>
      <div className="producto-card__actions">
        <Button variant="primary" size="sm" onClick={handleAddToCart}>
          Agregar al carrito
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;
