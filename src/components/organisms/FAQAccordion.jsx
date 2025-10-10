import React, { useState } from 'react';
import SectionTitle from '../atoms/SectionTitle';
import AccordionItem from '../molecules/AccordionItem';
import './FAQAccordion.css';

const FAQAccordion = ({ items, title = 'Preguntas frecuentes', description }) => {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (id) => {
    setOpenItem((prev) => (prev === id ? null : id));
  };

  if (!items?.length) {
    return null;
  }

  return (
    <section className="faq-accordion" aria-label="Preguntas frecuentes">
      <div className="faq-accordion__intro">
        <SectionTitle as="h2" align="left">
          {title}
        </SectionTitle>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="faq-accordion__list">
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            id={item.id}
            title={item.question}
            isOpen={openItem === item.id}
            onToggle={() => toggleItem(item.id)}
          >
            <p>{item.answer}</p>
            {Array.isArray(item.details) ? (
              <ul className="faq-accordion__details">
                {item.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            ) : null}
          </AccordionItem>
        ))}
      </div>
    </section>
  );
};

export default FAQAccordion;
