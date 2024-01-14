import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  memo,
  useMemo,
} from "react";
// import firebase from "firebase";
import { orderBy } from "natural-orderby";
import styled from "styled-components";
import { connect } from "react-redux";

import siteSettingsContext from "../../context/siteSettingsContext";
import { getModules } from "../../redux/actions/coursesActions";
import AdminTestingModule from "./AdminTestingModule";

// const db = firebase.firestore();

const AdminTestingCourse = ({
  subjectID,
  course,
  tests,
  testID,
  getModules,
}) => {
  const { lang } = useContext(siteSettingsContext);
  const [modulesList, setModulesList] = useState(null);

  useEffect(() => {
    if (!modulesList?.length) {
      getModules(subjectID, course.id).then((snapshot) => {
        setModulesList(
          snapshot.docs.map((doc) => {
            return {
              ...doc.data(),
              id: doc.id,
            };
          }),
        );
      });
    }
  }, [subjectID, course, modulesList]);

  const modulesWithTests = useMemo(() => {
    return orderBy(
      modulesList?.filter(({ id }) =>
        tests?.find((test) => test.lesson.moduleID === id),
      ),
      (v) => v.index,
    );
  }, [modulesList, tests]);

  // const filteredTests = useMemo(() => {
  //   return tests?.filter((test) => test.lesson.subjectID === subjectID)
  // }, [tests]);

  return (
    <>
      <AdminTestingCourseStyled>
        <i class="content_title-icon fa fa-graduation-cap" />
        {course.name[lang] || course.name["ua"]}
      </AdminTestingCourseStyled>
      {!!modulesWithTests?.length && (
        <AdminTestingModulesListStyled>
          {modulesWithTests.map((module) => (
            <AdminTestingModule
              subjectID={subjectID}
              courseID={course.id}
              module={module}
              tests={tests}
              key={module.id}
              testID={testID}
            />
          ))}
        </AdminTestingModulesListStyled>
      )}
    </>
  );

  // useEffect(() => {
  //   const modulesRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(course.id).collection('modules');
  //
  //   modulesRef.get().then(snapshot => {
  //   if ( snapshot.docs.length ) {
  //   setModulesList(snapshot.docs.map(doc => {return {...doc.data(), id: doc.id}}));
  //   }
  //   else {
  //   setModulesList([]);
  //   }
  //   });
  // }, [course, setModulesList, subjectID]);
  //
  // const filterModules = useCallback(() => {
  //   return modulesList.filter(moduleItem => tests.some(testItem => testItem.lesson.subjectID === subjectID && testItem.lesson.courseID === course.id && testItem.lesson.moduleID === moduleItem.id));
  // }, [modulesList, subjectID, course, tests]);

  // return (
  //   <div className="adminTesting__course">
  //   <div className="adminTesting__course-name">
  //   <i className="content_title-icon fa fa-graduation-cap"/>
  //   { course.name[lang] ? course.name[lang] : course.name['ua'] }
  //   </div>
  //   {
  //   modulesList && filterModules().length ?
  //   <div className="adminTesting__modulesList">
  //   { orderBy(filterModules(), v => v.index).map(moduleItem => <AdminTestingModule subjectID={subjectID} courseID={course.id} module={moduleItem} tests={tests} key={moduleItem.id} testID={testID}/>) }
  //   </div>
  //   :
  //   null
  //   }
  //   </div>
  // );
};

const mapDispatchToProps = (dispatch) => ({
  getModules: (subjectID, courseID) =>
    dispatch(getModules(subjectID, courseID)),
});

export default connect(null, mapDispatchToProps)(memo(AdminTestingCourse));

const AdminTestingCourseStyled = styled.div`
  margin-top: 10px;
  opacity: 0.7;

  &:first-child {
    margin-top: 0;
  }
`;

const AdminTestingModulesListStyled = styled.div`
  padding: 20px 20px 20px 30px;
`;
