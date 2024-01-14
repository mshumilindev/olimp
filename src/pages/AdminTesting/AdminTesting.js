import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { connect } from "react-redux";
import { orderBy } from "natural-orderby";
import styled from "styled-components";

import Preloader from "../../components/UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import { deleteTests } from "../../redux/actions/testsActions";
import AdminTestingCourse from "./AdminTestingCourse";
import "./adminTesting.scss";
import { useParams } from "react-router-dom";

function AdminTesting({
  user,
  coursesList,
  tests,
  usersList,
  deleteTests,
  loading,
}) {
  const params = useParams();
  const { translate, lang } = useContext(siteSettingsContext);
  const [activeTab, setActiveTab] = useState("toCheck");

  const testID = params.testID;

  useEffect(() => {
    if (tests && usersList) {
      const oldTests = tests
        .filter((test) => !usersList.find(({ id }) => test.userID === id))
        .map((test) => test.id);

      if (!!oldTests?.length) {
        deleteTests(oldTests);
      }
    }
  }, [tests, usersList]);

  const filterCourses = useCallback(() => {
    return orderBy(coursesList, (v) =>
      v.name[lang] ? v.name[lang] : v.name["ua"],
    )
      .filter((subjectItem) =>
        subjectItem.coursesList.some(
          (courseItem) => courseItem.teacher === user.id,
        ),
      )
      .filter((subjectItem) =>
        tests.some((testItem) => testItem.lesson.subjectID === subjectItem.id),
      );
  }, [coursesList, lang, tests, user]);

  const mySubjects = useMemo(() => {
    return orderBy(coursesList, (v) => v.name[lang] || v.name["ua"])
      .filter((subjectItem) =>
        subjectItem.coursesList.some(
          (courseItem) => courseItem.teacher === user.id,
        ),
      )
      .filter((subjectItem) =>
        tests?.some((test) => test.lesson.subjectID === subjectItem.id),
      )
      .map((subjectItem) => {
        return {
          ...subjectItem,
          coursesList: subjectItem.coursesList.filter(
            (courseItem) => courseItem.teacher === user.id,
          ),
        };
      });
  }, [coursesList, lang, user, tests]);

  const myTests = useMemo(() => {
    const arr = tests
      ?.filter((test) =>
        mySubjects?.find((subjectItem) =>
          subjectItem.coursesList.some(
            (courseItem) => courseItem.id === test.lesson.courseID,
          ),
        ),
      )
      ?.filter((test) =>
        usersList.some(
          (userItem) =>
            userItem.id === test.userID && userItem.status === "active",
        ),
      );
    const filteredArr = arr?.filter((test) => {
      if (activeTab === "toCheck") {
        return test.isSent && !test.score;
      }
      if (activeTab === "checked") {
        return test.isSent && test.score;
      }
      if (activeTab === "saved") {
        return !test.isSent;
      }
      return test;
    });

    return filteredArr;
  }, [mySubjects, usersList, activeTab]);

  const counter = useMemo(() => {
    const arr = tests
      ?.filter((test) =>
        mySubjects?.find((subjectItem) =>
          subjectItem.coursesList.some(
            (courseItem) => courseItem.id === test.lesson.courseID,
          ),
        ),
      )
      ?.filter((test) =>
        usersList.some(
          (userItem) =>
            userItem.id === test.userID && userItem.status === "active",
        ),
      );
    const toCheck =
      arr?.filter((test) => test.isSent && !test.score)?.length || 0;
    const checked =
      arr?.filter((test) => test.isSent && test.score)?.length || 0;
    const saved = arr?.filter((test) => !test.isSent)?.length || 0;

    return {
      toCheck,
      checked,
      saved,
    };
  }, [mySubjects, usersList, activeTab]);

  const filterTests = useCallback(
    (subjectID, courseID) => {
      return myTests?.filter(
        (test) =>
          test.lesson.subjectID === subjectID &&
          test.lesson.courseID === courseID,
      );
    },
    [myTests],
  );

  return (
    <AdminTestingStyled>
      <section className="section">
        <div className="section__title-holder">
          <h2 className="section__title">
            <i className={"content_title-icon fas fa-clipboard-check"} />
            {translate("testing")}
          </h2>
        </div>
        <div className="grid">
          <div className="grid_col col-12">
            <div className="widget">
              <AdminTestingTabsHolderStyled>
                <AdminTestingTabsStyled>
                  <AdminTestingTabStyled
                    onClick={() => setActiveTab("toCheck")}
                    active={activeTab === "toCheck"}
                  >
                    На перевірку ({counter.toCheck})
                  </AdminTestingTabStyled>
                  <AdminTestingTabStyled
                    onClick={() => setActiveTab("checked")}
                    active={activeTab === "checked"}
                  >
                    Перевірені ({counter.checked})
                  </AdminTestingTabStyled>
                  <AdminTestingTabStyled
                    onClick={() => setActiveTab("saved")}
                    active={activeTab === "saved"}
                  >
                    Збережені ({counter.saved})
                  </AdminTestingTabStyled>
                </AdminTestingTabsStyled>
              </AdminTestingTabsHolderStyled>
              <AdminTestingListStyled>
                {loading ? (
                  <Preloader />
                ) : !!myTests?.length ? (
                  mySubjects?.map((subject) => (
                    <>
                      <AdminTestingSubjectStyled key={subject.id}>
                        <i class="content_title-icon fa fa-folder-open" />
                        {subject.name[lang] || subject.name["ua"]}
                      </AdminTestingSubjectStyled>
                      <AdminTestingCoursesListStyled>
                        {subject.coursesList.map((course) => {
                          if (!!filterTests(subject.id, course.id)?.length) {
                            return (
                              <AdminTestingCourse
                                subjectID={subject.id}
                                key={course.id}
                                course={course}
                                tests={filterTests(subject.id, course.id)}
                                testID={testID}
                              />
                            );
                          }
                        })}
                      </AdminTestingCoursesListStyled>
                    </>
                  ))
                ) : (
                  <div className="nothingFound">
                    {translate("nothing_found")}
                  </div>
                )}
              </AdminTestingListStyled>
            </div>
          </div>
        </div>
      </section>
    </AdminTestingStyled>
  );

  // return (
  //   <div className="adminTesting">
  //   <section className="section">
  //   <div className="section__title-holder">
  //   <h2 className="section__title">
  //   <i className={'content_title-icon fas fa-clipboard-check'} />
  //   { translate('testing') }
  //   </h2>
  //   </div>
  //   <div className="grid">
  //   <div className="grid_col col-12">
  //   {
  //   !coursesList || !tests ?
  //   <Preloader />
  //   :
  //   filterCourses().length ?
  //   <div className="adminTesting__subjectsList">
  //   { filterCourses().map(subjectItem => <AdminTestingSubject subjectItem={subjectItem} key={subjectItem.id} tests={tests} testID={testID} />) }
  //   </div>
  //   :
  //   <div className="nothingFound">
  //   { translate('nothing_found') }
  //   </div>
  //   }
  //   </div>
  //   </div>
  //   </section>
  //   </div>
  // );
}

const mapStateToProps = (state) => {
  return {
    coursesList: state.coursesReducer.coursesList,
    tests: state.testsReducer.tests,
    loading: state.testsReducer.loading,
    user: state.authReducer.currentUser,
    usersList: state.usersReducer.usersList,
  };
};

const mapDispatchToProps = (dispatch) => ({
  deleteTests: (testIDs) => dispatch(deleteTests(testIDs)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminTesting);

const AdminTestingStyled = styled.div`
  font-family: "Roboto Condensed", Arial, sans-serif;
`;

const AdminTestingListStyled = styled.div``;

const AdminTestingSubjectStyled = styled.div`
  font-weight: bold;
  text-transform: uppercase;
  padding: 20px;
  background: #fafafa;
  margin-top: 20px;

  &:first-child {
    margin-top: 0;
  }
`;

const AdminTestingCoursesListStyled = styled.div`
  padding: 20px 20px 20px 50px;
`;

const AdminTestingTabsHolderStyled = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid #f2f2f2;
  padding-bottom: 20px;
`;

const AdminTestingTabsStyled = styled.div`
  display: inline-flex;
  overflow: hidden;
  border-radius: 4px;
`;

const AdminTestingTabStyled = styled.div`
  padding: 10px 15px;
  background: #f2f2f2;
  cursor: pointer;
  border-left: 1px solid #fff;

  &:hover {
    background: #4ec1e2;
    color: #fff;
  }

  &:first-child {
    border: none;
  }

  ${({ active }) =>
    active &&
    `
  background: #4ec1e2;
  color: #fff;
  cursor: default;
  `}
`;
