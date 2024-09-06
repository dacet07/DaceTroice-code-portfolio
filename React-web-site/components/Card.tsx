import React from 'react';
import { Link } from "react-router-dom";

interface CardProps {
  link:string;
  image: string;
  title: string;
  description: string;
}


const Card: React.FC<CardProps> = ({link, image, title, description}) => {

   return (
    <Link to={link} className="card-link">
    <div className="card">
      <img className="card-img" src={image} alt="Picture"></img>
      <h3>{title}</h3>
      <p className="card-p">
        {description}
      </p>
    </div>
    </Link>
  );
};

export default Card;
