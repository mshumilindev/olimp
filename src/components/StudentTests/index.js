import React, { useMemo, useCallback, useContext } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Link } from "react-router-dom";

import StudentTestItem from "./StudentTestItem";
import siteSettingsContext from "../../context/siteSettingsContext";

const StudentTests = ({
  showChecked = false,
  hideTitle = false,
  hideBtn = false,
  tests,
  testsLoading,
  classData,
  classDataLoading,
  allCoursesList,
}) => {
  const { lang } = useContext(siteSettingsContext);
  const newTests = useMemo(() => {
    return tests
      ?.filter(({ lesson: { courseID } }) =>
        classData?.courses?.find(({ course }) => courseID === course),
      )
      .sort((a, b) => {
        return a.lesson.courseID - b.lesson.courseID;
      });
  }, [tests, classData]);

  const testsNotSent = useMemo(() => {
    return newTests?.filter(
      ({ blocks, isSent }) =>
        blocks.some(({ value }) => !!value.length) && !isSent,
    );
  }, [newTests]);

  const testsSentForChecking = useMemo(() => {
    return newTests?.filter(({ isSent, score }) => isSent && !score);
  }, [newTests]);

  const otherNewTests = useMemo(() => {
    return newTests?.filter(
      ({ id, score }) =>
        !testsNotSent?.find((item) => item.id === id) &&
        !testsSentForChecking?.find((item) => item.id === id) &&
        !!score,
    );
  }, [newTests, testsNotSent, testsSentForChecking]);

  const checkShowCourseTitle = useCallback((testsArr, index, courseID) => {
    return testsArr[index - 1]?.lesson?.courseID !== courseID;
  }, []);

  const getCourseName = useCallback(
    (subjectID, courseID) => {
      const subject = allCoursesList?.find(({ id }) => id === subjectID);
      const course = subject?.coursesList?.find(({ id }) => id === courseID);

      return course?.name[lang] || course?.name["ua"] || "";
    },
    [allCoursesList],
  );

  if (!testsNotSent?.length && !testsSentForChecking?.length) {
    return null;
  }

  return (
    <StudentTestsStyled>
      {!hideTitle && (
        <div className="block__heading" style={{ marginBottom: "-20px" }}>
          <i class="content_title-icon fa-solid fa-clipboard-question" />
          Тести
        </div>
      )}
      <RowStyled>
        {!!testsNotSent?.length && (
          <ColumnStyled>
            <StudentTestsSubtitleStyled>Збережені</StudentTestsSubtitleStyled>
            <div className="studentTests__notSent">
              {testsNotSent.map((test, index) => (
                <React.Fragment key={test.id}>
                  {checkShowCourseTitle(
                    testsNotSent,
                    index,
                    test.lesson.courseID,
                  ) && (
                    <StudentTestCourseStyled>
                      {getCourseName(
                        test.lesson.subjectID,
                        test.lesson.courseID,
                      )}
                    </StudentTestCourseStyled>
                  )}
                  <StudentTestItem test={test} icon="fa-solid fa-floppy-disk" />
                </React.Fragment>
              ))}
            </div>
          </ColumnStyled>
        )}
        {!!testsSentForChecking?.length && (
          <ColumnStyled>
            <StudentTestsSubtitleStyled>
              Відправлені на перевірку
            </StudentTestsSubtitleStyled>
            <div className="studentTests__notSent">
              {testsSentForChecking.map((test, index) => (
                <React.Fragment key={test.id}>
                  {checkShowCourseTitle(
                    testsSentForChecking,
                    index,
                    test.lesson.courseID,
                  ) && (
                    <StudentTestCourseStyled>
                      {getCourseName(
                        test.lesson.subjectID,
                        test.lesson.courseID,
                      )}
                    </StudentTestCourseStyled>
                  )}
                  <StudentTestItem
                    test={test}
                    icon="fa-regular fa-hourglass-half"
                  />
                </React.Fragment>
              ))}
            </div>
          </ColumnStyled>
        )}
      </RowStyled>
      {showChecked && !!otherNewTests?.length && (
        <RowStyled>
          <ColumnStyled>
            <StudentTestsSubtitleStyled>Перевірені</StudentTestsSubtitleStyled>
            <div className="studentTests__notSent">
              {otherNewTests.map((test, index) => (
                <React.Fragment key={test.id}>
                  {checkShowCourseTitle(
                    otherNewTests,
                    index,
                    test.lesson.courseID,
                  ) && (
                    <StudentTestCourseStyled>
                      {getCourseName(
                        test.lesson.subjectID,
                        test.lesson.courseID,
                      )}
                    </StudentTestCourseStyled>
                  )}
                  <StudentTestItem
                    test={test}
                    icon="fa-solid fa-check"
                    showScore
                  />
                </React.Fragment>
              ))}
            </div>
          </ColumnStyled>
        </RowStyled>
      )}
      {!hideBtn && (
        <BtnHolderStyled>
          <Link to={"/tests"} className="btn btn_primary">
            Усі тести
          </Link>
        </BtnHolderStyled>
      )}
    </StudentTestsStyled>
  );
};

const mapStateToProps = (state) => ({
  tests: state.testsReducer.tests,
  testsLoading: state.testsReducer.loading,
  classData: state.classesReducer.classData,
  classDataLoading: state.classesReducer.loading,
  allCoursesList: state.coursesReducer.coursesList,
});

export default connect(mapStateToProps)(StudentTests);

const StudentTestsStyled = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap > * {
    max-width: 100%;
  }
`;

const BtnHolderStyled = styled.div`
  padding-top: 20px;
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const RowStyled = styled.div`
  display: flex;
  margin: 40px -20px 0;

  &:first-child {
    margin-top: 0;
  }
`;

const ColumnStyled = styled.div`
  width: 50%;
  flex: 1;
  padding: 0 20px;
  box-sizing: border-box;
`;

const StudentTestsSubtitleStyled = styled.h3`
  font-family: "Roboto Condensed", Arial, Helvetica, sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 10px;
`;

const StudentTestCourseStyled = styled.h4`
  margin-top: 20px;
  font-family: "Roboto Condensed", Arial, Helvetica, sans-serif;
  font-weight: normal;
  text-transform: uppercase;
  font-size: 14px;

  &:first-child {
    margin-top: 0;
  }
`;
