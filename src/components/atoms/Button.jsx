import React from 'react';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  as: Component = 'button',
  type = 'button',
  ...props
}) => {
  const baseClasses = [
    'ms-button',
    `ms-button--${variant}`,
    `ms-button--${size}`,
    fullWidth ? 'ms-button--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const componentProps = {
    className: baseClasses,
    ...props,
  };

  if (Component === 'button') {
    componentProps.type = type;
  }

  return <Component {...componentProps}>{children}</Component>;
};

export default Button;
