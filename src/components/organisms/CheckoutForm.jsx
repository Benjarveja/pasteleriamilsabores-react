import React, { useEffect, useMemo, useState } from 'react';
import Button from '../atoms/Button';
import SectionTitle from '../atoms/SectionTitle';
import { deliveryOptions, paymentMethods, pickupBranches, pickupTimeSlots, supportChannels } from '../../data/checkout';
import { useAuth } from '../../context/AuthContext';
import { regions, getCommunesByRegion } from '../../data/locations';
import { SENIOR_AGE_THRESHOLD } from '../../utils/discounts';
import {
  formatRun,
  hasMinLength,
  isNonEmpty,
  isValidBirthDate,
  isValidChileanPhone,
  isValidEmail,
  isValidRun,
  normalizePhone,
} from '../../utils/validation';
import './CheckoutForm.css';

const createInitialFormState = (profile) => ({
  run: profile?.run ?? '',
  firstName: profile?.firstName ?? '',
  lastName: profile?.lastName ?? '',
  email: profile?.email ?? '',
  phone: profile?.phone ?? '',
  birthDate: profile?.birthDate ?? '',
  deliveryOption: 'delivery',
  street: profile?.street ?? '',
  region: profile?.region ?? '',
  comuna: profile?.comuna ?? '',
  branch: '',
  pickupDate: '',
  pickupTimeSlot: '',
  paymentMethod: 'card',
  notes: '',
});

const CheckoutForm = ({
  onRequestAuth,
  onSubmitSuccess,
  isSubmitDisabled = false,
  onPricingChange,
  couponCode = '',
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState(() => createInitialFormState(user));
  const [status, setStatus] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const branchOptions = useMemo(
    () =>
      pickupBranches.map((branch) => ({
        value: branch.id,
        label: `${branch.name}: ${branch.address}`,
      })),
    [],
  );

  const deliveryCommunes = useMemo(
    () => (formData.region ? getCommunesByRegion(formData.region) : []),
    [formData.region],
  );

  const maxBirthDate = useMemo(() => new Date().toISOString().split('T')[0], []);
  const minPickupDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  const isValidPickupDate = (value) => {
    if (!value) return false;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    parsed.setHours(0, 0, 0, 0);
    return parsed >= today;
  };

  const getFieldError = (field, data = formData) => {
    const value = data[field];
    switch (field) {
      case 'run':
        if (!isNonEmpty(value)) return 'Ingresa tu RUN.';
        if (!isValidRun(value)) return 'RUN inválido. Usa el formato 12.345.678-5.';
        return '';
      case 'firstName':
        if (!isNonEmpty(value)) return 'Ingresa tu nombre.';
        if (!hasMinLength(value, 2)) return 'El nombre debe tener al menos 2 caracteres.';
        return '';
      case 'lastName':
        if (!isNonEmpty(value)) return 'Ingresa tus apellidos.';
        if (!hasMinLength(value, 2)) return 'Los apellidos deben tener al menos 2 caracteres.';
        return '';
      case 'email':
        if (!isNonEmpty(value)) return 'Ingresa tu correo electrónico.';
        if (!isValidEmail(value)) return 'Formato de correo inválido. Ej: nombre@dominio.cl';
        return '';
      case 'phone': {
        if (!isNonEmpty(value)) return 'Ingresa tu celular de contacto.';
        const normalized = normalizePhone(value);
        if (!isValidChileanPhone(normalized)) return 'El celular debe comenzar con 9 y tener 9 dígitos.';
        return '';
      }
      case 'birthDate':
        if (!isNonEmpty(value)) return 'Ingresa tu fecha de nacimiento.';
        if (!isValidBirthDate(value)) return 'La fecha no puede ser posterior a hoy.';
        return '';
      case 'street':
        if (data.deliveryOption === 'delivery') {
          if (!isNonEmpty(value)) return 'Ingresa la calle y número.';
          if (!hasMinLength(value, 5)) return 'La dirección debe tener al menos 5 caracteres.';
        }
        return '';
      case 'region':
        if (data.deliveryOption === 'delivery' && !isNonEmpty(value)) return 'Selecciona una región.';
        return '';
      case 'comuna':
        if (data.deliveryOption === 'delivery' && !isNonEmpty(value)) return 'Selecciona una comuna.';
        return '';
      case 'branch':
        if (data.deliveryOption === 'pickup' && !isNonEmpty(value)) return 'Selecciona la sucursal de retiro.';
        return '';
      case 'pickupDate':
        if (data.deliveryOption === 'pickup') {
          if (!isNonEmpty(value)) return 'Indica la fecha estimada de retiro.';
          if (!isValidPickupDate(value)) return 'La fecha de retiro debe ser hoy o una futura.';
        }
        return '';
      case 'pickupTimeSlot':
        if (data.deliveryOption === 'pickup' && !isNonEmpty(value)) return 'Selecciona el rango horario de retiro.';
        return '';
      case 'paymentMethod':
        if (!isNonEmpty(value)) return 'Selecciona un método de pago.';
        return '';
      case 'deliveryOption':
        if (!isNonEmpty(value)) return 'Selecciona una opción de entrega.';
        return '';
      default:
        return '';
    }
  };

  const fieldsToValidate = [
    'run',
    'firstName',
    'lastName',
    'email',
    'phone',
    'birthDate',
    'street',
    'region',
    'comuna',
    'deliveryOption',
    'branch',
    'pickupDate',
    'pickupTimeSlot',
    'paymentMethod',
  ];

  const validateForm = (data = formData) => {
    const errors = {};
    fieldsToValidate.forEach((field) => {
      const message = getFieldError(field, data);
      if (message) {
        errors[field] = message;
      }
    });
    return errors;
  };

  const updateFieldError = (field, data = formData) => {
    setFormErrors((prev) => {
      const next = { ...prev };
      const message = getFieldError(field, data);
      if (message) {
        next[field] = message;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const clearFieldErrors = (fields) => {
    if (!fields?.length) return;
    setFormErrors((prev) => {
      const next = { ...prev };
      fields.forEach((field) => {
        if (field in next) {
          delete next[field];
        }
      });
      return next;
    });
  };

  const markFieldAsTouched = (field) => {
    setTouchedFields((prev) => {
      if (prev[field]) return prev;
      return { ...prev, [field]: true };
    });
  };

  const getFieldErrorId = (field) => (formErrors[field] ? `checkout-form-${field}-error` : undefined);
  const fieldHasError = (field) => Boolean(formErrors[field]);
  const renderFieldError = (field) =>
    fieldHasError(field) ? (
      <small id={getFieldErrorId(field)} className="checkout-form__error" role="alert">
        {formErrors[field]}
      </small>
    ) : null;

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      run: user?.run ?? prev.run,
      firstName: user?.firstName ?? prev.firstName,
      lastName: user?.lastName ?? prev.lastName,
      email: user?.email ?? prev.email,
      phone: user?.phone ?? prev.phone,
      birthDate: user?.birthDate ?? prev.birthDate,
      street: user?.street ?? prev.street,
      region: user?.region ?? prev.region,
      comuna: user?.comuna ?? prev.comuna,
    }));
    if (user) {
      setStatus(null);
    }
    setFormErrors({});
    setTouchedFields({});
  }, [user]);

  useEffect(() => {
    onPricingChange?.({
      birthDate: formData.birthDate,
    });
  }, [formData.birthDate, onPricingChange]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextData = {
      ...formData,
      [name]: value,
    };
    setFormData(nextData);
    if (status?.type === 'error') {
      setStatus(null);
    }
    if (touchedFields[name]) {
      updateFieldError(name, nextData);
    }
    if (name === 'paymentMethod') {
      markFieldAsTouched('paymentMethod');
      updateFieldError('paymentMethod', nextData);
    }
  };

  const handleRegionChange = (event) => {
    const { value } = event.target;
    const communes = getCommunesByRegion(value);
    const comuna = communes.includes(formData.comuna) ? formData.comuna : '';
    const nextData = {
      ...formData,
      region: value,
      comuna,
    };
    setFormData(nextData);
    if (status?.type === 'error') {
      setStatus(null);
    }
    if (touchedFields.region) {
      updateFieldError('region', nextData);
    }
    if (touchedFields.comuna) {
      updateFieldError('comuna', nextData);
    }
  };

  const handleComunaChange = (event) => {
    const { value } = event.target;
    const nextData = {
      ...formData,
      comuna: value,
    };
    setFormData(nextData);
    if (status?.type === 'error') {
      setStatus(null);
    }
    if (touchedFields.comuna) {
      updateFieldError('comuna', nextData);
    }
  };

  const handleDeliveryOptionChange = (event) => {
    const { value } = event.target;
    const nextData = {
      ...formData,
      deliveryOption: value,
      branch: value === 'pickup' ? formData.branch : '',
      pickupDate: value === 'pickup' ? formData.pickupDate : '',
      pickupTimeSlot: value === 'pickup' ? formData.pickupTimeSlot : '',
    };
    setFormData(nextData);
    if (status?.type === 'error') {
      setStatus(null);
    }
    markFieldAsTouched('deliveryOption');
    updateFieldError('deliveryOption', nextData);

    if (value === 'pickup') {
      clearFieldErrors(['street', 'region', 'comuna']);
    } else {
      clearFieldErrors(['branch', 'pickupDate', 'pickupTimeSlot']);
    }
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    let nextData = formData;

    if (status?.type === 'error') {
      setStatus(null);
    }

    if (name === 'run') {
      const formatted = formatRun(formData.run);
      if (formatted !== formData.run) {
        nextData = { ...formData, run: formatted };
        setFormData(nextData);
      }
    }

    if (name === 'phone') {
      const normalized = normalizePhone(formData.phone);
      if (normalized !== formData.phone) {
        nextData = nextData === formData ? { ...formData, phone: normalized } : { ...nextData, phone: normalized };
        setFormData(nextData);
      }
    }

    markFieldAsTouched(name);
    updateFieldError(name, nextData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setTouchedFields((prev) => ({
        ...prev,
        ...Object.keys(validationErrors).reduce((acc, field) => ({ ...acc, [field]: true }), {}),
      }));
      setStatus({ type: 'error', message: 'Revisa los campos marcados antes de continuar.' });
      return;
    }

    const street = formData.deliveryOption === 'delivery' ? formData.street.trim() : '';
    const run = formatRun(formData.run);
    const phone = normalizePhone(formData.phone);
    const address =
      formData.deliveryOption === 'delivery'
        ? [street, formData.comuna, formData.region].filter(Boolean).join(', ')
        : '';

    const payload = {
      run,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone,
      birthDate: formData.birthDate,
      deliveryOption: formData.deliveryOption,
      street,
      region: formData.region,
      comuna: formData.comuna,
      address,
      branch: formData.deliveryOption === 'pickup' ? formData.branch : '',
      pickupDate: formData.deliveryOption === 'pickup' ? formData.pickupDate : '',
      pickupTimeSlot: formData.deliveryOption === 'pickup' ? formData.pickupTimeSlot : '',
      paymentMethod: formData.paymentMethod,
      notes: formData.notes.trim(),
      couponCode: couponCode.trim(),
    };

    setStatus({
      type: 'success',
      message:
        '¡Gracias! Revisaremos tus datos y te contactaremos para confirmar disponibilidad. Recibirás un correo con los siguientes pasos.',
    });
    onSubmitSuccess?.(payload);
    setFormData(createInitialFormState(user));
    setFormErrors({});
    setTouchedFields({});
  };

  return (
    <section className="checkout-form" aria-label="Formulario de checkout">
      <div className="checkout-form__intro">
        <SectionTitle as="h2" align="left">
          Completa tus datos
        </SectionTitle>
        <p>
          Tus datos nos ayudan a coordinar la entrega y mantenerte informado sobre el estado de tu pedido. Si ya tienes
          cuenta, podrás iniciar sesión durante el último paso para recuperar tus direcciones guardadas.
        </p>
        {!user ? (
          <div className="checkout-form__cta">
            <p>
              ¿Tienes cuenta? Inicia sesión para autocompletar tus datos. Usa el usuario de prueba
              <strong> cliente@milsabores.cl</strong> con contraseña <strong>MilSabores123</strong>.
            </p>
            <Button variant="secondary" onClick={onRequestAuth}>
              Iniciar sesión o registrarme
            </Button>
          </div>
        ) : (
          <div className="checkout-form__welcome">
            <p>
              Estás conectada/o como <strong>{user.firstName} {user.lastName}</strong>. Puedes editar cualquier dato
              antes de confirmar el pedido.
            </p>
          </div>
        )}
      </div>

      {status ? (
        <div className={`checkout-form__status checkout-form__status--${status.type}`}>
          <p>{status.message}</p>
          <Button type="button" variant="secondary" onClick={() => setStatus(null)}>
            {status.type === 'success' ? 'Editar mis datos' : 'Corregir datos'}
          </Button>
        </div>
      ) : null}

    <form className="checkout-form__body" onSubmit={handleSubmit} noValidate>
        <fieldset className="checkout-form__fieldset">
          <legend>Información personal</legend>
          <div className="checkout-form__grid">
            <label className={`checkout-form__field ${fieldHasError('run') ? 'has-error' : ''}`}>
              <span>RUN</span>
              <input
                type="text"
                name="run"
                placeholder="Ej: 12.345.678-5"
                value={formData.run}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={fieldHasError('run')}
                aria-describedby={getFieldErrorId('run')}
                required
              />
              {renderFieldError('run')}
            </label>
            <label className={`checkout-form__field ${fieldHasError('firstName') ? 'has-error' : ''}`}>
              <span>Nombre</span>
              <input
                type="text"
                name="firstName"
                placeholder="Ej: Karina"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={fieldHasError('firstName')}
                aria-describedby={getFieldErrorId('firstName')}
                required
              />
              {renderFieldError('firstName')}
            </label>
            <label className={`checkout-form__field ${fieldHasError('lastName') ? 'has-error' : ''}`}>
              <span>Apellidos</span>
              <input
                type="text"
                name="lastName"
                placeholder="Ej: Arrue Donoso"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={fieldHasError('lastName')}
                aria-describedby={getFieldErrorId('lastName')}
                required
              />
              {renderFieldError('lastName')}
            </label>
            <label className={`checkout-form__field ${fieldHasError('email') ? 'has-error' : ''}`}>
              <span>Email</span>
              <input
                type="email"
                name="email"
                placeholder="Ej: usuario@gmail.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={fieldHasError('email')}
                aria-describedby={getFieldErrorId('email')}
                required
              />
              {renderFieldError('email')}
            </label>
            <label className={`checkout-form__field ${fieldHasError('phone') ? 'has-error' : ''}`}>
              <span>Celular</span>
              <input
                type="tel"
                name="phone"
                placeholder="Ej: 912345678"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={fieldHasError('phone')}
                aria-describedby={getFieldErrorId('phone')}
                required
              />
              {renderFieldError('phone')}
            </label>
            <label className={`checkout-form__field ${fieldHasError('birthDate') ? 'has-error' : ''}`}>
              <span>Fecha de nacimiento</span>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                onBlur={handleBlur}
                max={maxBirthDate}
                aria-invalid={fieldHasError('birthDate')}
                aria-describedby={getFieldErrorId('birthDate')}
                required
              />
              <small className="checkout-form__hint">
                Personas de {SENIOR_AGE_THRESHOLD} años o más reciben automáticamente un 50% de descuento.
              </small>
              {renderFieldError('birthDate')}
            </label>
          </div>
        </fieldset>

        <fieldset className="checkout-form__fieldset">
          <legend>Opciones de entrega</legend>
          <div
            className={`checkout-form__radios ${fieldHasError('deliveryOption') ? 'has-error' : ''}`}
            role="radiogroup"
            aria-invalid={fieldHasError('deliveryOption')}
            aria-describedby={getFieldErrorId('deliveryOption')}
          >
            {deliveryOptions.map((option) => (
              <label key={option.id} className="checkout-form__radio">
                <input
                  type="radio"
                  name="deliveryOption"
                  value={option.id}
                  checked={formData.deliveryOption === option.id}
                  onChange={handleDeliveryOptionChange}
                  required
                />
                <div>
                  <span>{option.label}</span>
                  <p>{option.description}</p>
                  <small>{option.hint}</small>
                </div>
              </label>
            ))}
          </div>
          {renderFieldError('deliveryOption')}

          {formData.deliveryOption === 'delivery' ? (
            <div className="checkout-form__grid">
              <label
                className={`checkout-form__field checkout-form__field--span-2 ${fieldHasError('street') ? 'has-error' : ''}`}
              >
                <span>Calle y número</span>
                <input
                  type="text"
                  name="street"
                  placeholder="Ej: Avenida Siempre Viva 742, Depto 45"
                  value={formData.street}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={fieldHasError('street')}
                  aria-describedby={getFieldErrorId('street')}
                  required
                />
                {renderFieldError('street')}
              </label>
              <label className={`checkout-form__field ${fieldHasError('region') ? 'has-error' : ''}`}>
                <span>Región</span>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleRegionChange}
                  onBlur={handleBlur}
                  aria-invalid={fieldHasError('region')}
                  aria-describedby={getFieldErrorId('region')}
                  required
                >
                  <option value="" disabled>
                    Selecciona una región
                  </option>
                  {regions.map(({ id, name }) => (
                    <option key={id} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                {renderFieldError('region')}
              </label>
              <label className={`checkout-form__field ${fieldHasError('comuna') ? 'has-error' : ''}`}>
                <span>Comuna</span>
                <select
                  name="comuna"
                  value={formData.comuna}
                  onChange={handleComunaChange}
                  onBlur={handleBlur}
                  aria-invalid={fieldHasError('comuna')}
                  aria-describedby={getFieldErrorId('comuna')}
                  required
                  disabled={!formData.region}
                >
                  <option value="" disabled>
                    Selecciona una comuna
                  </option>
                  {deliveryCommunes.map((comuna) => (
                    <option key={comuna} value={comuna}>
                      {comuna}
                    </option>
                  ))}
                </select>
                {renderFieldError('comuna')}
              </label>
            </div>
          ) : null}

          {formData.deliveryOption === 'pickup' ? (
            <>
              <label className={`checkout-form__field ${fieldHasError('branch') ? 'has-error' : ''}`}>
                <span>Sucursal de retiro</span>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={fieldHasError('branch')}
                  aria-describedby={getFieldErrorId('branch')}
                  required
                >
                  <option value="">-- Selecciona una sucursal --</option>
                  {branchOptions.map((branch) => (
                    <option key={branch.value} value={branch.value}>
                      {branch.label}
                    </option>
                  ))}
                </select>
                {renderFieldError('branch')}
              </label>
              <div className="checkout-form__grid">
                <label className={`checkout-form__field ${fieldHasError('pickupDate') ? 'has-error' : ''}`}>
                  <span>Fecha estimada de retiro</span>
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={minPickupDate}
                    aria-invalid={fieldHasError('pickupDate')}
                    aria-describedby={getFieldErrorId('pickupDate')}
                    required
                  />
                  {renderFieldError('pickupDate')}
                </label>
                <label className={`checkout-form__field ${fieldHasError('pickupTimeSlot') ? 'has-error' : ''}`}>
                  <span>Rango horario</span>
                  <select
                    name="pickupTimeSlot"
                    value={formData.pickupTimeSlot}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={fieldHasError('pickupTimeSlot')}
                    aria-describedby={getFieldErrorId('pickupTimeSlot')}
                    required
                  >
                    <option value="">-- Selecciona un rango --</option>
                    {pickupTimeSlots.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                  {renderFieldError('pickupTimeSlot')}
                </label>
              </div>
            </>
          ) : null}
        </fieldset>

        <fieldset className="checkout-form__fieldset">
          <legend>Método de pago</legend>
          <div
            className={`checkout-form__radios ${fieldHasError('paymentMethod') ? 'has-error' : ''}`}
            role="radiogroup"
            aria-invalid={fieldHasError('paymentMethod')}
            aria-describedby={getFieldErrorId('paymentMethod')}
          >
            {paymentMethods.map((method) => (
              <label key={method.id} className="checkout-form__radio">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={formData.paymentMethod === method.id}
                  onChange={handleChange}
                  required
                />
                <div>
                  <span>{method.label}</span>
                  <p>{method.description}</p>
                  <ul>
                    {method.perks.map((perk) => (
                      <li key={perk}>{perk}</li>
                    ))}
                  </ul>
                </div>
              </label>
            ))}
          </div>
          {renderFieldError('paymentMethod')}
          <label className="checkout-form__field">
            <span>Notas adicionales (opcional)</span>
            <textarea
              name="notes"
              rows={4}
              placeholder="Cuéntanos si necesitas decorar con algún mensaje especial o coordinar un horario específico."
              value={formData.notes}
              onChange={handleChange}
            />
          </label>
        </fieldset>

        <div className="checkout-form__actions">
          <Button type="submit" variant="primary" disabled={isSubmitDisabled}>
            {isSubmitDisabled ? 'Agrega productos para continuar' : 'Confirmar y avanzar al pago'}
          </Button>
          <p>
            Recibirás un correo con el detalle de tu pedido y un enlace para completar el pago de forma segura. Ante
            cualquier duda, contáctanos por los canales disponibles.
          </p>
        </div>
      </form>

      <section className="checkout-form__support" aria-label="Necesitas ayuda?">
        <h3>¿Necesitas ayuda rápida?</h3>
        <p>Estamos disponibles para acompañarte durante todo el proceso de compra:</p>
        <ul>
          {supportChannels.map((channel) => (
            <li key={channel.id}>
              <span>{channel.label}:</span>
              <a href={channel.href}>{channel.value}</a>
            </li>
          ))}
        </ul>
        <small>Horarios de atención: lunes a sábado de 09:00 a 19:00 hrs.</small>
      </section>
    </section>
  );
};

export default CheckoutForm;
