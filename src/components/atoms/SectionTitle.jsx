import React from 'react';
import './SectionTitle.css';

const SectionTitle = ({ as: Component = 'h2', children, align = 'center', ...props }) => {
  return (
    <Component className={`section-title section-title--${align}`} {...props}>
      {children}
    </Component>
  );
};

export default SectionTitle;
