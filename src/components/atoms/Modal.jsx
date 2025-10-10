import React, { useEffect } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, size = 'md', ariaLabel }) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="ms-modal" role="dialog" aria-modal="true" aria-label={ariaLabel ?? title}>
      <div className="ms-modal__backdrop" onClick={onClose} />
      <div className={`ms-modal__panel ms-modal__panel--${size}`}>
        <header className="ms-modal__header">
          {title ? <h2>{title}</h2> : <span className="ms-modal__spacer" />}
          <button type="button" className="ms-modal__close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </header>
        <div className="ms-modal__body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
