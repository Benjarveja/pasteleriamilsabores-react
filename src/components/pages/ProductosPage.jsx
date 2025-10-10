import React, { useMemo, useState } from 'react';
import SectionTitle from '../atoms/SectionTitle';
import Button from '../atoms/Button';
import ProductFilters from '../molecules/ProductFilters';
import ProductCard from '../molecules/ProductCard';
import ProductModal from '../organisms/ProductModal';
import products, { productCategories, productPriceBounds } from '../../data/products';
import { useCart } from '../../context/CartContext';
import './ProductosPage.css';

const defaultFilters = {
  category: '',
  query: '',
  minPrice: '',
  maxPrice: '',
};

const ProductosPage = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addItem } = useCart();

  const filteredProducts = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const minCandidate = filters.minPrice === '' ? productPriceBounds.min : Number(filters.minPrice);
    const maxCandidate = filters.maxPrice === '' ? productPriceBounds.max : Number(filters.maxPrice);
    const minPrice = Number.isFinite(minCandidate) ? minCandidate : productPriceBounds.min;
    const maxPrice = Number.isFinite(maxCandidate) ? maxCandidate : productPriceBounds.max;
    const lowerBound = Math.min(minPrice, maxPrice);
    const upperBound = Math.max(minPrice, maxPrice);

    return products.filter((product) => {
      const matchesCategory = !filters.category || product.categoria === filters.category;
      const matchesQuery =
        query.length === 0 ||
        product.nombre.toLowerCase().includes(query) ||
        product.descripcion?.toLowerCase().includes(query) ||
        product.historia?.toLowerCase().includes(query);
      const matchesPrice = product.precio >= lowerBound && product.precio <= upperBound;

      return matchesCategory && matchesQuery && matchesPrice;
    });
  }, [filters]);

  const handleFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  const handleAddToCart = (product) => {
    addItem(product);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const activeFilters = [filters.category, filters.query, filters.minPrice, filters.maxPrice].filter(Boolean).length;

  return (
    <article className="products-page" aria-labelledby="productos-page-title">
      <header className="products-page__header">
        <SectionTitle align="left" as="h1" id="productos-page-title">
          Nuestros productos
        </SectionTitle>
        <p className="products-page__lead">
          Filtra por categoría, busca ingredientes clave o acota por rangos de precio para encontrar la preparación
          perfecta. Haz clic en cualquier tarjeta para conocer su historia y agregarla al carrito.
        </p>
      </header>

      <ProductFilters
        categories={productCategories}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
        priceBounds={productPriceBounds}
      />

      <div className="products-page__results" role="status" aria-live="polite">
        <span>
          {filteredProducts.length} {filteredProducts.length === 1 ? 'producto disponible' : 'productos disponibles'}
        </span>
        {activeFilters > 0 ? (
          <span className="products-page__filters-indicator">
            {activeFilters} {activeFilters === 1 ? 'filtro aplicado' : 'filtros aplicados'}
          </span>
        ) : null}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="products-page__empty">
          <p>No encontramos productos que coincidan con tu búsqueda actual.</p>
          <Button type="button" variant="primary" size="sm" onClick={handleResetFilters}>
            Restablecer filtros
          </Button>
        </div>
      ) : (
        <div className="products-page__grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.codigo}
              producto={product}
              onAddToCart={handleAddToCart}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      <ProductModal
        product={selectedProduct}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />
    </article>
  );
};

export default ProductosPage;
