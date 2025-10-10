import tc001 from '../assets/products/TC001.jpg';
import tc002 from '../assets/products/TC002.jpg';
import tt001 from '../assets/products/TT001.jpg';
import tt002 from '../assets/products/TT002.jpg';
import pi001 from '../assets/products/PI001.jpg';
import pi002 from '../assets/products/PI002.jpg';
import psa001 from '../assets/products/PSA001.jpg';
import psa002 from '../assets/products/PSA002.jpg';
import pt001 from '../assets/products/PT001.jpg';
import pt002 from '../assets/products/PT002.jpg';
import pg001 from '../assets/products/PG001.jpg';
import pg002 from '../assets/products/PG002.jpg';
import pv001 from '../assets/products/PV001.jpg';
import pv002 from '../assets/products/PV002.jpg';
import te001 from '../assets/products/TE001.jpg';
import te002 from '../assets/products/TE002.jpg';

const products = [
  {
    codigo: 'TC001',
    categoria: 'Tortas Cuadradas',
    nombre: 'Torta Cuadrada de Chocolate',
    precio: 45000,
    imagen: tc001,
    descripcion: 'Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.',
    popular: true,
  },
  {
    codigo: 'TC002',
    categoria: 'Tortas Cuadradas',
    nombre: 'Torta Cuadrada de Frutas',
    precio: 50000,
    imagen: tc002,
    descripcion: 'Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.',
  },
  {
    codigo: 'TT001',
    categoria: 'Tortas Circulares',
    nombre: 'Torta Circular de Vainilla',
    precio: 40000,
    imagen: tt001,
    descripcion: 'Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.',
  },
  {
    codigo: 'TT002',
    categoria: 'Tortas Circulares',
    nombre: 'Torta Circular de Manjar',
    precio: 42000,
  imagen: tt002,
    descripcion: 'Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.',
    popular: true,
  },
  {
    codigo: 'PI001',
    categoria: 'Postres Individuales',
    nombre: 'Mousse de Chocolate',
    precio: 5000,
    imagen: pi001,
    descripcion: 'Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.',
  },
  {
    codigo: 'PI002',
    categoria: 'Postres Individuales',
    nombre: 'Tiramisú Clásico',
    precio: 5500,
    imagen: pi002,
    descripcion: 'Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.',
    popular: true,
  },
  {
    codigo: 'PSA001',
    categoria: 'Productos Sin Azúcar',
    nombre: 'Torta Sin Azúcar de Naranja',
    precio: 48000,
    imagen: psa001,
    descripcion: 'Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.',
  },
  {
    codigo: 'PSA002',
    categoria: 'Productos Sin Azúcar',
    nombre: 'Cheesecake Sin Azúcar',
    precio: 47000,
    imagen: psa002,
    descripcion: 'Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.',
  },
  {
    codigo: 'PT001',
    categoria: 'Pastelería Tradicional',
    nombre: 'Empanada de Manzana',
    precio: 3000,
    imagen: pt001,
    descripcion: 'Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.',
    historia: 'La empanada de manzana es una receta que ha pasado de generación en generación, adaptándose en cada región con un toque local. Originalmente europea, se ha convertido en un clásico de la repostería chilena.',
  },
  {
    codigo: 'PT002',
    categoria: 'Pastelería Tradicional',
    nombre: 'Tarta de Santiago',
    precio: 6000,
    imagen: pt002,
    descripcion: 'Tradicional tarta española hecha con almendras, azúcar, y huevos, una delicia para los amantes de los postres clásicos.',
    historia: 'Originaria de Galicia, España, esta tarta tiene una historia que se remonta a la Edad Media. Se caracteriza por la cruz de Santiago espolvoreada en su superficie, un símbolo de la orden de caballeros.',
    popular: true,
  },
  {
    codigo: 'PG001',
    categoria: 'Productos Sin Gluten',
    nombre: 'Brownie Sin Gluten',
    precio: 4000,
    imagen: pg001,
    descripcion: 'Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.',
  },
  {
    codigo: 'PG002',
    categoria: 'Productos Sin Gluten',
    nombre: 'Pan Sin Gluten',
    precio: 3500,
    imagen: pg002,
    descripcion: 'Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida.',
  },
  {
    codigo: 'PV001',
    categoria: 'Productos Vegana',
    nombre: 'Torta Vegana de Chocolate',
    precio: 50000,
    imagen: pv001,
    descripcion: 'Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos.',
  },
  {
    codigo: 'PV002',
    categoria: 'Productos Vegana',
    nombre: 'Galletas Veganas de Avena',
    precio: 4500,
    imagen: pv002,
    descripcion: 'Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.',
  },
  {
    codigo: 'TE001',
    categoria: 'Tortas Especiales',
    nombre: 'Torta Especial de Cumpleaños',
    precio: 55000,
    imagen: te001,
    descripcion: 'Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.',
  },
  {
    codigo: 'TE002',
    categoria: 'Tortas Especiales',
    nombre: 'Torta Especial de Boda',
    precio: 60000,
    imagen: te002,
    descripcion: 'Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.',
  },
];

const categoryOrder = [
  'Tortas Cuadradas',
  'Tortas Circulares',
  'Tortas Especiales',
  'Productos Sin Azúcar',
  'Productos Sin Gluten',
  'Productos Vegana',
  'Pastelería Tradicional',
  'Postres Individuales',
];

const normalizedCategories = Array.from(
  new Set([...categoryOrder, ...products.map((product) => product.categoria)]),
);

export const productCategories = normalizedCategories.map((categoria) => ({
  id: categoria.toLowerCase().replace(/[^a-z0-9]+/gi, '-'),
  label: categoria,
  value: categoria,
}));

export const productPriceBounds = products.reduce(
  (acc, product) => {
    if (product.precio < acc.min) acc.min = product.precio;
    if (product.precio > acc.max) acc.max = product.precio;
    return acc;
  },
  { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
);

if (productPriceBounds.min === Number.POSITIVE_INFINITY) {
  productPriceBounds.min = 0;
}

if (productPriceBounds.max === Number.NEGATIVE_INFINITY) {
  productPriceBounds.max = 0;
}

export default products;
