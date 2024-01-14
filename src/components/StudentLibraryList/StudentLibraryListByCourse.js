import React, { useContext, useEffect, useState } from "react";
import siteSettingsContext from "../../context/siteSettingsContext";
import { Link } from "react-router-dom";
import StudentTextbook from "../StudentTextbook/StudentTextbook";
import { collection, doc, getDoc } from "firebase/firestore"; 
import { db } from "../../db/firestore";

export default function StudentLibraryListByCourse({ courseItem, list }) {
  const { lang } = useContext(siteSettingsContext);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);
  const { translate } = useContext(siteSettingsContext);

  useEffect(() => {
    const subjectRef = doc(db, 'courses', courseItem.subject);

    getDoc(subjectRef).then((doc) => {
      if (doc.exists) {
        setCurrentSubject({
          ...doc.data(),
          id: doc.id,
        });
      }
    });
  }, []);

  useEffect(() => {
    if (currentSubject) {
      const courseRef = doc(db, 'courses', courseItem.subject, 'coursesList', courseItem.course);

      getDoc(courseRef).then((doc) => {
        if (doc.exists) {
          setCurrentCourse({
            ...doc.data(),
            id: doc.id,
          });
        }
      });
    }
  }, [currentSubject]);

  if (!currentCourse) {
    return null;
  }

  return (
    <div className="library__list-course">
      <div className="library__list-courseName">
        <div className="library__list-courseName-subject">
          {currentSubject.name[lang]
            ? currentSubject.name[lang]
            : currentSubject.name["ua"]}
        </div>
        <Link to={"/courses/" + courseItem.subject + "/" + courseItem.course}>
          {currentCourse.name[lang]
            ? currentCourse.name[lang]
            : currentCourse.name["ua"]}
        </Link>
      </div>
      {filterLibrary().length ? (
        <div className="library__list-textbooks">
          {filterLibrary().map((docItem) => _renderLibraryItem(docItem))}
        </div>
      ) : (
        <div className="library__list-textbooks">
          <div className="library__list-textbooksItem library__list-notFound">
            <div className="library__list-textbookIcon">
              <i className="fa fa-unlink" />
            </div>
            {translate("no_textbook")}
          </div>
        </div>
      )}
    </div>
  );

  function _renderLibraryItem(docItem) {
    if (!docItem) {
      return null;
    }
    return (
      <div className="library__list-textbooksItem" key={docItem.id}>
        <StudentTextbook docRef={docItem.ref} name={docItem.name} />
      </div>
    );
  }

  function filterLibrary() {
    if (currentCourse.textbook) {
      if (typeof currentCourse.textbook === "object") {
        return currentCourse.textbook.map((item) => {
          return list.find((listItem) => listItem.id === item);
        });
      } else {
        return list.find((listItem) => listItem.id === currentCourse.textbook);
      }
    }
    return [];
  }
}
