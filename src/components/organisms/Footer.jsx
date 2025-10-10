import React from 'react';
import logo from '../../assets/Mil Sabores.png';
import insta1 from '../../assets/instagram/insta1.jpg';
import insta2 from '../../assets/instagram/insta2.jpg';
import insta3 from '../../assets/instagram/insta3.jpg';
import insta4 from '../../assets/instagram/insta4.jpg';
import insta5 from '../../assets/instagram/insta5.jpg';
import insta6 from '../../assets/instagram/insta6.jpg';
import insta7 from '../../assets/instagram/insta7.jpg';
import insta8 from '../../assets/instagram/insta8.jpg';
import './Footer.css';

const instagramImages = [insta1, insta2, insta3, insta4, insta5, insta6, insta7, insta8];

const footerNews = [
  {
    title: '50 años de historia',
    description: 'Fue un día de 1975 cuando una pareja decidió dar el gran paso...',
    href: '/noticias',
  },
  {
    title: 'A 30 años del Guinness',
    description: 'Recordamos nuestra colaboración en la torta más grande del mundo...',
    href: '/noticias',
  },
];

const Footer = () => {
  return (
    <footer className="ms-footer">
      <div className="ms-footer__container">
        <div className="ms-footer__column">
          <a href="/" className="ms-footer__logo">
            <img src={logo} alt="Pastelería Mil Sabores" />
          </a>
          <p>
            Estamos emocionados de compartir nuestras delicias contigo. Descubre, saborea y crea momentos inolvidables
            con nosotros.
          </p>
        </div>

        <div className="ms-footer__column">
          <h4>Enlaces rápidos</h4>
          <ul>
            <li><a href="/faq">Preguntas frecuentes</a></li>
            <li><a href="/noticias">Noticias</a></li>
            <li><a href="/nosotros">Nosotros</a></li>
          </ul>
        </div>

        <div className="ms-footer__column">
          <h4>Últimas noticias</h4>
          <ul className="ms-footer__news">
            {footerNews.map((item) => (
              <li key={item.title}>
                <a href={item.href}>{item.title}</a>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="ms-footer__column">
          <h4>Instagram</h4>
          <div className="ms-footer__instagram">
            {instagramImages.map((src, index) => (
              <img src={src} alt={`Instagram ${index + 1}`} key={src} loading="lazy" />
            ))}
          </div>
        </div>
      </div>

      <div className="ms-footer__bottom">
        <p>&copy; {new Date().getFullYear()} Pastelería Mil Sabores. Todos los derechos reservados. By Luci&amp;Benja</p>
      </div>
    </footer>
  );
};

export default Footer;
