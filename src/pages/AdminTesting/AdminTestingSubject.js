import React, { useCallback, useContext } from "react";
import { orderBy } from "natural-orderby";
import siteSettingsContext from "../../context/siteSettingsContext";
import AdminTestingCourse from "./AdminTestingCourse";
import { connect } from "react-redux";

function AdminTestingSubject({ user, subjectItem, tests, testID }) {
  const { lang } = useContext(siteSettingsContext);

  const filterCourses = useCallback(() => {
    return subjectItem.coursesList
      .filter((courseItem) => courseItem.teacher === user.id)
      .filter((courseItem) =>
        tests.some(
          (testItem) =>
            testItem.lesson.subjectID === subjectItem.id &&
            testItem.lesson.courseID === courseItem.id,
        ),
      );
  }, [subjectItem, user, tests]);

  return (
    <div className="adminTesting__subject widget">
      <div className="widget__title">
        <i className="content_title-icon fa fa-folder-open" />
        {subjectItem.name[lang]
          ? subjectItem.name[lang]
          : subjectItem.name["ua"]}
      </div>
      {filterCourses().length ? (
        <div className="adminTesting__coursesList">
          {orderBy(filterCourses(), (v) =>
            v.name[lang] ? v.name[lang] : v.name["ua"],
          )
            .filter((courseItem) => courseItem.teacher === user.id)
            .map((courseItem) => (
              <AdminTestingCourse
                course={courseItem}
                tests={tests}
                subjectID={subjectItem.id}
                key={courseItem.id}
                testID={testID}
              />
            ))}
        </div>
      ) : null}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.authReducer.currentUser,
  };
};

export default connect(mapStateToProps)(AdminTestingSubject);
