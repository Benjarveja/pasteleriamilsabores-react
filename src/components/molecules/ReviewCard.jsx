import React from 'react';
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
  const { author, stars, comment } = review;
  const filledStars = '★'.repeat(stars);
  const emptyStars = '☆'.repeat(5 - stars);

  return (
    <article className="review-card">
      <div className="review-card__stars" aria-hidden="true">
        <span className="review-card__stars--filled">{filledStars}</span>
        <span className="review-card__stars--empty">{emptyStars}</span>
      </div>
      <p className="review-card__comment">“{comment}”</p>
      <p className="review-card__author">- {author}</p>
    </article>
  );
};

export default ReviewCard;
