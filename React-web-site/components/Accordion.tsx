import React, { useState, useReducer, useEffect, useContext } from "react";
import AccordionItem from "./AccordionItem";
import {
  fetchData,
  accordionReducer,
  initialStateAccordion,
} from "../utils/fetchData";
import { LanguageContext } from "../App";

const Accordion: React.FC = () => {
  const { language } = useContext(LanguageContext);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [state, dispatch] = useReducer(accordionReducer, initialStateAccordion);

  useEffect(() => {
    let dbFileName: string;

    dbFileName = "faq";

    fetchData(language, dbFileName, dispatch);
  }, [language]);
  const { contentDataArray, error, loading } = state;

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return (
    <div className="accordion-container">
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!loading && !error && contentDataArray.length === 0 && (
        <div>No data available.</div>
      )}
      {contentDataArray.map((item, index) => (
        <div key={item.id} className="accordion-item">
          <AccordionItem
            key={item.id}
            question={item.question}
            answer={item.answer}
            isActive={activeIndex === index}
            onClick={() => toggleAccordion(index)}
          />
        </div>
      ))}
    </div>
  );
};

export default Accordion;
