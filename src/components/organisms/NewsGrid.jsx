import React from 'react';
import SectionTitle from '../atoms/SectionTitle';
import NewsCard from '../molecules/NewsCard';
import './NewsGrid.css';

const NewsGrid = ({ items }) => {
  if (!items?.length) {
    return null;
  }

  return (
    <section className="news-grid" aria-label="Noticias recientes">
      <div className="news-grid__header">
        <SectionTitle align="left" as="h2">
          Novedades y actualidad
        </SectionTitle>
        <p>
          Descubre las últimas historias de Mil Sabores: eventos, reconocimientos, nuevas recetas
          y toda la inspiración que compartimos día a día con nuestra comunidad.
        </p>
      </div>
      <div className="news-grid__list">
        {items.map((news) => (
          <NewsCard key={news.id} {...news} />
        ))}
      </div>
    </section>
  );
};

export default NewsGrid;
