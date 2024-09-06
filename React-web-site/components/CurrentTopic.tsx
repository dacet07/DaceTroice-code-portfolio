import React, { useReducer, useEffect, useContext } from "react";
import {
  fetchData,
  contentReducer,
  initialStateContent,
} from "../utils/fetchData";
import { LanguageContext } from "../App";

interface CurrentTopicProps {
  dbName: "about" | "courses" | "sertification";
  type:
    | "about"
    | "courses"
    | "tig"
    | "mag"
    | "mig"
    | "mma"
    | "qualification"
    | "companies"
    | "unemployed"
    | "how-to-choose"
    | "sertification"
    | "learner"
    | "company"
    | "team"
    | "services";
  image: string;
}

const CurrentTopic: React.FC<CurrentTopicProps> = ({ dbName, type, image }) => {
  const { language } = useContext(LanguageContext);
  const [state, dispatch] = useReducer(contentReducer, initialStateContent);

  useEffect(() => {
   
    fetchData(language, dbName, dispatch);
  }, []);

  const { contentDataArray, error, loading } = state;
 
  const contentData = contentDataArray.find(
    (contentData) => contentData.id === type
  );

  return (
    <div className="topic-container">
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!loading && !error && contentDataArray.length === 0 && (
        <div>No data available.</div>
      )}
      {contentData && (
        <>
          <div className="topic-item1">
            <img
              className="current-topic-img"
              src={image}
              alt={`${contentData.title} image`}
            />
          </div>
          <div className="topic-item2">
            <h2>{contentData.title.toUpperCase()}</h2>
          </div>
          <div className="topic-item3">
            <p className="topic-text">{contentData.description}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default CurrentTopic;
