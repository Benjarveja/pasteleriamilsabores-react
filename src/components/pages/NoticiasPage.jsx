import React from 'react';
import PageHeader from '../organisms/PageHeader';
import NewsHighlights from '../organisms/NewsHighlights';
import NewsGrid from '../organisms/NewsGrid';
import ContactForm from '../organisms/ContactForm';
import { featuredNews, newsEntries } from '../../data/news';
import './NoticiasPage.css';

const NoticiasPage = () => {
  return (
    <div className="noticias-page">
      <PageHeader
        title="Noticias Mil Sabores"
        description="Historias dulces que celebran nuestro legado, reconocimientos y la pasión por crear momentos inolvidables."
        eyebrow="Sala de prensa"
        backgroundVariant="pastel"
      />

      <NewsHighlights items={featuredNews} />

      <NewsGrid items={newsEntries.filter((item) => !featuredNews.includes(item))} />

      <section className="noticias-page__cta" aria-label="Comparte tu historia">
        <div className="noticias-page__cta-content">
          <h2>¿Quieres aparecer en nuestras noticias?</h2>
          <p>
            Si Mil Sabores fue parte de un momento especial, cuéntanos tu historia. Nos encanta compartir cómo nuestras
            tortas y postres se convierten en recuerdos inolvidables.
          </p>
        </div>
        <ContactForm
          title="Cuéntanos tu historia"
          description="Déjanos tus datos y te contactaremos para conocer cada detalle."
          submitLabel="Enviar historia"
        />
      </section>
    </div>
  );
};

export default NoticiasPage;
