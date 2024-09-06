import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CurrentTopic from "../components/CurrentTopic";
import Calendar from "../components/Calendar";
import reklama from "../assets/images/home-advert.jpg";
import reklamaSmall from "../assets/images/home-advert-mobile.jpg";
import PPLadvert from "../assets/images/ppl-baneris.jpg";
import { LanguageContext } from "../App";
import linkNames from "../utils/linkNames";

const Home: React.FC = () => {
  const { language } = useContext(LanguageContext);
  const links = linkNames[language];
console.log(`links ${language}/${links.courses}`)
  return (
    <div className="home">
      <header>
        <h2></h2>
      </header>
      <div className="current-advert">
        <Link className="home-link" to={`/${language}/${links.courses}`}>
        <picture>
            {/* Source for large screens */}
            <source media="(min-width: 1200px)" srcSet={reklama} />
            {/* Source for small to medium screens */}
            <source media="(max-width: 767px)" srcSet={reklamaSmall} />
            {/* Fallback image */}
            <img
              className="current-advert-img"
              src={reklama} 
              alt="Current advertisement"
            />
          </picture>
        </Link>
      </div>
      <div className="home-container">
        <div className="home-item" id="item1">
        <Link className="home-link" to={`/${language}/${links.certification}`}><CurrentTopic
            dbName="sertification"
            type="sertification"
            image="/images/sertification-small.jpg"
          /></Link>
        </div>
        <div className="home-item" id="item2">
          <Calendar />
        </div>

        <div className="home-item" id="item3">
        <Link className="home-link" to={`/${language}/${links.about}/${links.services}`}><CurrentTopic
            dbName="about"
            type="services"
            image="/images/services-small.jpg"
          /></Link>
        </div>
        <div className="home-item" id="item4">
          <div className="home-banner-container">
            <img className="home-banner" src={PPLadvert} alt="PPL advert" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
