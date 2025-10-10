import React, { useState } from 'react';
import Button from '../atoms/Button';
import { hasMinLength, isValidEmail } from '../../utils/validation';
import './ContactForm.css';

const initialState = {
  name: '',
  email: '',
  message: '',
};

const ContactForm = () => {
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({ ...initialState });
  const [touchedFields, setTouchedFields] = useState({});
  const [status, setStatus] = useState('idle');

  const validateField = (name, value) => {
    const trimmed = value.trim();

    switch (name) {
      case 'name':
        if (!hasMinLength(trimmed, 3)) {
          return 'Ingresa tu nombre completo.';
        }
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'´`-]+$/.test(trimmed)) {
          return 'El nombre solo puede incluir letras y espacios.';
        }
        return '';
      case 'email':
        if (!isValidEmail(trimmed)) {
          return 'Utiliza un correo con formato nombre@dominio.cl.';
        }
        return '';
      case 'message':
        if (!hasMinLength(trimmed, 20)) {
          return 'El mensaje debe tener al menos 20 caracteres.';
        }
        return '';
      default:
        return '';
    }
  };

  const showError = (field) => Boolean(touchedFields[field] && formErrors[field]);

  const getErrorId = (field) => `contact-${field}-error`;

  const renderError = (field) => {
    if (!showError(field)) return null;
    return (
      <small id={getErrorId(field)} className="contact-form__error" role="alert" aria-live="assertive">
        {formErrors[field]}
      </small>
    );
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setStatus('idle');
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touchedFields[name]) {
      const nextError = validateField(name, value);
      setFormErrors((prev) => ({
        ...prev,
        [name]: nextError,
      }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = Object.keys(initialState).reduce((acc, field) => {
      acc[field] = validateField(field, formValues[field] ?? '');
      return acc;
    }, {});

    setFormErrors(nextErrors);
    setTouchedFields({ name: true, email: true, message: true });

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) {
      setStatus('error');
      return;
    }

    setStatus('success');
    setFormValues(initialState);
    setFormErrors({ ...initialState });
    setTouchedFields({});
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className={`contact-form__field ${showError('name') ? 'has-error' : ''}`}>
        <label htmlFor="contact-name">Nombre</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          placeholder="Tu nombre completo"
          value={formValues.name}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={showError('name')}
          aria-describedby={showError('name') ? getErrorId('name') : undefined}
          required
        />
        {renderError('name')}
      </div>

      <div className={`contact-form__field ${showError('email') ? 'has-error' : ''}`}>
        <label htmlFor="contact-email">Correo electrónico</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          placeholder="ejemplo@mail.com"
          value={formValues.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={showError('email')}
          aria-describedby={showError('email') ? getErrorId('email') : undefined}
          required
        />
        {renderError('email')}
      </div>

      <div className={`contact-form__field ${showError('message') ? 'has-error' : ''}`}>
        <label htmlFor="contact-message">Mensaje</label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Cuéntanos en qué podemos ayudarte"
          rows="5"
          value={formValues.message}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={showError('message')}
          aria-describedby={showError('message') ? getErrorId('message') : undefined}
          required
        />
        {renderError('message')}
      </div>

      <Button type="submit" fullWidth>
        Enviar mensaje
      </Button>

      {status === 'success' && (
        <p className="contact-form__feedback contact-form__feedback--success" role="status" aria-live="polite">
          ¡Gracias! Te contactaremos muy pronto.
        </p>
      )}
      {status === 'error' && (
        <p className="contact-form__feedback contact-form__feedback--error" role="alert" aria-live="assertive">
          Por favor corrige los campos marcados en rojo.
        </p>
      )}
    </form>
  );
};

export default ContactForm;
