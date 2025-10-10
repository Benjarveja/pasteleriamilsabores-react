
import React from 'react';
import ImageSlider from '../organisms/ImageSlider';
import Introduction from '../organisms/Introduction';
import PopularProducts from '../organisms/PopularProducts';
import RecommendedProducts from '../organisms/RecommendedProducts';
import CustomerReviews from '../organisms/CustomerReviews';

const HomePageTemplate = () => {
  return (
    <div id="top">
      <main>
        <ImageSlider />
  <Introduction />
  <RecommendedProducts />
        <PopularProducts />
        <CustomerReviews />
      </main>
    </div>
  );
};

export default HomePageTemplate;
