import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import ProductosPage from './components/pages/ProductosPage';
import NosotrosPage from './components/pages/NosotrosPage';
import NoticiasPage from './components/pages/NoticiasPage';
import FAQPage from './components/pages/FAQPage';
import PagoPage from './components/pages/PagoPage';
import MainLayout from './components/templates/MainLayout';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'productos',
        element: <ProductosPage />,
      },
      {
        path: 'nosotros',
        element: <NosotrosPage />,
      },
      {
        path: 'noticias',
        element: <NoticiasPage />,
      },
      {
        path: 'faq',
        element: <FAQPage />,
      },
      {
        path: 'pago',
        element: <PagoPage />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
