import noticiaGuinness from '../assets/news/noticiaguinness.jpg';
import noticia50Anos from '../assets/news/noticia50anos.jpg';
import noticiaRecetas from '../assets/news/noticiarecetas.jpg';
import noticiaDiaADia from '../assets/news/noticiadiaadia.jpg';
import noticiaDuoc from '../assets/news/duocuc.png';
import noticiaNuevaSucursal from '../assets/news/noticianuevasucursal.jpg';

export const featuredNews = [
  {
    id: 'guinness',
    title: 'A 30 años del Guinness',
    excerpt:
      'Recordamos cuando colaboramos en la creación de la torta más grande del mundo y cómo ese hito marcó nuestra historia.',
    image: noticiaGuinness,
    href: '#',
  },
  {
    id: 'cincuenta',
    title: '50 años de historia',
    excerpt: 'Un recorrido por las raíces familiares que dieron vida a la pastelería y a sus recetas más clásicas.',
    image: noticia50Anos,
    href: '#',
  },
  {
    id: 'recetas',
    title: '10 consejos y recetas para empezar',
    excerpt: 'Tips rápidos para estudiantes que quieren preparar postres irresistibles en poco tiempo.',
    image: noticiaRecetas,
    href: '#',
  },
];

export const newsEntries = [
  ...featuredNews,
  {
    id: 'dia-a-dia',
    title: 'Un día desde adentro',
    excerpt:
      'Conoce cómo trabajamos tras bambalinas, las anécdotas del equipo y los secretos que hacen única a Mil Sabores.',
    image: noticiaDiaADia,
    href: '#',
  },
  {
    id: 'duoc',
    title: 'Mil Sabores en DuocUC',
    excerpt:
      'Participamos en la jornada gastronómica de DuocUC sede Antonio Varas compartiendo técnicas y experiencias.',
    image: noticiaDuoc,
    href: '#',
  },
  {
    id: 'nueva-sucursal',
    title: '¡Tenemos nueva sucursal!',
    excerpt:
      'Abrimos una nueva tienda para acercarnos aún más a tus celebraciones. Muy pronto conocerás todos los detalles.',
    image: noticiaNuevaSucursal,
    href: '#',
  },
];
