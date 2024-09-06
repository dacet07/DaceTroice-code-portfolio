import React from "react";

interface AccordionItemProps {
  question: string;
  answer:string;
  isActive: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer, isActive, onClick }) => {
  
  return (
    <div className="accordion-item">
      <div
        className={`accordion-header ${isActive ? "active" : ""}`}
        onClick={onClick}
      >
        {question}
        <span className="accordion-icon">{isActive ? "-" : "+"}</span>
      </div>
      <div className={`accordion-content ${isActive ? "active" : ""}`}>
        {answer}
      </div>
    </div>
  );
};

export default AccordionItem;
