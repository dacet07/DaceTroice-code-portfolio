import React, { useReducer, useEffect, useContext } from "react";
import {
  fetchData,
  contentReducer,
  initialStateContent,
} from "../utils/fetchData";
import { LanguageContext } from "../App";

const Calendar: React.FC = () => {
  const { language } = useContext(LanguageContext);
  const [state, dispatch] = useReducer(contentReducer, initialStateContent);

  useEffect(() => {
    fetchData(language, "courses", dispatch);
  }, []);

  const { contentDataArray, error, loading } = state;
  // Filter
  const allowedIds = ["tig", "mag", "mig", "mma"];

  // Filter the array
  const filteredContentDataArray = contentDataArray.filter((content) =>
    allowedIds.includes(content.id)
  );

  const nextCourses = filteredContentDataArray.map(({ id, nextCourse }) => ({
    id,
    nextCourse,
  }));
  console.log(nextCourses);

  const nextCoursesTrue = !filteredContentDataArray.every(
    ({ nextCourse }) => nextCourse === ""
  );

   return (
    <div className="calendar-container">
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!loading && !error && contentDataArray.length === 0 && (
        <div>No data available.</div>
      )}
      {filteredContentDataArray.length > 0 && nextCoursesTrue ? (
        <>
          <h3 className="calendar-h3">Nākošie kursi sāksies:</h3>
          {filteredContentDataArray.map((item) =>
            item.nextCourse !== "" ? (
              <p className="calendar-text" key={item.id}>
                <strong className="calendar-text-bold">
                  {item.id.toUpperCase()}:&nbsp;
                </strong>
                {item.nextCourse}
              </p>
            ) : null
          )}
        </>
      ) : (
        <div className="no-content"></div>
      )}
    </div>
  );
};

export default Calendar;
