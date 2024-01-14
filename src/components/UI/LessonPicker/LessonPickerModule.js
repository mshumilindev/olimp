import React, { useContext, useEffect, useState } from "react";
import siteSettingsContext from "../../../context/siteSettingsContext";
import LessonPickerLesson from "./LessonPickerLesson";
import { orderBy } from "natural-orderby";
import { db } from "../../../db/firestore";
import { collection, getDocs } from "firebase/firestore";

export default function LessonPickerModule({
  subjectID,
  courseID,
  module,
  setLesson,
  pickedLesson,
  subjectName,
  courseName,
}) {
  const { translate, lang } = useContext(siteSettingsContext);
  const [lessonsList, setLessonsList] = useState(null);

  useEffect(() => {
    const lessonsRef = collection(
      db,
      "courses",
      subjectID,
      "coursesList",
      courseID,
      "modules",
      module.id,
      "lessons",
    );

    getDocs(lessonsRef).then((snapshot) => {
      if (snapshot.docs.length) {
        setLessonsList(
          snapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id };
          }),
        );
      } else {
        setLessonsList([]);
      }
    });
  }, []);

  return (
    <div className="lessonPicker__module">
      <i className="content_title-icon fa fa-book-open" />
      {module.name[lang] ? module.name[lang] : module.name["ua"]}
      {lessonsList ? (
        <div className="lessonPicker__lessonsList">
          {lessonsList.length ? (
            orderBy(lessonsList, (v) => v.index).map((lessonItem) => {
              return (
                <LessonPickerLesson
                  lesson={lessonItem}
                  key={lessonItem.id}
                  setLesson={setLesson}
                  subjectID={subjectID}
                  subjectName={subjectName}
                  courseID={courseID}
                  courseName={courseName}
                  moduleID={module.id}
                  moduleName={
                    module.name[lang] ? module.name[lang] : module.name["ua"]
                  }
                  pickedLesson={pickedLesson}
                />
              );
            })
          ) : (
            <div className="lessonPicker__дуыыщт notFound">
              <i className="content_title-icon fa fa-unlink" />
              {translate("no_lessons")}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
