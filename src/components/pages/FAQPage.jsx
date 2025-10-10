import React from 'react';
import PageHeader from '../organisms/PageHeader';
import FAQAccordion from '../organisms/FAQAccordion';
import Button from '../atoms/Button';
import { faqs } from '../../data/faqs';
import './FAQPage.css';

const FAQPage = () => {
  return (
    <div className="faq-page">
      <PageHeader
        eyebrow="Soporte Mil Sabores"
        title="Preguntas frecuentes"
        description="Resolvemos las dudas más habituales sobre pedidos, métodos de pago, entregas y personalización de tortas para que planifiques tu celebración sin estrés."
        backgroundVariant="pastel"
        align="left"
      />

      <FAQAccordion
        items={faqs}
        description="Explora cada pregunta para conocer más detalles. Puedes combinar tu pedido con despacho, elegir sabores especiales y gestionar modificaciones según disponibilidad."
      />

      <section className="faq-page__help" aria-label="¿Necesitas más ayuda?">
        <div className="faq-page__help-content">
          <h2>¿Tu pregunta no está aquí?</h2>
          <p>
            Escríbenos y recibe asesoría personalizada para diseñar la torta perfecta, coordinar entregas express o
            planificar pedidos corporativos. Nuestro equipo responde en menos de un día hábil.
          </p>
          <div className="faq-page__actions">
            <Button as="a" href="mailto:contacto@milsabores.cl" variant="primary">
              Escríbenos al correo
            </Button>
            <Button as="a" href="https://wa.me/56912345678" variant="secondary" target="_blank" rel="noreferrer">
              Chatear por WhatsApp
            </Button>
          </div>
        </div>
        <div className="faq-page__support-card">
          <h3>Horarios de atención</h3>
          <ul>
            <li>Lunes a viernes: 09:00 a 19:00 hrs</li>
            <li>Sábados: 10:00 a 15:00 hrs</li>
            <li>Domingos y festivos: según disponibilidad</li>
          </ul>
          <p className="faq-page__support-note">
            Para pedidos urgentes te recomendamos llamarnos directamente al <a href="tel:+56223456789">+56 2 2345 6789</a>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
