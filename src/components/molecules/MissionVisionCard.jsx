import React from 'react';
import './MissionVisionCard.css';

const MissionVisionCard = ({ title, description }) => {
  return (
    <article className="mv-card">
      <h3 className="mv-card__title">{title}</h3>
      <p className="mv-card__description">{description}</p>
    </article>
  );
};

export default MissionVisionCard;
