import { branches } from './company';

export const deliveryOptions = [
  {
    id: 'delivery',
    label: 'Envío a domicilio',
    description:
      'Despacho en menos de 48 horas dentro de la Región Metropolitana. Calculamos el costo según comuna y horario.',
    hint: 'Recomendamos tener a mano la dirección completa y un teléfono de contacto para la coordinación.',
  },
  {
    id: 'pickup',
    label: 'Retiro en tienda',
    description:
      'Puedes retirar tu pedido en cualquiera de nuestras sucursales habilitadas. Coordinamos el horario ideal contigo.',
    hint: 'Llegar con 10 minutos de anticipación asegura que tu pedido esté listo y fresco.',
  },
];

export const paymentMethods = [
  {
    id: 'card',
    label: 'Tarjeta de crédito o débito',
    description: 'Aceptamos Visa, Mastercard, Redcompra y prepago. Pagos seguros con respaldo Transbank.',
    perks: ['Cuotas hasta 12 meses sin interés en bancos seleccionados', 'Confirmación inmediata de tu pedido'],
  },
  {
    id: 'transfer',
    label: 'Transferencia bancaria',
    description: 'Recibirás los datos de nuestra cuenta al confirmar. Debes enviar el comprobante para procesar el pedido.',
    perks: ['Sin comisión adicional', 'Proceso manual validado en menos de 2 horas hábiles'],
  },
];

export const supportChannels = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    value: '+56 9 1234 5678',
    href: 'https://wa.me/56912345678',
  },
  {
    id: 'phone',
    label: 'Llámanos',
    value: '+56 2 2345 6789',
    href: 'tel:+56223456789',
  },
  {
    id: 'email',
    label: 'Correo',
    value: 'pedidos@milsabores.cl',
    href: 'mailto:pedidos@milsabores.cl',
  },
];

export const pickupBranches = branches;

export const pickupTimeSlots = [
  { id: 'morning', label: '09:00 - 11:00 hrs' },
  { id: 'midday', label: '11:00 - 14:00 hrs' },
  { id: 'afternoon', label: '14:00 - 17:00 hrs' },
  { id: 'evening', label: '17:00 - 19:30 hrs' },
];
