import React, { useContext } from "react";
import siteSettingsContext from "../../../context/siteSettingsContext";
import classNames from "classnames";

export default function LessonPickerLesson({
  subjectID,
  courseID,
  moduleID,
  lesson,
  setLesson,
  pickedLesson,
  subjectName,
  courseName,
  moduleName,
}) {
  const { lang } = useContext(siteSettingsContext);

  return (
    <div
      className={classNames("lessonPicker__lesson", {
        isPicked: isLessonPicked(),
      })}
      onClick={() =>
        setLesson({
          subjectID: subjectID,
          subjectName: subjectName,
          courseID: courseID,
          courseName: courseName,
          moduleID: moduleID,
          moduleName: moduleName,
          lessonID: lesson.id,
          lessonName: lesson.name[lang] ? lesson.name[lang] : lesson.name["ua"],
        })
      }
    >
      {isLessonPicked() ? (
        <i className="content_title-icon far fa-dot-circle" />
      ) : (
        <i className="content_title-icon far fa-circle" />
      )}
      <div className="lessonPicker__lesson-name">
        {lesson.name[lang] ? lesson.name[lang] : lesson.name["ua"]}
      </div>
    </div>
  );

  function isLessonPicked() {
    return (
      pickedLesson &&
      pickedLesson.subjectID === subjectID &&
      pickedLesson.courseID === courseID &&
      pickedLesson.moduleID === moduleID &&
      pickedLesson.lessonID === lesson.id
    );
  }
}
