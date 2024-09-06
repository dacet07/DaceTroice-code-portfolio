import React from "react";
import Container from "../components/Container";
import Content from "../components/Content";

type CoursesProps = {
  type: "all" | "tig" | "mag" | "mig" | "mma" | "qualification" | "companies" | "unemployed" | "howToChoose" ;
};

const Courses: React.FC<CoursesProps> = ({ type }) => {
  if (type === "all") {
    return <Container />;
  } else {
    return <Content type={type} />;
  }
};

export default Courses;
