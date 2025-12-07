// src/components/ProcessCard.jsx
import React from "react";

const ProcessCard = ({ title, description, icon }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ProcessCard;
