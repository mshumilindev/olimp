import React, { useContext, useMemo } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { orderBy } from "natural-orderby";

import siteSettingsContext from "../../context/siteSettingsContext";
import AdminTestingTest from "./AdminTestingTest";

function AdminTestingLesson({ lesson, tests, usersList, testID }) {
  const { translate, lang } = useContext(siteSettingsContext);

  const sortedTests = useMemo(() => {
    return orderBy(tests, (v) => v.userID);
  }, [tests]);

  const sentTestsWithoutScore = useMemo(() => {
    return sortedTests?.filter((test) => test.isSent !== false && !!test.score);
  }, [sortedTests]);

  const sentTestsWithScore = useMemo(() => {
    return sortedTests?.filter((test) => test.isSent !== false && !test.score);
  }, [sortedTests]);

  const notSentTests = useMemo(() => {
    return sortedTests?.filter((test) => !test.isSent);
  }, [sortedTests]);

  return (
    <AdminTestingLessonStyled>
      <i class="content_title-icon fa fa-paragraph" />
      {lesson.name[lang] || lesson.name["ua"]}
      {!!sortedTests?.length && (
        <AdminTestingTestsListStyled>
          {sortedTests.map((test) => (
            <AdminTestingTest
              test={test}
              key={test.id}
              userItem={
                usersList.filter(
                  (userItem) =>
                    userItem.role === "student" && userItem.id === test.userID,
                )[0]
              }
              lesson={lesson}
              testID={testID}
            />
          ))}
        </AdminTestingTestsListStyled>
      )}
    </AdminTestingLessonStyled>
  );
  // return (
  //   <div className="adminTesting__lesson">
  //   <div className="adminTesting__course-name">
  //   <i className="content_title-icon fa fa-graduation-cap"/>
  //   { lesson.name[lang] ? lesson.name[lang] : lesson.name['ua'] }
  //   </div>
  //   <div className="adminTesting__testsList">
  //   {
  //   tests.length ?
  //   <>
  //   { tests.filter(testItem => testItem.isSent !== false && testItem.score).map(test => <AdminTestingTest test={test} key={test.id} userItem={usersList.filter(userItem => userItem.role === 'student' && userItem.id === test.userID)[0]} lesson={lesson} testID={testID} />) }
  //   { tests.filter(testItem => testItem.isSent !== false && !testItem.score).map(test => <AdminTestingTest test={test} key={test.id} userItem={usersList.filter(userItem => userItem.role === 'student' && userItem.id === test.userID)[0]} lesson={lesson} testID={testID} />) }
  //   </>
  //   :
  //   <div className="adminTesting__test no-test">
  //   <i className="content_title-icon fa fa-unlink" />
  //   { translate('no_tests') }
  //   </div>
  //   }
  //   </div>
  //   </div>
  // );
}

const mapStateToProps = (state) => {
  return {
    usersList: state.usersReducer.usersList,
  };
};

export default connect(mapStateToProps)(AdminTestingLesson);

const AdminTestingLessonStyled = styled.div`
  margin-top: 10px;

  &:first-child {
    margin-top: 0;
  }
`;

const AdminTestingTestsListStyled = styled.div`
  padding: 20px 20px 20px 50px;
`;
