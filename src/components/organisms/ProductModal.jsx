import React, { useEffect, useMemo } from 'react';
import Button from '../atoms/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import './ProductModal.css';

const ProductModal = ({ product, onClose, onAddToCart }) => {
  useEffect(() => {
    if (!product) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [product, onClose]);

  const shareUrl = useMemo(() => {
    if (!product) {
      return '';
    }
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    return `${base}/productos/${product.codigo}`;
  }, [product]);

  if (!product) {
    return null;
  }

  const { nombre, descripcion, imagen, historia, precio } = product;

  const handleShare = async (platform) => {
    if (!product) {
      return;
    }
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(`Descubre ${nombre} en Pastelería Mil Sabores`);

    const links = {
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    };

    if (platform === 'whatsapp' && navigator.share) {
      try {
        await navigator.share({
          title: nombre,
          text: `Descubre ${nombre} en Pastelería Mil Sabores`,
          url: shareUrl,
        });
        return;
      } catch (error) {
        // fallback to link below
      }
    }

    const shareLink = links[platform];
    if (shareLink) {
      window.open(shareLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className="product-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={onClose}
    >
      <div className="product-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="product-modal__close" aria-label="Cerrar modal" onClick={onClose}>
          &times;
        </button>
        <div className="product-modal__image">
          <img src={imagen} alt={nombre} />
        </div>
        <div className="product-modal__body">
          <h2 id="product-modal-title">{nombre}</h2>
          <p className="product-modal__price">{formatCurrency(precio)}</p>
          <p className="product-modal__description">{descripcion}</p>
          {historia ? (
            <div className="product-modal__history">
              <h3>Nuestra historia</h3>
              <p>{historia}</p>
            </div>
          ) : null}
          <div className="product-modal__share" aria-label="Compartir producto">
            <span>Compartir:</span>
            <button type="button" onClick={() => handleShare('whatsapp')} aria-label="Compartir en WhatsApp">
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M16 2C8.28 2 2 8.04 2 15.5c0 2.67.83 5.16 2.26 7.25L3 30l7.46-1.88c1.98 1.04 4.24 1.63 6.54 1.63 7.72 0 14-6.04 14-13.5S23.72 2 16 2zm0 24.67c-2.04 0-4.03-.53-5.77-1.54l-.41-.25-4.43 1.12 1.18-4.21-.27-.43A10.4 10.4 0 0 1 5.6 15.5c0-5.77 4.66-10.47 10.4-10.47 5.74 0 10.4 4.7 10.4 10.47 0 5.78-4.66 10.47-10.4 10.47zm5.72-7.83c-.31-.16-1.82-.9-2.1-1-.28-.1-.49-.15-.69.15-.2.29-.79 1-.97 1.2-.18.2-.36.22-.66.07-.3-.15-1.26-.45-2.4-1.43-.89-.76-1.49-1.7-1.66-1.99-.17-.29-.02-.45.13-.6.13-.12.3-.33.45-.5.15-.17.2-.29.31-.48.1-.19.05-.36-.03-.5-.08-.15-.69-1.64-.95-2.25-.25-.6-.5-.52-.69-.53-.18-.01-.39-.01-.6-.01-.21 0-.55.08-.83.37-.28.29-1.1 1.06-1.1 2.58 0 1.52 1.13 2.99 1.29 3.19.16.2 2.2 3.45 5.32 4.69.74.32 1.32.51 1.77.66.74.24 1.41.2 1.94.12.59-.09 1.82-.75 2.08-1.48.26-.73.26-1.36.18-1.48-.08-.12-.28-.19-.58-.35z" />
              </svg>
            </button>
            <button type="button" onClick={() => handleShare('facebook')} aria-label="Compartir en Facebook">
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M19 6h3V0h-3c-3.86 0-7 3.14-7 7v3H9v6h3v16h6V16h4.11l.89-6H18V7c0-.55.45-1 1-1z" />
              </svg>
            </button>
            <button type="button" onClick={() => handleShare('twitter')} aria-label="Compartir en X">
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="m26.65 4-7.4 9.62L27.94 28h-6.6l-4.76-6.86L9.07 28H5.3l7.73-10.25L4.57 4h6.74l4.3 6.1L22.17 4h4.48Zm-3.4 20.7h1.74L9.83 5.23H7.96l15.3 19.47Z" />
              </svg>
            </button>
          </div>
          <div className="product-modal__actions">
            <Button onClick={() => onAddToCart(product)} size="md">
              Agregar al carrito
            </Button>
            <Button variant="ghost" onClick={onClose} size="md">
              Seguir explorando
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
