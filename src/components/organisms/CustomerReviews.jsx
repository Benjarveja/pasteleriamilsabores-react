import React, { useEffect, useRef, useState } from 'react';
import SectionTitle from '../atoms/SectionTitle';
import ReviewCard from '../molecules/ReviewCard';
import reviews from '../../data/reviews';
import './CustomerReviews.css';

const CustomerReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const wrapperRef = useRef(null);
  const totalReviews = reviews.length;

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalReviews);
    }, 6000);
    return () => clearInterval(interval);
  }, [totalReviews]);

  const goTo = (index) => {
    setCurrentIndex((prev) => {
      if (index < 0) {
        return totalReviews - 1;
      }
      if (index >= totalReviews) {
        return 0;
      }
      return index;
    });
  };

  return (
    <section className="reviews-section" id="customer-reviews">
      <SectionTitle>Lo que dicen nuestros clientes</SectionTitle>
      <p className="reviews-section__subtitle">
        Historias reales de personas que celebran con nosotros. Tus momentos especiales también pueden ser inolvidables.
      </p>
      <div className="reviews-carousel">
        <button
          type="button"
          className="reviews-carousel__control reviews-carousel__control--prev"
          onClick={() => goTo(currentIndex - 1)}
          aria-label="Opinión anterior"
        >
          &lt;
        </button>
        <div className="reviews-carousel__viewport">
          <div className="reviews-carousel__wrapper" ref={wrapperRef}>
            {reviews.map((review, index) => (
              <div className="reviews-carousel__slide" key={`${review.author}-${index}`}>
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="reviews-carousel__control reviews-carousel__control--next"
          onClick={() => goTo(currentIndex + 1)}
          aria-label="Opinión siguiente"
        >
          &gt;
        </button>
      </div>
      <div className="reviews-carousel__dots" role="tablist" aria-label="Opiniones de clientes">
        {reviews.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`reviews-carousel__dot ${currentIndex === index ? 'is-active' : ''}`}
            onClick={() => goTo(index)}
            aria-label={`Ver opinión ${index + 1}`}
            aria-selected={currentIndex === index}
            role="tab"
          />
        ))}
      </div>
    </section>
  );
};

export default CustomerReviews;
