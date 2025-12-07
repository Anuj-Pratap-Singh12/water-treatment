// src/components/CaseStudyCard.jsx
import React from "react";

const CaseStudyCard = ({ title, summary, image }) => {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {image && <img src={image} alt={title} className="w-full h-48 object-cover" />}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{summary}</p>
      </div>
    </div>
  );
};

export default CaseStudyCard;
