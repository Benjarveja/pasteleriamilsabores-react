import React from 'react';
import Button from '../atoms/Button';
import './NewsCard.css';

const NewsCard = ({ title, excerpt, image, href = '#' }) => {
  return (
    <article className="news-card">
      <div className="news-card__image">
        <img src={image} alt={title} loading="lazy" />
      </div>
      <div className="news-card__body">
        <h3>{title}</h3>
        <p>{excerpt}</p>
        <Button as="a" href={href} size="sm" variant="secondary">
          Leer más
        </Button>
      </div>
    </article>
  );
};

export default NewsCard;
