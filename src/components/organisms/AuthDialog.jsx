import React, { useEffect, useMemo, useState } from 'react';
import Modal from '../atoms/Modal';
import Button from '../atoms/Button';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';
import products from '../../data/products';
import { regions, getCommunesByRegion } from '../../data/locations';
import { buildPurchaseSummary } from '../../utils/recommendations';
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
import './AuthDialog.css';

const initialRegisterState = {
  run: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  street: '',
  region: '',
  comuna: '',
  birthDate: '',
};

const initialProfileState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  street: '',
  region: '',
  comuna: '',
  birthDate: '',
  run: '',
};

const ACCOUNT_VIEWS = ['account', 'orders', 'purchases'];

const formatDateLong = (value) =>
  new Date(value).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const AuthDialog = ({ isOpen, onClose, initialView = 'menu' }) => {
  const { login, register, user, updateProfile, orders } = useAuth();
  const [view, setView] = useState(initialView);
  const [loginState, setLoginState] = useState({ email: '', password: '', loading: false });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginTouched, setLoginTouched] = useState({});
  const [loginGeneralError, setLoginGeneralError] = useState('');

  const [registerState, setRegisterState] = useState({ ...initialRegisterState, loading: false });
  const [registerErrors, setRegisterErrors] = useState({});
  const [registerTouched, setRegisterTouched] = useState({});
  const [registerGeneralError, setRegisterGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [profileState, setProfileState] = useState(initialProfileState);
  const [profileStatus, setProfileStatus] = useState({ loading: false, error: '', success: '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileTouched, setProfileTouched] = useState({});

  const resetStates = () => {
    setView('menu');
    setLoginState({ email: '', password: '', loading: false });
    setLoginErrors({});
    setLoginTouched({});
    setLoginGeneralError('');
    setRegisterState({ ...initialRegisterState, loading: false });
    setRegisterErrors({});
    setRegisterTouched({});
    setRegisterGeneralError('');
    setSuccessMessage('');
    setProfileState(initialProfileState);
    setProfileStatus({ loading: false, error: '', success: '' });
    setProfileErrors({});
    setProfileTouched({});
  };

  const handleClose = () => {
    resetStates();
    onClose?.();
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const nextView = ACCOUNT_VIEWS.includes(initialView) && !user ? 'menu' : initialView;
    setView(nextView);
    setSuccessMessage('');
    setLoginState({ email: '', password: '', loading: false });
    setLoginErrors({});
    setLoginTouched({});
    setLoginGeneralError('');
    setRegisterState({ ...initialRegisterState, loading: false });
    setRegisterErrors({});
    setRegisterTouched({});
    setRegisterGeneralError('');
  }, [isOpen, initialView, user]);

  useEffect(() => {
    if (view === 'account' && user) {
      setProfileState({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        street: user.street ?? '',
        region: user.region ?? '',
        comuna: user.comuna ?? '',
        birthDate: user.birthDate ?? '',
        run: user.run ?? '',
      });
      setProfileStatus({ loading: false, error: '', success: '' });
      setProfileErrors({});
      setProfileTouched({});
    }
  }, [view, user]);

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    const nextState = { ...loginState, [name]: value };
    setLoginState(nextState);
    if (loginGeneralError) {
      setLoginGeneralError('');
    }
    if (loginTouched[name]) {
      updateLoginFieldError(name, nextState);
    }
  };

  const handleLoginBlur = (event) => {
    const { name } = event.target;
    let nextState = loginState;
    if (name === 'email') {
      const trimmed = loginState.email.trim();
      if (trimmed !== loginState.email) {
        nextState = { ...loginState, email: trimmed };
        setLoginState(nextState);
      }
    }
    markLoginFieldTouched(name);
    updateLoginFieldError(name, nextState);
  };

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    const nextState = { ...registerState, [name]: value };
    setRegisterState(nextState);
    if (registerGeneralError) {
      setRegisterGeneralError('');
    }
    if (registerTouched[name]) {
      updateRegisterFieldError(name, nextState);
    }
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    const nextState = { ...profileState, [name]: value };
    setProfileState(nextState);
    setProfileStatus((prev) => ({ ...prev, error: '', success: '' }));
    if (profileTouched[name]) {
      updateProfileFieldError(name, nextState);
    }
  };

  const handleProfileRegionChange = (event) => {
    const { value } = event.target;
    const communes = getCommunesByRegion(value);
    const comuna = communes.includes(profileState.comuna) ? profileState.comuna : '';
    const nextState = {
      ...profileState,
      region: value,
      comuna,
    };
    setProfileState(nextState);
    setProfileStatus((prev) => ({ ...prev, error: '', success: '' }));
    if (profileTouched.region) {
      updateProfileFieldError('region', nextState);
    }
    if (profileTouched.comuna) {
      updateProfileFieldError('comuna', nextState);
    }
  };

  const handleProfileComunaChange = (event) => {
    const { value } = event.target;
    const nextState = { ...profileState, comuna: value };
    setProfileState(nextState);
    setProfileStatus((prev) => ({ ...prev, error: '', success: '' }));
    if (profileTouched.comuna) {
      updateProfileFieldError('comuna', nextState);
    }
  };

  const handleProfileBlur = (event) => {
    const { name } = event.target;
    let nextState = profileState;

    if (name === 'phone') {
      const normalized = normalizePhone(profileState.phone);
      if (normalized !== profileState.phone) {
        nextState = { ...profileState, phone: normalized };
        setProfileState(nextState);
      }
    }

    if (name === 'email') {
      const trimmed = profileState.email.trim();
      if (trimmed !== profileState.email) {
        nextState = nextState === profileState ? { ...profileState, email: trimmed } : { ...nextState, email: trimmed };
        setProfileState(nextState);
      }
    }

    markProfileFieldTouched(name);
    updateProfileFieldError(name, nextState);
  };

  const handleRegisterRegionChange = (event) => {
    const { value } = event.target;
    const communes = getCommunesByRegion(value);
    const comuna = communes.includes(registerState.comuna) ? registerState.comuna : '';
    const nextState = {
      ...registerState,
      region: value,
      comuna,
    };
    setRegisterState(nextState);
    if (registerGeneralError) {
      setRegisterGeneralError('');
    }
    if (registerTouched.region) {
      updateRegisterFieldError('region', nextState);
    }
    if (registerTouched.comuna) {
      updateRegisterFieldError('comuna', nextState);
    }
  };

  const handleRegisterComunaChange = (event) => {
    const { value } = event.target;
    const nextState = { ...registerState, comuna: value };
    setRegisterState(nextState);
    if (registerGeneralError) {
      setRegisterGeneralError('');
    }
    if (registerTouched.comuna) {
      updateRegisterFieldError('comuna', nextState);
    }
  };

  const handleRegisterBlur = (event) => {
    const { name } = event.target;
    let nextState = registerState;

    if (name === 'run') {
      const formatted = formatRun(registerState.run);
      if (formatted !== registerState.run) {
        nextState = { ...registerState, run: formatted };
        setRegisterState(nextState);
      }
    }

    if (name === 'phone') {
      const normalized = normalizePhone(registerState.phone);
      if (normalized !== registerState.phone) {
        nextState = nextState === registerState ? { ...registerState, phone: normalized } : { ...nextState, phone: normalized };
        setRegisterState(nextState);
      }
    }

    if (name === 'email') {
      const trimmed = registerState.email.trim();
      if (trimmed !== registerState.email) {
        nextState = nextState === registerState ? { ...registerState, email: trimmed } : { ...nextState, email: trimmed };
        setRegisterState(nextState);
      }
    }

    markRegisterFieldTouched(name);
    updateRegisterFieldError(name, nextState);
  };

  const maxBirthDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  const registerCommunes = useMemo(
    () => (registerState.region ? getCommunesByRegion(registerState.region) : []),
    [registerState.region],
  );

  const profileCommunes = useMemo(
    () => (profileState.region ? getCommunesByRegion(profileState.region) : []),
    [profileState.region],
  );

  const getLoginFieldError = (field, data = loginState) => {
    const value = data[field];
    switch (field) {
      case 'email':
        if (!isNonEmpty(value)) return 'Ingresa tu correo electrónico.';
        if (!isValidEmail(value)) return 'Formato de correo inválido. Ej: nombre@dominio.cl';
        return '';
      case 'password':
        if (!isNonEmpty(value)) return 'Ingresa tu contraseña.';
        return '';
      default:
        return '';
    }
  };

  const validateLoginForm = (data = loginState) => {
    const errors = {};
    ['email', 'password'].forEach((field) => {
      const message = getLoginFieldError(field, data);
      if (message) {
        errors[field] = message;
      }
    });
    return errors;
  };

  const markLoginFieldTouched = (field) => {
    setLoginTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  };

  const updateLoginFieldError = (field, data = loginState) => {
    setLoginErrors((prev) => {
      const next = { ...prev };
      const message = getLoginFieldError(field, data);
      if (message) {
        next[field] = message;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const getRegisterFieldError = (field, data = registerState) => {
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
        if (!isNonEmpty(value)) return 'Ingresa tu celular.';
        if (!isValidChileanPhone(value)) return 'El celular debe comenzar con 9 y tener 9 dígitos.';
        return '';
      }
      case 'street':
        if (!isNonEmpty(value)) return 'Ingresa tu dirección.';
        if (!hasMinLength(value, 5)) return 'La dirección debe tener al menos 5 caracteres.';
        return '';
      case 'region':
        if (!isNonEmpty(value)) return 'Selecciona una región.';
        return '';
      case 'comuna':
        if (!isNonEmpty(value)) return 'Selecciona una comuna.';
        return '';
      case 'birthDate':
        if (!isNonEmpty(value)) return 'Selecciona tu fecha de nacimiento.';
        if (!isValidBirthDate(value)) return 'La fecha no puede ser posterior a hoy.';
        return '';
      case 'password':
        if (!isNonEmpty(value)) return 'Crea una contraseña.';
        if (!hasMinLength(value, 6)) return 'La contraseña debe tener al menos 6 caracteres.';
        return '';
      default:
        return '';
    }
  };

  const registerFields = [
    'run',
    'firstName',
    'lastName',
    'email',
    'phone',
    'street',
    'region',
    'comuna',
    'birthDate',
    'password',
  ];

  const validateRegisterForm = (data = registerState) => {
    const errors = {};
    registerFields.forEach((field) => {
      const message = getRegisterFieldError(field, data);
      if (message) {
        errors[field] = message;
      }
    });
    return errors;
  };

  const markRegisterFieldTouched = (field) => {
    setRegisterTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  };

  const updateRegisterFieldError = (field, data = registerState) => {
    setRegisterErrors((prev) => {
      const next = { ...prev };
      const message = getRegisterFieldError(field, data);
      if (message) {
        next[field] = message;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const getProfileFieldError = (field, data = profileState) => {
    const value = data[field];
    switch (field) {
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
      case 'phone':
        if (!isNonEmpty(value)) return 'Ingresa tu celular.';
        if (!isValidChileanPhone(value)) return 'El celular debe comenzar con 9 y tener 9 dígitos.';
        return '';
      case 'street':
        if (!isNonEmpty(value)) return 'Ingresa tu dirección.';
        if (!hasMinLength(value, 5)) return 'La dirección debe tener al menos 5 caracteres.';
        return '';
      case 'region':
        if (!isNonEmpty(value)) return 'Selecciona una región.';
        return '';
      case 'comuna':
        if (!isNonEmpty(value)) return 'Selecciona una comuna.';
        return '';
      case 'birthDate':
        if (!isNonEmpty(value)) return 'Selecciona tu fecha de nacimiento.';
        if (!isValidBirthDate(value)) return 'La fecha no puede ser posterior a hoy.';
        return '';
      default:
        return '';
    }
  };

  const profileFields = ['firstName', 'lastName', 'email', 'phone', 'street', 'region', 'comuna', 'birthDate'];

  const validateProfileForm = (data = profileState) => {
    const errors = {};
    profileFields.forEach((field) => {
      const message = getProfileFieldError(field, data);
      if (message) {
        errors[field] = message;
      }
    });
    return errors;
  };

  const markProfileFieldTouched = (field) => {
    setProfileTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  };

  const updateProfileFieldError = (field, data = profileState) => {
    setProfileErrors((prev) => {
      const next = { ...prev };
      const message = getProfileFieldError(field, data);
      if (message) {
        next[field] = message;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const getLoginErrorId = (field) => (loginErrors[field] ? `auth-login-${field}-error` : undefined);
  const renderLoginError = (field) =>
    loginErrors[field] ? (
      <small className="auth-dialog__field-error" id={getLoginErrorId(field)} role="alert">
        {loginErrors[field]}
      </small>
    ) : null;

  const getRegisterErrorId = (field) => (registerErrors[field] ? `auth-register-${field}-error` : undefined);
  const renderRegisterError = (field) =>
    registerErrors[field] ? (
      <small className="auth-dialog__field-error" id={getRegisterErrorId(field)} role="alert">
        {registerErrors[field]}
      </small>
    ) : null;

  const getProfileErrorId = (field) => (profileErrors[field] ? `auth-profile-${field}-error` : undefined);
  const renderProfileError = (field) =>
    profileErrors[field] ? (
      <small className="auth-dialog__field-error" id={getProfileErrorId(field)} role="alert">
        {profileErrors[field]}
      </small>
    ) : null;

  const canSubmitLogin = useMemo(() => loginState.email && loginState.password, [loginState]);

  const normalizeComparableValue = (value) => {
    if (value == null) return '';
    if (typeof value === 'string') return value.trim();
    return value;
  };

  const canSubmitRegister = useMemo(() => {
    const { run, firstName, lastName, email, phone, password, street, region, comuna, birthDate } = registerState;
    return (
      run &&
      firstName &&
      lastName &&
      email &&
      phone &&
      password &&
      street &&
      region &&
      comuna &&
      birthDate
    );
  }, [registerState]);

  const canSubmitProfile = useMemo(() => {
    if (!user) return false;
    return (
      profileState.firstName.trim() &&
      profileState.lastName.trim() &&
      profileState.email.trim() &&
      profileState.phone.trim() &&
      profileState.street.trim() &&
      profileState.region.trim() &&
      profileState.comuna.trim() &&
      profileState.birthDate
    );
  }, [profileState, user]);

  const hasProfileChanges = useMemo(() => {
    if (!user) return false;
    const fields = ['firstName', 'lastName', 'email', 'phone', 'street', 'region', 'comuna', 'birthDate'];
    return fields.some((field) => normalizeComparableValue(profileState[field]) !== normalizeComparableValue(user[field]));
  }, [profileState, user]);

  const userOrders = useMemo(() => {
    if (!user) return [];
    return orders.filter((order) => order.userId === user.id).sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
  }, [orders, user]);

  const purchaseSummary = useMemo(
    () => buildPurchaseSummary({ orders, userId: user?.id, products }),
    [orders, user?.id],
  );

  const submitLogin = async (event) => {
    event.preventDefault();
    const errors = validateLoginForm(loginState);
    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      setLoginTouched((prev) => ({
        ...prev,
        ...Object.keys(errors).reduce((acc, field) => ({ ...acc, [field]: true }), {}),
      }));
      setLoginGeneralError('Corrige los campos marcados e inténtalo nuevamente.');
      return;
    }

    setLoginState((prev) => ({ ...prev, loading: true }));
    setSuccessMessage('');
    setLoginGeneralError('');
    try {
      await login({ email: loginState.email.trim(), password: loginState.password });
      setSuccessMessage('Inicio de sesión exitoso. Vamos a completar tus datos automáticamente.');
      setLoginState((prev) => ({ ...prev, loading: false }));
      setTimeout(handleClose, 1200);
    } catch (error) {
      setLoginState((prev) => ({ ...prev, loading: false }));
      setLoginGeneralError(error.message);
    }
  };

  const submitRegister = async (event) => {
    event.preventDefault();
    const validationErrors = validateRegisterForm(registerState);
    if (Object.keys(validationErrors).length > 0) {
      setRegisterErrors(validationErrors);
      setRegisterTouched((prev) => ({
        ...prev,
        ...Object.keys(validationErrors).reduce((acc, field) => ({ ...acc, [field]: true }), {}),
      }));
      setRegisterGeneralError('Corrige los campos destacados antes de continuar.');
      return;
    }

    const normalizedRun = formatRun(registerState.run);
    const normalizedPhone = normalizePhone(registerState.phone);
    const sanitizedState = {
      ...registerState,
      run: normalizedRun,
      phone: normalizedPhone,
      email: registerState.email.trim().toLowerCase(),
    };

    setRegisterState((prev) => ({ ...prev, loading: true }));
    setSuccessMessage('');
    setRegisterGeneralError('');
    try {
      await register(sanitizedState);
      setSuccessMessage('¡Registro exitoso! Te conectamos automáticamente.');
      setRegisterState({ ...initialRegisterState, loading: false });
      setRegisterErrors({});
      setRegisterTouched({});
      setTimeout(handleClose, 1200);
    } catch (error) {
      setRegisterState((prev) => ({ ...prev, loading: false }));
      if (error.message?.toLowerCase().includes('correo')) {
        setRegisterErrors((prev) => ({ ...prev, email: error.message }));
        setRegisterTouched((prev) => ({ ...prev, email: true }));
      }
      setRegisterGeneralError(error.message);
    }
  };

  const submitProfile = (event) => {
    event.preventDefault();
    if (!user) {
      return;
    }
    const validationErrors = validateProfileForm(profileState);
    if (Object.keys(validationErrors).length > 0) {
      setProfileErrors(validationErrors);
      setProfileTouched((prev) => ({
        ...prev,
        ...Object.keys(validationErrors).reduce((acc, field) => ({ ...acc, [field]: true }), {}),
      }));
      setProfileStatus({ loading: false, error: 'Corrige los campos destacados antes de guardar.', success: '' });
      return;
    }

    const normalizedPhone = normalizePhone(profileState.phone);
    const trimmedEmail = profileState.email.trim();

    setProfileStatus({ loading: true, error: '', success: '' });
    try {
      updateProfile({
        firstName: profileState.firstName.trim(),
        lastName: profileState.lastName.trim(),
        email: trimmedEmail,
        phone: normalizedPhone,
        street: profileState.street.trim(),
        region: profileState.region,
        comuna: profileState.comuna,
        birthDate: profileState.birthDate,
      });
      setProfileState((prev) => ({
        ...prev,
        firstName: prev.firstName.trim(),
        lastName: prev.lastName.trim(),
        email: trimmedEmail,
        phone: normalizedPhone,
        street: prev.street.trim(),
      }));
      setProfileErrors({});
      setProfileTouched({});
      setProfileStatus({ loading: false, error: '', success: 'Datos actualizados correctamente.' });
    } catch (error) {
      setProfileStatus({ loading: false, success: '', error: error.message });
    }
  };

  const renderMenu = () => (
    <div className="auth-dialog__menu">
      {user ? (
        <>
          <p>
            ¡Hola {user.firstName ?? user.email}! Gestiona tu perfil, revisa tus pedidos recientes o vuelve a comprar tus
            favoritos.
          </p>
          <div className="auth-dialog__menu-actions">
            <Button variant="primary" onClick={() => setView('account')}>
              Mi cuenta
            </Button>
            <Button variant="secondary" onClick={() => setView('orders')}>
              Historial de pedidos
            </Button>
            <Button variant="ghost" onClick={() => setView('purchases')}>
              Mis compras
            </Button>
          </div>
        </>
      ) : (
        <>
          <p>Accede con tu cuenta para reutilizar tus datos de facturación y coordinar entregas más rápido.</p>
          <div className="auth-dialog__menu-actions">
            <Button variant="primary" onClick={() => setView('login')}>
              Iniciar sesión
            </Button>
            <Button variant="secondary" onClick={() => setView('register')}>
              Crear cuenta
            </Button>
          </div>
          <small>
            Puedes usar el usuario de prueba <strong>cliente@milsabores.cl</strong> con contraseña <strong>MilSabores123</strong>.
          </small>
        </>
      )}
    </div>
  );

  const renderLogin = () => (
    <form className="auth-dialog__form" onSubmit={submitLogin}>
      <div className="auth-dialog__fields">
        <label className={loginErrors.email ? 'has-error' : ''}>
          <span>Correo electrónico</span>
            <input
            type="email"
            name="email"
            value={loginState.email}
            onChange={handleLoginChange}
            placeholder="cliente@milsabores.cl"
            onBlur={handleLoginBlur}
            aria-invalid={Boolean(loginErrors.email)}
            aria-describedby={getLoginErrorId('email')}
            required
          />
          {renderLoginError('email')}
        </label>
        <label className={loginErrors.password ? 'has-error' : ''}>
          <span>Contraseña</span>
          <input
            type="password"
            name="password"
            value={loginState.password}
            onChange={handleLoginChange}
            placeholder="Ingresa tu contraseña"
            onBlur={handleLoginBlur}
            aria-invalid={Boolean(loginErrors.password)}
            aria-describedby={getLoginErrorId('password')}
            required
          />
          {renderLoginError('password')}
        </label>
      </div>
      {loginGeneralError ? <p className="auth-dialog__error">{loginGeneralError}</p> : null}
      <div className="auth-dialog__actions">
        <Button type="submit" variant="primary" disabled={!canSubmitLogin || loginState.loading}>
          {loginState.loading ? 'Validando…' : 'Iniciar sesión'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setView('menu')}>
          Volver
        </Button>
      </div>
    </form>
  );

  const renderRegister = () => (
    <form className="auth-dialog__form" onSubmit={submitRegister}>
      <div className="auth-dialog__grid">
        <label className={registerErrors.run ? 'has-error' : ''}>
          <span>RUN</span>
          <input
            type="text"
            name="run"
            value={registerState.run}
            onChange={handleRegisterChange}
            placeholder="12345678-K"
            onBlur={handleRegisterBlur}
            aria-invalid={Boolean(registerErrors.run)}
            aria-describedby={getRegisterErrorId('run')}
            required
          />
          {renderRegisterError('run')}
        </label>
        <label className={registerErrors.firstName ? 'has-error' : ''}>
          <span>Nombre</span>
          <input
            type="text"
            name="firstName"
            value={registerState.firstName}
            onChange={handleRegisterChange}
            onBlur={handleRegisterBlur}
            aria-invalid={Boolean(registerErrors.firstName)}
            aria-describedby={getRegisterErrorId('firstName')}
            required
          />
          {renderRegisterError('firstName')}
        </label>
        <label className={registerErrors.lastName ? 'has-error' : ''}>
          <span>Apellidos</span>
          <input
            type="text"
            name="lastName"
            value={registerState.lastName}
            onChange={handleRegisterChange}
            onBlur={handleRegisterBlur}
            aria-invalid={Boolean(registerErrors.lastName)}
            aria-describedby={getRegisterErrorId('lastName')}
            required
          />
          {renderRegisterError('lastName')}
        </label>
        <label className={registerErrors.email ? 'has-error' : ''}>
          <span>Correo electrónico</span>
          <input
            type="email"
            name="email"
            value={registerState.email}
            onChange={handleRegisterChange}
            placeholder="nombre@dominio.cl"
            onBlur={handleRegisterBlur}
            aria-invalid={Boolean(registerErrors.email)}
            aria-describedby={getRegisterErrorId('email')}
            required
          />
          {renderRegisterError('email')}
        </label>
        <label className={registerErrors.phone ? 'has-error' : ''}>
          <span>Celular</span>
          <input
            type="tel"
            name="phone"
            value={registerState.phone}
            onChange={handleRegisterChange}
            placeholder="912345678"
            onBlur={handleRegisterBlur}
            aria-invalid={Boolean(registerErrors.phone)}
            aria-describedby={getRegisterErrorId('phone')}
            required
          />
          {renderRegisterError('phone')}
        </label>
        <label className={`auth-dialog__grid-span ${registerErrors.street ? 'has-error' : ''}`}>
          <span>Calle y número</span>
          <input
            type="text"
            name="street"
            value={registerState.street}
            onChange={handleRegisterChange}
            placeholder="Av. Siempre Viva 742, Depto 45"
            onBlur={handleRegisterBlur}
            aria-invalid={Boolean(registerErrors.street)}
            aria-describedby={getRegisterErrorId('street')}
            required
          />
          {renderRegisterError('street')}
        </label>
        <label className={registerErrors.region ? 'has-error' : ''}>
          <span>Región</span>
          <select
            name="region"
            value={registerState.region}
            onChange={handleRegisterRegionChange}
            onBlur={handleRegisterBlur}
            aria-invalid={Boolean(registerErrors.region)}
            aria-describedby={getRegisterErrorId('region')}
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
          {renderRegisterError('region')}
        </label>
        <label className={registerErrors.comuna ? 'has-error' : ''}>
          <span>Comuna</span>
          <select
            name="comuna"
            value={registerState.comuna}
            onChange={handleRegisterComunaChange}
            onBlur={handleRegisterBlur}
            aria-invalid={Boolean(registerErrors.comuna)}
            aria-describedby={getRegisterErrorId('comuna')}
            required
            disabled={!registerState.region}
          >
            <option value="" disabled>
              Selecciona una comuna
            </option>
            {registerCommunes.map((comuna) => (
              <option key={comuna} value={comuna}>
                {comuna}
              </option>
            ))}
          </select>
          {renderRegisterError('comuna')}
        </label>
        <label className={registerErrors.birthDate ? 'has-error' : ''}>
          <span>Fecha de nacimiento</span>
          <input
            type="date"
            name="birthDate"
            value={registerState.birthDate}
            onChange={handleRegisterChange}
            max={maxBirthDate}
            onBlur={handleRegisterBlur}
            aria-invalid={Boolean(registerErrors.birthDate)}
            aria-describedby={getRegisterErrorId('birthDate')}
            required
          />
          {renderRegisterError('birthDate')}
        </label>
        <label className={registerErrors.password ? 'has-error' : ''}>
          <span>Contraseña</span>
          <input
            type="password"
            name="password"
            value={registerState.password}
            onChange={handleRegisterChange}
            placeholder="Mínimo 6 caracteres"
            onBlur={handleRegisterBlur}
            aria-invalid={Boolean(registerErrors.password)}
            aria-describedby={getRegisterErrorId('password')}
            required
          />
          {renderRegisterError('password')}
        </label>
      </div>
      {registerGeneralError ? <p className="auth-dialog__error">{registerGeneralError}</p> : null}
      <div className="auth-dialog__actions">
        <Button type="submit" variant="primary" disabled={!canSubmitRegister || registerState.loading}>
          {registerState.loading ? 'Creando cuenta…' : 'Registrarme'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setView('menu')}>
          Volver
        </Button>
      </div>
    </form>
  );

  const renderAccount = () => (
    <section className="auth-dialog__section">
      <header className="auth-dialog__section-header">
        <h3>Datos de tu cuenta</h3>
        <p>Actualiza tu información personal para completar tus pedidos más rápido.</p>
      </header>
      <form className="auth-dialog__form" onSubmit={submitProfile}>
        <div className="auth-dialog__grid">
          <label className={profileErrors.firstName ? 'has-error' : ''}>
            <span>Nombre</span>
            <input
              type="text"
              name="firstName"
              value={profileState.firstName}
              onChange={handleProfileChange}
              onBlur={handleProfileBlur}
              aria-invalid={Boolean(profileErrors.firstName)}
              aria-describedby={getProfileErrorId('firstName')}
              required
            />
            {renderProfileError('firstName')}
          </label>
          <label className={profileErrors.lastName ? 'has-error' : ''}>
            <span>Apellidos</span>
            <input
              type="text"
              name="lastName"
              value={profileState.lastName}
              onChange={handleProfileChange}
              onBlur={handleProfileBlur}
              aria-invalid={Boolean(profileErrors.lastName)}
              aria-describedby={getProfileErrorId('lastName')}
              required
            />
            {renderProfileError('lastName')}
          </label>
          <label>
            <span>RUN</span>
            <input type="text" name="run" value={profileState.run} disabled readOnly />
          </label>
          <label className={profileErrors.email ? 'has-error' : ''}>
            <span>Correo electrónico</span>
            <input
              type="email"
              name="email"
              value={profileState.email}
              onChange={handleProfileChange}
              onBlur={handleProfileBlur}
              aria-invalid={Boolean(profileErrors.email)}
              aria-describedby={getProfileErrorId('email')}
              required
            />
            {renderProfileError('email')}
          </label>
          <label className={profileErrors.phone ? 'has-error' : ''}>
            <span>Celular</span>
            <input
              type="tel"
              name="phone"
              value={profileState.phone}
              onChange={handleProfileChange}
              placeholder="912345678"
              onBlur={handleProfileBlur}
              aria-invalid={Boolean(profileErrors.phone)}
              aria-describedby={getProfileErrorId('phone')}
              required
            />
            {renderProfileError('phone')}
          </label>
          <label className={`auth-dialog__grid-span ${profileErrors.street ? 'has-error' : ''}`}>
            <span>Calle y número</span>
            <input
              type="text"
              name="street"
              value={profileState.street}
              onChange={handleProfileChange}
              placeholder="Av. Siempre Viva 742, Depto 45"
              onBlur={handleProfileBlur}
              aria-invalid={Boolean(profileErrors.street)}
              aria-describedby={getProfileErrorId('street')}
              required
            />
            {renderProfileError('street')}
          </label>
          <label className={profileErrors.region ? 'has-error' : ''}>
            <span>Región</span>
            <select
              name="region"
              value={profileState.region}
              onChange={handleProfileRegionChange}
              onBlur={handleProfileBlur}
              aria-invalid={Boolean(profileErrors.region)}
              aria-describedby={getProfileErrorId('region')}
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
            {renderProfileError('region')}
          </label>
          <label className={profileErrors.comuna ? 'has-error' : ''}>
            <span>Comuna</span>
            <select
              name="comuna"
              value={profileState.comuna}
              onChange={handleProfileComunaChange}
              onBlur={handleProfileBlur}
              aria-invalid={Boolean(profileErrors.comuna)}
              aria-describedby={getProfileErrorId('comuna')}
              required
              disabled={!profileState.region}
            >
              <option value="" disabled>
                Selecciona una comuna
              </option>
              {profileCommunes.map((comuna) => (
                <option key={comuna} value={comuna}>
                  {comuna}
                </option>
              ))}
            </select>
            {renderProfileError('comuna')}
          </label>
          <label className={profileErrors.birthDate ? 'has-error' : ''}>
            <span>Fecha de nacimiento</span>
            <input
              type="date"
              name="birthDate"
              value={profileState.birthDate}
              onChange={handleProfileChange}
              max={maxBirthDate}
              onBlur={handleProfileBlur}
              aria-invalid={Boolean(profileErrors.birthDate)}
              aria-describedby={getProfileErrorId('birthDate')}
              required
            />
            {renderProfileError('birthDate')}
          </label>
        </div>
        {profileStatus.error ? <p className="auth-dialog__error">{profileStatus.error}</p> : null}
        {profileStatus.success ? <p className="auth-dialog__success">{profileStatus.success}</p> : null}
        <div className="auth-dialog__actions">
          <Button
            type="submit"
            variant="primary"
            disabled={!canSubmitProfile || profileStatus.loading || !hasProfileChanges}
          >
            {profileStatus.loading ? 'Guardando…' : 'Guardar cambios'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => setView('orders')}>
            Ver historial de pedidos
          </Button>
        </div>
      </form>
    </section>
  );

  const renderOrders = () => (
    <section className="auth-dialog__section">
      <header className="auth-dialog__section-header">
        <h3>Historial de pedidos</h3>
        <p>Revisa el estado y detalle de tus compras recientes en Mil Sabores.</p>
      </header>
      {userOrders.length === 0 ? (
        <div className="auth-dialog__empty">
          <p>Aún no registramos pedidos asociados a tu cuenta.</p>
          <Button type="button" variant="primary" onClick={() => setView('menu')}>
            Explorar opciones de compra
          </Button>
        </div>
      ) : (
        <ul className="auth-dialog__order-list">
          {userOrders.map((order) => {
            const statusSlug = slugify(order.status);
            return (
              <li key={order.id} className="auth-dialog__order-item">
                <header>
                  <div>
                    <strong>Pedido {order.number}</strong>
                    <span>{formatDateLong(order.placedAt)}</span>
                  </div>
                  <span className={`auth-dialog__badge auth-dialog__badge--${statusSlug}`}>{order.status}</span>
                </header>
                <ul className="auth-dialog__order-products">
                  {order.items.map((item) => (
                    <li key={`${order.id}-${item.codigo}`}>
                      <span>
                        {item.nombre}
                        <small>x{item.cantidad}</small>
                      </span>
                      <strong>{formatCurrency(item.precio * item.cantidad)}</strong>
                    </li>
                  ))}
                </ul>
                <footer>
                  <div>
                    <span>Método de entrega</span>
                    <strong>{order.deliveryMethod}</strong>
                  </div>
                  <div>
                    <span>Método de pago</span>
                    <strong>{order.paymentMethod}</strong>
                  </div>
                  <div>
                    <span>Total pagado</span>
                    <strong>{formatCurrency(order.total)}</strong>
                  </div>
                </footer>
              </li>
            );
          })}
        </ul>
      )}
      <div className="auth-dialog__actions auth-dialog__actions--end">
        <Button type="button" variant="ghost" onClick={() => setView('account')}>
          Volver a mi cuenta
        </Button>
      </div>
    </section>
  );

  const renderPurchases = () => (
    <section className="auth-dialog__section">
      <header className="auth-dialog__section-header">
        <h3>Mis compras</h3>
        <p>Un resumen con tus productos favoritos y la última vez que los encargaste.</p>
      </header>
      {purchaseSummary.length === 0 ? (
        <div className="auth-dialog__empty">
          <p>Todavía no registramos compras asociadas a tu cuenta.</p>
          <Button type="button" variant="primary" onClick={() => setView('orders')}>
            Revisar historial
          </Button>
        </div>
      ) : (
        <ul className="auth-dialog__purchase-list">
          {purchaseSummary.map((item) => (
            <li key={item.codigo} className="auth-dialog__purchase-item">
              {item.imagen ? <img src={item.imagen} alt={item.nombre} /> : <div className="auth-dialog__placeholder" aria-hidden="true">{item.nombre[0]}</div>}
              <div>
                <strong>{item.nombre}</strong>
                <span>{item.cantidad} {item.cantidad === 1 ? 'unidad' : 'unidades'} encargadas</span>
                <small>Última compra: {formatDateLong(item.ultimaCompra)}</small>
              </div>
              <div className="auth-dialog__purchase-total">
                <span>Total invertido</span>
                <strong>{formatCurrency(item.total)}</strong>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="auth-dialog__actions auth-dialog__actions--end">
        <Button type="button" variant="ghost" onClick={() => setView('orders')}>
          Revisar pedidos
        </Button>
      </div>
    </section>
  );

  const isAccountView = ACCOUNT_VIEWS.includes(view);

  const accountTabs = isAccountView && user ? (
    <nav className="auth-dialog__tabs" role="tablist">
      <button
        type="button"
        className={view === 'account' ? 'is-active' : ''}
        onClick={() => setView('account')}
        aria-selected={view === 'account'}
      >
        Mi cuenta
      </button>
      <button
        type="button"
        className={view === 'orders' ? 'is-active' : ''}
        onClick={() => setView('orders')}
        aria-selected={view === 'orders'}
      >
        Historial de pedidos
      </button>
      <button
        type="button"
        className={view === 'purchases' ? 'is-active' : ''}
        onClick={() => setView('purchases')}
        aria-selected={view === 'purchases'}
      >
        Mis compras
      </button>
    </nav>
  ) : null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Tu cuenta Mil Sabores" size="lg">
      {successMessage && !isAccountView ? <p className="auth-dialog__success">{successMessage}</p> : null}
      {accountTabs}
      {view === 'menu' ? renderMenu() : null}
      {view === 'login' ? renderLogin() : null}
      {view === 'register' ? renderRegister() : null}
      {view === 'account' && user ? renderAccount() : null}
      {view === 'orders' && user ? renderOrders() : null}
      {view === 'purchases' && user ? renderPurchases() : null}
      {isAccountView && !user ? (
        <div className="auth-dialog__empty">
          <p>Debes iniciar sesión para revisar esta sección.</p>
          <Button type="button" variant="primary" onClick={() => setView('login')}>
            Iniciar sesión
          </Button>
        </div>
      ) : null}
    </Modal>
  );
};

export default AuthDialog;
