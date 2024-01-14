import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import siteSettingsContext from "../../context/siteSettingsContext";
import LinePreloader from "../UI/LinePreloader";

const EventsCalendarClass = ({
  subject,
  courseID,
  course,
  getCourseToSave,
  isLast,
  empty,
  holiday,
}) => {
  const { lang, translate } = useContext(siteSettingsContext);

  useEffect(() => {
    if (!course) {
      getCourseToSave(subject, courseID, isLast);
    }
  });

  return (
    <div className="eventsCalendar__date-content-item">
      {course ? (
        <Link
          to={"/courses/" + courseID}
          title={course.name[lang] ? course.name[lang] : course.name["ua"]}
        >
          {course.name[lang] ? course.name[lang] : course.name["ua"]}
        </Link>
      ) : empty === "holiday" ? (
        <div
          className="eventsCalendar__date-content-item-empty"
          title={holiday.name[lang]}
        >
          {holiday.name[lang]}
        </div>
      ) : empty === "weekend" ? (
        <div className="eventsCalendar__date-content-item-empty" />
      ) : empty === "vacation" ? (
        <div className="eventsCalendar__date-content-item-empty">
          {translate("vacation")}
        </div>
      ) : empty === "noClasses" ? (
        <div className="eventsCalendar__date-content-item-empty">
          {translate("dayoff")}
        </div>
      ) : !empty ? (
        <LinePreloader />
      ) : null}
    </div>
  );
};

export default EventsCalendarClass;
