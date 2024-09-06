import React, { useContext } from "react";

import Accordion from "../components/Accordion";
import { LanguageContext } from "../App";
import variousNames from "../utils/variousNames";

const Sertification: React.FC = () => {

  const { language } = useContext(LanguageContext);
  const varNames = variousNames[language];
  return (
    <>
      <header>
        <h2>{varNames.faq}</h2>
      </header>
      <Accordion />
    </>
  );
};

export default Sertification;
