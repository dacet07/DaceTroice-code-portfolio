import React from 'react';
import Content from "../components/Content";

type AboutProps = {
  type: "about" | "company" | "team" | "documents" | "services"  ;
};

const About: React.FC<AboutProps> = ({ type }) => {
  return (
       
            <Content type={type}/>
        )
  
};

export default About;