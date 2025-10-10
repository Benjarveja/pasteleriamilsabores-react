import React, { useState, useEffect, useRef } from 'react';
import noticia50años from '../../assets/news/noticia50anos.jpg';
import noticiaDiaADia from '../../assets/news/noticiadiaadia.jpg';
import noticiaGuinness from '../../assets/news/noticiaguinness.jpg';
import './ImageSlider.css';

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [
    {
      img: noticia50años,
      alt: 'Aniversario 50 años',
      title: '50 Años de Dulce Tradición',
      text: 'Acompañándote en tus celebraciones más importantes.',
      href: '#',
    },
    {
      img: noticiaDiaADia,
      alt: 'Nuevos Productos',
      title: 'Nuevos Sabores Cada Día',
      text: 'Descubre nuestras últimas creaciones y déjate sorprender.',
      href: '#popular-products',
    },
    {
      img: noticiaGuinness,
      alt: 'Record Guinness',
      title: 'Una Historia de Récord',
      text: 'Orgullosos de nuestra participación en el Récord Guinness de 1995.',
      href: '#',
    },
  ];
  const totalSlides = slides.length;
  const sliderWrapperRef = useRef(null);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (sliderWrapperRef.current) {
      sliderWrapperRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  useEffect(() => {
    const interval = setInterval(goToNext, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="slider-container">
      <div className="slider-wrapper" ref={sliderWrapperRef}>
        {slides.map((slide, index) => (
          <div className="slide" key={index}>
            <a href={slide.href} className="slide-link">
              <img src={slide.img} alt={slide.alt} />
              <div className="slide-caption">
                <h2>{slide.title}</h2>
                <p>{slide.text}</p>
              </div>
            </a>
          </div>
        ))}
      </div>
      <button className="carousel-btn prev" onClick={goToPrev}>&lt;</button>
      <button className="carousel-btn next" onClick={goToNext}>&gt;</button>
    </section>
  );
};

export default ImageSlider;
