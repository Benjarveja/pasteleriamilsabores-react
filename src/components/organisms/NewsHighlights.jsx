import React, { useMemo, useState } from 'react';
import Button from '../atoms/Button';
import SectionTitle from '../atoms/SectionTitle';
import './NewsHighlights.css';

const NewsHighlights = ({ items }) => {
  const slides = useMemo(() => items.slice(0, 3), [items]);
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % total);
  };

  if (total === 0) {
    return null;
  }

  const activeSlide = slides[current];

  return (
    <section className="news-highlights" aria-label="Noticias destacadas">
      <SectionTitle align="left" as="h2">
        Historias que inspiran
      </SectionTitle>
      <div className="news-highlights__stage">
        <button
          type="button"
          className="news-highlights__control news-highlights__control--prev"
          onClick={handlePrev}
          aria-label="Ver noticia anterior"
        >
          ‹
        </button>

        <article className="news-highlights__card">
          <div className="news-highlights__media">
            <img src={activeSlide.image} alt={activeSlide.title} loading="lazy" />
          </div>
          <div className="news-highlights__content">
            <p className="news-highlights__meta">{current + 1} / {total}</p>
            <h3>{activeSlide.title}</h3>
            <p>{activeSlide.excerpt}</p>
            <Button as="a" href={activeSlide.href} size="sm">
              Leer historia completa
            </Button>
          </div>
        </article>

        <button
          type="button"
          className="news-highlights__control news-highlights__control--next"
          onClick={handleNext}
          aria-label="Ver noticia siguiente"
        >
          ›
        </button>
      </div>

      <div className="news-highlights__dots" role="tablist" aria-label="Selecciona noticia destacada">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={`news-highlights__dot ${index === current ? 'is-active' : ''}`}
            onClick={() => setCurrent(index)}
            aria-label={`Ver ${slide.title}`}
            aria-selected={index === current}
          />
        ))}
      </div>
    </section>
  );
};

export default NewsHighlights;
