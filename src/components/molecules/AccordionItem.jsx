import React, { useEffect, useRef } from 'react';
import './AccordionItem.css';

const AccordionItem = ({ id, title, children, isOpen, onToggle }) => {
  const contentId = `${id}-content`;
  const buttonId = `${id}-trigger`;
  const contentRef = useRef(null);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const handleTransitionEnd = (event) => {
      if (event.propertyName !== 'height') return;
      if (isOpen) {
        node.style.height = 'auto';
      }
    };

    node.addEventListener('transitionend', handleTransitionEnd);

    if (isOpen) {
      const scrollHeight = node.scrollHeight;
      node.style.height = `${scrollHeight}px`;
    } else {
      if (node.style.height === 'auto') {
        const currentHeight = node.scrollHeight;
        node.style.height = `${currentHeight}px`;
        requestAnimationFrame(() => {
          node.style.height = '0px';
        });
      } else {
        node.style.height = '0px';
      }
    }

    return () => {
      node.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [isOpen, children]);

  useEffect(() => {
    const node = contentRef.current;
    if (!node || !isOpen) {
      if (node) {
        node.style.height = '0px';
      }
      return;
    }

    const updateHeight = () => {
      if (!contentRef.current) return;
      const el = contentRef.current;
      el.style.height = 'auto';
      const inner = el.firstElementChild;
      const nextHeight = inner ? inner.getBoundingClientRect().height : el.scrollHeight;
      el.style.height = `${nextHeight}px`;
    };

    updateHeight();

    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const innerNode = node.firstElementChild;
    if (!innerNode) {
      return undefined;
    }

    const observer = new ResizeObserver(updateHeight);
    observer.observe(innerNode);

    return () => observer.disconnect();
  }, [isOpen, children]);

  return (
    <article className={`accordion-item ${isOpen ? 'is-open' : ''}`}>
      <h3 className="accordion-item__title">
        <button
          id={buttonId}
          type="button"
          className="accordion-item__trigger"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={onToggle}
        >
          <span>{title}</span>
          <span aria-hidden className="accordion-item__icon" />
        </button>
      </h3>
      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!isOpen}
        className="accordion-item__content"
        ref={contentRef}
      >
        <div className="accordion-item__inner">{children}</div>
      </div>
    </article>
  );
};

export default AccordionItem;
