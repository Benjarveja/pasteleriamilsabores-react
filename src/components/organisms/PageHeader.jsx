import React from 'react';
import SectionTitle from '../atoms/SectionTitle';
import './PageHeader.css';

const backgroundVariants = {
  default: 'page-header--default',
  pastel: 'page-header--pastel',
  gradient: 'page-header--gradient',
};

const PageHeader = ({ eyebrow, title, description, backgroundVariant = 'default', align = 'center' }) => {
  const variantClass = backgroundVariants[backgroundVariant] ?? backgroundVariants.default;

  return (
    <header className={`page-header ${variantClass} page-header--${align}`}>
      <div className="page-header__content">
        {eyebrow ? <p className="page-header__eyebrow">{eyebrow}</p> : null}
        <SectionTitle as="h1" align={align}>
          {title}
        </SectionTitle>
        {description ? <p className="page-header__description">{description}</p> : null}
      </div>
    </header>
  );
};

export default PageHeader;
