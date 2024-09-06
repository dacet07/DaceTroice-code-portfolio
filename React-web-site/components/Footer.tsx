import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { LanguageContext } from "../App";
import variousNames from "../utils/variousNames";
import linkNames from "../utils/linkNames";


const Footer: React.FC = () => {

  const { language } = useContext(LanguageContext);
  const varNames = variousNames[language];
  const links = linkNames[language];

  return (
    <footer className="footer">
      <p>{varNames.footer}</p>
      <p><Link className="home-link" to={`${language}/${links.sitemap}`}>{varNames.sitemap}</Link></p>
    </footer>
  );
};

export default Footer;