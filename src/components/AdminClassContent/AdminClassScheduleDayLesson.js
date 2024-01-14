import React, { useContext } from "react";
import siteSettingsContext from "../../context/siteSettingsContext";

export default function AdminClassScheduleDayLesson({
  canEdit,
  coursesList,
  quickRemoveLesson,
  lesson,
}) {
  const { lang } = useContext(siteSettingsContext);
  const currentSubject = coursesList.find(
    (subject) => subject.id === lesson.subject,
  );

  if (!currentSubject) {
    return null;
  }

  const currentCourse = currentSubject.coursesList.find(
    (course) => course.id === lesson.course,
  );

  if (!currentCourse) {
    quickRemoveLesson(lesson);
    return null;
  }

  return (
    <div className="coursesPicker__selectedList-item">
      <div className="coursesPicker__selectedList-item-time">
        {lesson.time ? (
          <span>
            {lesson.time.start.split(":").splice(0, 2).join(":")} &mdash;{" "}
            {lesson.time.end.split(":").splice(0, 2).join(":")}
          </span>
        ) : null}
      </div>
      <div className="coursesPicker__selectedList-item-subject">
        {currentSubject.name[lang]
          ? currentSubject.name[lang]
          : currentSubject.name["ua"]}
      </div>
      <div className="coursesPicker__selectedList-item-course">
        {currentCourse.name[lang]
          ? currentCourse.name[lang]
          : currentCourse.name["ua"]}
      </div>
      {canEdit ? (
        <span
          className="coursesPicker__selectedList-item-remove"
          onClick={() => quickRemoveLesson(lesson)}
        >
          <i className="fa fa-trash-alt" />
        </span>
      ) : null}
    </div>
  );
}
