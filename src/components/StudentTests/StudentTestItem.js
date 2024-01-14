import React, { memo, useEffect, useContext, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { db } from "../../db/firestore";
import { collection, doc, getDoc } from "firebase/firestore";
import siteSettingsContext from "../../context/siteSettingsContext";

const StudentTestItem = ({ showScore = false, test, icon }) => {
  const {
    lesson: { subjectID, courseID, moduleID, lessonID },
  } = test;
  const { lang } = useContext(siteSettingsContext);
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    if (test) {
      const lessonRef = doc(
        db,
        "courses",
        subjectID,
        "coursesList",
        courseID,
        "modules",
        moduleID,
        "lessons",
        lessonID,
      );

      getDoc(lessonRef).then((snapshot) => {
        setLesson(snapshot.data());
      });
    }
  }, [test]);

  const lessonName = useMemo(() => {
    return lesson?.name?.[lang] || lesson?.name?.["ua"];
  }, [lesson]);

  if (!lessonName) {
    return null;
  }

  return (
    <TestStyled>
      <LinkStyled
        to={`/courses/${subjectID}/${courseID}/${moduleID}/${lessonID}`}
        hasScore={showScore && !!test.score}
      >
        <TestTextStyled>
          <TestIconStyled>
            <i class={icon} />
          </TestIconStyled>
          <span>{lessonName}</span>
        </TestTextStyled>
      </LinkStyled>
      {showScore && !!test.score && (
        <ScoreStyled>
          &nbsp;&mdash; Оцінка: <span>{test.score}</span>
        </ScoreStyled>
      )}
    </TestStyled>
  );
};

export default memo(StudentTestItem);

const TestStyled = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;

  &:first-child {
    margin-top: 0;
  }
`;

const LinkStyled = styled(Link)`
  max-width: 80%;

  ${({ hasScore }) => !hasScore && `max-width: 100%;`}
`;

const TestTextStyled = styled.p`
  display: inline-flex;
  align-items: center;
  font-family: "Roboto Condensed", Arial, Helvetica, sans-serif;
  max-width: 100%;

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const TestIconStyled = styled.strong`
  width: 30px;
  height: 30px;
  background-color: #fafafa;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  font-size: 12px;
  color: #333;
  flex: 0 0 auto;
`;

const ScoreStyled = styled.span`
  font-family: "Roboto Condensed", Arial, Helvetica, sans-serif;
  width: 150px;
  flex: 0 0 auto;

  span {
    color: #00c020;
    font-weight: bold;
  }
`;
