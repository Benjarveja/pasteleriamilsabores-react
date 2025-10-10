import React from 'react';
import Button from '../atoms/Button';
import './ProductFilters.css';

const ProductFilters = ({
  categories,
  filters,
  onFiltersChange,
  onReset,
  priceBounds,
}) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onFiltersChange({
      ...filters,
      [name]: value,
    });
  };

  return (
    <section className="product-filters" aria-label="Filtros de productos">
      <div className="product-filters__group">
        <label htmlFor="product-filter-category">Categoría</label>
        <select
          id="product-filter-category"
          name="category"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category.id} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="product-filters__group">
        <label htmlFor="product-filter-query">Buscar</label>
        <input
          id="product-filter-query"
          name="query"
          type="search"
          placeholder="Nombre o descripción"
          value={filters.query}
          onChange={handleChange}
        />
      </div>

      <div className="product-filters__range" role="group" aria-label="Filtrar por precio">
        <div className="product-filters__group">
          <label htmlFor="product-filter-min">Precio mínimo</label>
          <input
            id="product-filter-min"
            name="minPrice"
            type="number"
            inputMode="numeric"
            min={priceBounds.min}
            max={priceBounds.max}
            placeholder={`Desde ${priceBounds.min.toLocaleString('es-CL')} CLP`}
            value={filters.minPrice}
            onChange={handleChange}
          />
        </div>
        <div className="product-filters__group">
          <label htmlFor="product-filter-max">Precio máximo</label>
          <input
            id="product-filter-max"
            name="maxPrice"
            type="number"
            inputMode="numeric"
            min={priceBounds.min}
            max={priceBounds.max}
            placeholder={`Hasta ${priceBounds.max.toLocaleString('es-CL')} CLP`}
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="product-filters__actions">
        <Button variant="secondary" size="sm" type="button" onClick={onReset}>
          Limpiar filtros
        </Button>
      </div>
    </section>
  );
};

export default ProductFilters;
