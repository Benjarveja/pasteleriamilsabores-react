import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../organisms/Header';
import Footer from '../organisms/Footer';
import Cart from '../organisms/Cart';

const MainLayout = () => {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Cart />
    </div>
  );
};

export default MainLayout;
