import React, { useReducer, useEffect, useState, useContext } from "react";
import Button from "./Button";
import InputForm from "./InputForm";
import { ParagraphContentItem, ContentData } from "../types/types";
import { LanguageContext } from "../App";
import variousNames from "../utils/variousNames";


import {
  fetchData,
  contentReducer,
  initialStateContent,
} from "../utils/fetchData";

type ContentProps = {
  type:
    | "about"
    | "courses"
    | "default"
    | "all"
    | "tig"
    | "mag"
    | "mig"
    | "mma"
    | "qualification"
    | "companies"
    | "unemployed"
    | "howToChoose"
    | "sertification"
    | "learner"
    | "company"
    | "team"
    | "documents"
    | "services";
};

const Content: React.FC<ContentProps> = ({ type }) => {
  const { language } = useContext(LanguageContext);

  const [state, dispatch] = useReducer(contentReducer, initialStateContent);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const varNames = variousNames[language];

  useEffect(() => {
    let dbFileName: string;

    switch (type) {
      case "about":
      case "company":
      case "team":
      case "documents":
      case "services":
        dbFileName = "about";
        break;
      case "sertification":
        dbFileName = "sertification";
        break;
      case "learner":
        dbFileName = "learner";
        break;
      default:
        dbFileName = "courses";
    }

    fetchData(language, dbFileName, dispatch);
  }, [type, language]);

  let formType: "course" | "company" | "contacts" | "qualification";

  if (type === "companies") {
    formType = "company";
  } else if (type === "qualification") {
    formType = "qualification";
  } else {
    formType = "course";
  }

  const { contentDataArray, error, loading } = state;

  const renderMainContentItem = (item: ParagraphContentItem) => {
    switch (item.type) {
      case "bold":
        return <strong className="simple-text-bold">{item.content}</strong>;
      case "normal":
        return item.content;
      default:
        return null;
    }
  };

  const renderContentData = (contentData: ContentData) => (
    
    <div key={contentData.id}>
      <header>
        <img
          className="article-img"
          src={imageMap[contentData.image]}
          alt="Description of the image"
        />
        <h2>{contentData.title.toUpperCase()}</h2>
        {contentData.nextCourse ? (
          <p className="accent-info">
            Nākošie kursi sāksies: <strong>{contentData.nextCourse}</strong>
          </p>
        ) : (
          <p className="accent-info"> </p>
        )}
      </header>

      {contentData.mainInfo.map((item, index) => (
        <div key={index} className="article-content-main">
          {item.type === "subtitle" && <h3>{item.content as string}</h3>}
          {item.type === "paragraph" && Array.isArray(item.content) && (
            <p className="simple-text">
              {(item.content as ParagraphContentItem[]).map(
                (subItem, subIndex) => (
                  <React.Fragment key={subIndex}>
                    {renderMainContentItem(subItem)}
                  </React.Fragment>
                )
              )}
            </p>
          )}
          
          {item.type === "list" && Array.isArray(item.content) && (
            <ul className="basic-list">
              {(item.content as string[]).map((listItem, listIndex) => (
                <li key={listIndex}>{listItem}</li>
              ))}
            </ul>
          )}

          {item.type === "button" && !isFormVisible && (
            <Button
              label={item.content}
              onClick={() => setIsFormVisible(true)}
              className="apply"
            />
          )}
          {item.type === "pdfLink" && (
            <a
              className="pdf-link"
              href={item.link as string}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.content as string}
            </a>
          )}
        </div>
      ))}
      {isFormVisible && (
        <div className="apply-form">
          <Button
            label="&times;"
            className="close"
            onClick={() => setIsFormVisible(false)}
          />
          <InputForm courseType={contentData.id} formType={formType} />
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    {
      loading && <div>Loading...</div>;
    }
    {
      error && <div>{error}</div>;
    }
    const contentData = contentDataArray.find(
      (contentData) => contentData.id === type
    );

    if (contentData) {
      return <div>{renderContentData(contentData)}</div>;
    } else if (type === "about") {
      return "About Page Content";
    } else {
      return <div>Default Content</div>;
    }
  };

  return (
    <article className="article">
      <div className="article-content">{renderContent()}</div>

      <footer className="article-footer">
        <p>{varNames.articleFooter}</p>
      </footer>
    </article>
  );
};

export default Content;
