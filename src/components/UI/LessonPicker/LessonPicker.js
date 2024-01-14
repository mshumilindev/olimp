import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import Modal from "../Modal/Modal";
import siteSettingsContext from "../../../context/siteSettingsContext";
import LessonPickerSubject from "./LessonPickerSubject";
import { orderBy } from "natural-orderby";
import "./lessonPicker.scss";
import { Scrollbars } from "react-custom-scrollbars";

function LessonPicker({ user, coursesList, setLesson, selectedLesson }) {
  const { translate, lang } = useContext(siteSettingsContext);
  const [showModal, setShowModal] = useState(false);
  const [pickedLesson, setPickedLesson] = useState(
    selectedLesson ? selectedLesson : null,
  );

  useEffect(() => {
    if (!showModal) {
      setPickedLesson(selectedLesson ? selectedLesson : null);
    }
  }, [showModal]);

  return (
    <div className="lessonPicker">
      <div className="lessonPicker__info">
        {selectedLesson && selectedLesson.subjectID ? (
          <>
            <div className="lessonPicker__selectedLesson">
              <i className="content_title-icon fa fa-paragraph" />
              <div>
                <span>{selectedLesson.subjectName}</span>
                <span>{selectedLesson.courseName}</span>
                <span>{selectedLesson.moduleName}</span>
                <span>{selectedLesson.lessonName}</span>
              </div>
            </div>
            <span
              className="lessonPicker__remove"
              onClick={() => setLesson(null)}
            >
              <i className="fa fa-trash-alt" />
            </span>
          </>
        ) : (
          <div className="nothingFound">{translate("nothing_found")}</div>
        )}
      </div>
      <div className="userPicker__add">
        <span
          className="userPicker__add-btn"
          onClick={() => setShowModal(true)}
        >
          <i className="fa fa-pencil-alt" />
          <span className="userPicker__placeholder">
            {translate("pick_lesson")}
          </span>
        </span>
      </div>
      {showModal ? (
        <Modal
          heading={translate("pick_lesson")}
          onHideModal={() => setShowModal(false)}
        >
          <div className="lessonPicker__subjectsList">
            <Scrollbars
              autoHeight
              hideTracksWhenNotNeeded
              autoHeightMax={500}
              renderTrackVertical={(props) => (
                <div {...props} className="scrollbar__track" />
              )}
              renderView={(props) => (
                <div {...props} className="scrollbar__content" />
              )}
            >
              {coursesList ? (
                filterCoursesList().length ? (
                  orderBy(filterCoursesList(), (v) =>
                    v.name[lang] ? v.name[lang] : v.name["ua"],
                  ).map((subjectItem) => (
                    <LessonPickerSubject
                      subject={subjectItem}
                      key={subjectItem.id}
                      setLesson={handleSetLesson}
                      pickedLesson={pickedLesson}
                    />
                  ))
                ) : (
                  <div className="nothingFound">
                    {translate("nothing_found")}
                  </div>
                )
              ) : null}
            </Scrollbars>
          </div>
          <div className="lessonPicker__pick" onClick={pickLesson}>
            <span className="btn btn_primary">
              <i className="content_title-icon fa fa-pencil-alt" />
              {translate("pick")}
            </span>
          </div>
        </Modal>
      ) : null}
    </div>
  );

  function handleSetLesson(newLesson) {
    setPickedLesson(newLesson);
  }

  function pickLesson() {
    setLesson(pickedLesson);
    setShowModal(false);
  }

  function filterCoursesList() {
    return coursesList
      .filter((subjectItem) => subjectItem.coursesList.length)
      .filter((subjectItem) =>
        subjectItem.coursesList.some(
          (courseItem) => courseItem.teacher === user.id,
        ),
      );
  }
}

const mapStateToProps = (state) => {
  return {
    coursesList: state.coursesReducer.coursesList,
    user: state.authReducer.currentUser,
  };
};

export default connect(mapStateToProps)(LessonPicker);
