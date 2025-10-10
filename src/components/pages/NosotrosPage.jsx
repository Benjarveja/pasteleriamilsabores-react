import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../atoms/SectionTitle';
import Button from '../atoms/Button';
import MissionVisionCard from '../molecules/MissionVisionCard';
import SocialLinks from '../molecules/SocialLinks';
import ContactForm from '../organisms/ContactForm';
import { aboutContent, missionVision, branches, socialLinks, mapEmbedUrl } from '../../data/company';
import './NosotrosPage.css';

const NosotrosPage = () => {
  return (
    <div className="about-page" aria-labelledby="nosotros-page-title">
      <section className="about-page__intro">
  <SectionTitle align="center" as="h1" id="nosotros-page-title">
          Dulce tradición, innovación constante
        </SectionTitle>
        <div className="about-page__intro-text">
          {aboutContent.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="about-page__mission" aria-label="Misión y visión">
        <div className="about-page__mission-header">
          <SectionTitle align="center" as="h2">
            Nuestra esencia
          </SectionTitle>
          <p>
            Cada preparación nace en nuestros talleres con ingredientes escogidos y un equipo que ama lo que hace. Así
            plasmamos nuestra misión y visión en cada entrega.
          </p>
        </div>
        <div className="about-page__mission-grid">
          {missionVision.map((item) => (
            <MissionVisionCard key={item.id} title={item.title} description={item.description} />
          ))}
        </div>
      </section>

      <section className="about-page__branches" aria-label="Sucursales">
  <SectionTitle align="center" as="h2">
          Nuestras casas
        </SectionTitle>
        <p className="about-page__branches-lead">
          Estamos presentes en distintos rincones de Santiago para que puedas retirar tu pedido o disfrutar de un café
          mientras eliges tu torta favorita.
        </p>
        <ul className="about-page__branch-list">
          {branches.map((branch) => (
            <li key={branch.id}>
              <strong>{branch.name}:</strong> {branch.address}
            </li>
          ))}
        </ul>
        <div className="about-page__map">
          <iframe
            title="Mapa sucursal Casa Matriz"
            src={mapEmbedUrl}
            width="100%"
            height="380"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <section className="about-page__contact" aria-labelledby="contacto-title">
        <div className="about-page__contact-header">
          <SectionTitle align="center" as="h2" id="contacto-title">
            Conversemos
          </SectionTitle>
          <p>
            ¿Buscas una torta personalizada o quieres cotizar para tu empresa? Escríbenos y nuestro equipo responderá en
            menos de 24 horas hábiles.
          </p>
        </div>
        <ContactForm />
      </section>

      <section className="about-page__social" aria-labelledby="social-title">
  <SectionTitle align="center" as="h2" id="social-title">
          Síguenos en redes
        </SectionTitle>
        <p>
          Descubre lanzamientos, cursos y transmisiones en vivo con tips de repostería. Sumamos contenido nuevo todas las
          semanas.
        </p>
        <SocialLinks links={socialLinks} />
      </section>

      <section className="about-page__cta" aria-label="Explora nuestros productos">
        <div className="about-page__cta-card">
          <h2>¿Listo para elegir tu próximo sabor?</h2>
          <p>
            Explora el catálogo completo, filtra por categorías y agrega tus favoritos al carrito para agendar retiro o
            despacho.
          </p>
          <Button as={Link} to="/productos">
            Ver catálogo
          </Button>
        </div>
      </section>
    </div>
  );
};

export default NosotrosPage;
