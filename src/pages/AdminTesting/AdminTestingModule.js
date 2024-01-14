import React, {useCallback, useContext, useEffect, useState, memo, useMemo} from 'react';
import {orderBy} from "natural-orderby";
import styled from 'styled-components';
import { connect } from 'react-redux';
// import firebase from "firebase";

import siteSettingsContext from "../../context/siteSettingsContext";
import {getLessons} from "../../redux/actions/coursesActions";
import AdminTestingLesson from "./AdminTestingLesson";

// const db = firebase.firestore();

const AdminTestingModule = ({subjectID, courseID, module, tests, testID, getLessons}) => {
    const { lang } = useContext(siteSettingsContext);
    const [ lessonsList, setLessonsList ] = useState(null);

    useEffect(() => {
      if ( !lessonsList?.length ) {
        getLessons(subjectID, courseID, module.id).then((snapshot) => {
          setLessonsList(snapshot.docs.map((doc) => {
            return {
              ...doc.data(),
              id: doc.id
            }
          }))
        });
      }
    }, [subjectID, courseID, module, lessonsList]);

    const lessonsWithTests = useMemo(() => {
      return orderBy(lessonsList?.filter(({id}) => tests?.find((test) => test.lesson.lessonID === id)), v => v.index)
    }, [lessonsList, tests]);

    return (
      <>
        <AdminTestingModuleStyled>
          <i class="content_title-icon fa fa-book-open" />
          {module.name[lang] || module.name['ua']}
        </AdminTestingModuleStyled>
        {
          !!lessonsWithTests?.length && (
            <AdminTestingLessonsListStyled>
              {
                lessonsWithTests.map((lesson) => (
                  <AdminTestingLesson
                    subjectID={subjectID}
                    courseID={courseID}
                    moduleID={module.id}
                    lesson={lesson}
                    tests={tests.filter(item => item.lesson.subjectID === subjectID && item.lesson.courseID === courseID && item.lesson.moduleID === module.id && item.lesson.lessonID === lesson.id)}
                    key={lesson.id}
                    testID={testID}/>
                ))
              }
            </AdminTestingLessonsListStyled>
          )
        }
      </>
    )

    // useEffect(() => {
    //     const lessonsRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(module.id).collection('lessons');
    //
    //     lessonsRef.get().then(snapshot => {
    //         if ( snapshot.docs.length ) {
    //             setLessonsList(snapshot.docs.map(doc => {return{...doc.data(), id: doc.id}}));
    //         }
    //         else {
    //             setLessonsList([]);
    //         }
    //     });
    // }, [setLessonsList, subjectID, courseID, module]);
    //
    // const filterLessons = useCallback(() => {
    //     return lessonsList.filter(lessonItem => tests.some(testItem => testItem.lesson.subjectID === subjectID && testItem.lesson.courseID === courseID && testItem.lesson.moduleID === module.id && testItem.lesson.lessonID === lessonItem.id));
    // }, [lessonsList, subjectID, courseID, module, tests]);
    //
    // return (
    //     <div className="adminTesting__module">
    //         <div className="adminTesting__module-name">
    //             <i className="content_title-icon fa fa-book-open"/>
    //             { module.name[lang] ? module.name[lang] : module.name['ua'] }
    //         </div>
    //         {
    //             lessonsList && filterLessons().length ?
    //                 <div className="adminTesting__lessonsList">
    //                     { orderBy(filterLessons(), v => v.index).map(lessonItem => <AdminTestingLesson subjectID={subjectID} courseID={courseID} moduleID={module.id} lesson={lessonItem} tests={tests.filter(item => item.lesson.subjectID === subjectID && item.lesson.courseID === courseID && item.lesson.moduleID === module.id && item.lesson.lessonID === lessonItem.id)} key={lessonItem.id} testID={testID}/>) }
    //                 </div>
    //                 :
    //                 null
    //         }
    //     </div>
    // );
}
const mapDispatchToProps = dispatch => ({
  getLessons: (subjectID, courseID, moduleID) => dispatch(getLessons(subjectID, courseID, moduleID))
});

export default connect(null, mapDispatchToProps)(memo(AdminTestingModule));

const AdminTestingLessonsListStyled = styled.div`
  padding: 20px 20px 20px 30px;
`;

const AdminTestingModuleStyled = styled.div`
  margin-top: 10px;
  opacity: .85;

  &:first-child {
    margin-top: 0;
  }
`;
