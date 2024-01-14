import firebase from "../../db/firestore";
import {generate} from "generate-password";

const db = firebase.firestore();
const coursesCollection = db.collection('courses');
let subjectsList = [];
const allCoursesList = [];
let lesson = null;

export function fetchSubjects() {
  let unsubscribe;
    return dispatch => {
        dispatch(coursesBegin());

        if ( unsubscribe ) {
            unsubscribe();
        }

        unsubscribe = coursesCollection.onSnapshot((snapshot) => {
          let allCoursesInSubject = [];

          subjectsList = snapshot.docs.map((doc) => {
            allCoursesInSubject.push(db.collection('courses').doc(doc.id).collection('coursesList').get());

            return {
              ...doc.data(),
              id: doc.id
            }
          });

          Promise.all(allCoursesInSubject).then((data) => {
            data.forEach((item, index) => {
              subjectsList[index].children = item.size;
            });
            dispatch(coursesSuccess(subjectsList));
          });
        });
    }
}

export function fetchAllCourses() {
    return dispatch => {
        dispatch(allCoursesBegin());

        return coursesCollection.get().then((snapshot) => {
            allCoursesList.splice(0, allCoursesList.length);
            let i = 0;

            if ( snapshot.docs.length ) {
                snapshot.docs.forEach(doc => {
                    const coursesListRef = db.collection('courses').doc(doc.id).collection('coursesList');

                    if ( !allCoursesList.some(item => item.id === doc.id) ) {
                        allCoursesList.push({
                            ...doc.data(),
                            id: doc.id,
                            coursesList: []
                        });
                    }

                    coursesListRef.get().then(courseSnapshot => {
                        courseSnapshot.forEach(courseDoc => {
                            if ( !allCoursesList.find(item => item.id === doc.id).coursesList.some(item => item.id === courseDoc.id) ) {
                                allCoursesList.find(item => item.id === doc.id).coursesList.push({
                                    ...courseDoc.data(),
                                    id: courseDoc.id
                                });
                            }
                        });
                        i++;

                        if ( i === snapshot.docs.length ) {
                            dispatch(allCoursesSuccess(allCoursesList));
                        }
                    });
                });
            }
            else {
                dispatch(allCoursesSuccess(allCoursesList));
            }
        });
    }
}

export function fetchModulesLessons(subjectID, courseID) {
    const modulesRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules');
    const modulesLessons = [];
    let modulesI = 0;

    return dispatch => {
        dispatch(modulesLessonBegin());

        modulesLessons.splice(0, modulesLessons.length);

        const getLessons = snapshot => {
            const module = snapshot.docs[modulesI];
            const lessonsRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(module.id).collection('lessons');

            modulesLessons.push({
                ...module.data(),
                id: module.id,
                lessons: []
            });

            lessonsRef.get().then(lessons => {
                if ( !lessons.empty ) {
                    if ( lessons.docs.length ) {
                        lessons.docs.forEach(lesson => {
                            modulesLessons.find(item => item.id === module.id).lessons.push({
                                ...lesson.data(),
                                id: lesson.id
                            });
                        });
                        modulesI++;

                        if ( modulesI < snapshot.docs.length ) {
                            getLessons(snapshot);
                        }
                        else {
                            dispatch(modulesLessonSuccess(modulesLessons));
                        }
                    }
                }
                else {
                    modulesI++;
                    if ( modulesI < snapshot.docs.length ) {
                        getLessons(snapshot);
                    }
                    else {
                        dispatch(modulesLessonSuccess(modulesLessons));
                    }
                }
            });
        };

        return modulesRef.get().then(snapshot => {
            if ( snapshot.docs.length ) {
                getLessons(snapshot);
            }
            else {
                dispatch(modulesLessonSuccess(modulesLessons));
            }
        });
    }
}

export function fetchCoursesList(subjectID, userID, clearArray) {
    let courseListRef = null;
    let unsubscribe = null;

    if ( userID ) {
        courseListRef = db.collection('courses').doc(subjectID).collection('coursesList').where('teacher', '==', userID);
    }
    else {
        courseListRef = db.collection('courses').doc(subjectID).collection('coursesList');
    }

    return dispatch => {
        dispatch(coursesListBegin());
        if ( unsubscribe ) {
            unsubscribe();
        }
        if ( clearArray ) {
            return dispatch(coursesListSuccess([]));
        }
        unsubscribe = courseListRef.onSnapshot({ includeMetadataChanges: true }, snapshot => {
            const modulesList = [];
            snapshot.docs.forEach(doc => {
                modulesList.push({
                    ...doc.data(),
                    id: doc.id
                });
            });
            dispatch(coursesListSuccess(modulesList));
        });
    };
}

export function fetchModules(subjectID, courseID) {
    const modulesRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules');
    let unsubscribe = null;

    return dispatch => {
        dispatch(modulesBegin());
        if ( unsubscribe ) {
            unsubscribe();
        }

        unsubscribe = modulesRef.onSnapshot(snapshot => {
            const modulesList = [];
            snapshot.docs.forEach(doc => {
                modulesList.push({
                    ...doc.data(),
                    id: doc.id
                });
            });
            dispatch(modulesSuccess(modulesList));
        });
    };
}

export function getModules(subjectID, courseID) {
    const modulesRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules');

    return dispatch => {
      return modulesRef.get();
    };
}

export function getLessons(subjectID, courseID, moduleID) {
    const lessonsRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons');

    return dispatch => {
      return lessonsRef.get();
    };
}

export function fetchLessons(subjectID, courseID, moduleID) {
    const lessonsRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons');
    let unsubscribe = null;

    return dispatch => {
        dispatch(lessonsBegin());
        if ( unsubscribe ) {
            unsubscribe();
        }
        unsubscribe = lessonsRef.onSnapshot({ includeMetadataChanges: true }, snapshot => {
            const lessonsList = [];

            snapshot.docs.forEach(doc => {
                lessonsList.push({
                    ...doc.data(),
                    id: doc.id
                });
            });
            dispatch(lessonsSuccess(lessonsList));
        });
    };
}

export function updateLessonsOrder(subjectID, courseID, moduleID, lessonsToUpdate) {
    return dispatch => {
        lessonsToUpdate.forEach((item, index) => {
            const lessonRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(item.id);

            lessonRef.set({
                index: item.index
            }, {merge: true}).then();
        });
    }
}

export function updateSubject(subject) {
    const subjectRef = db.collection('courses').doc(subject.id);
    const subjectID = subject.id;

    delete subject.id;

    return dispatch => {
        dispatch(coursesBegin());
        return subjectRef.set({
            ...subject
        }).then(() => {
            if ( subjectsList.indexOf(subjectsList.find(item => item.id === subjectID)) !== -1 ) {
                subjectsList.splice(subjectsList.indexOf(subjectsList.find(item => item.id === subjectID)), 1);
            }
            subjectsList.push({
                ...subject,
                id: subjectID
            });
            dispatch(coursesSuccess(subjectsList.sort((a, b) => {
                if ( a.id < b.id ) {
                    return -1;
                }
                else if ( a.id > b.id ) {
                    return 1;
                }
                return 0;
            })));
        });
    };
}

export function deleteSubject(subjectID) {
    const subjectRef = db.collection('courses').doc(subjectID);
    const coursesRef = db.collection('courses').doc(subjectID).collection('coursesList');
    const batch = db.batch();

    return dispatch => {
      dispatch(coursesBegin());

      return coursesRef.get().then((courses) => {
        if ( courses.docs.length ) {
          courses.forEach((course) => {
            const modulesRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(course.id).collection('modules');

            modulesRef.get().then((modules) => {
              if ( modules.docs.length ) {
                modules.forEach((module) => {
                  const lessonsRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(course.id).collection('modules').doc(module.id).collection('lessons');

                  lessonsRef.get().then((lessons) => {
                    if ( lessons.docs.length ) {
                      lessons.forEach((lesson) => {
                        batch.delete(db.collection('courses').doc(subjectID).collection('coursesList').doc(course.id).collection('modules').doc(module.id).collection('lessons').doc(lesson.id));
                      });
                    }
                  });

                  batch.delete(db.collection('courses').doc(subjectID).collection('coursesList').doc(course.id).collection('modules').doc(module.id));
                })
              }
              batch.delete(db.collection('courses').doc(subjectID).collection('coursesList').doc(course.id));
            });
          });
        }

        subjectRef.delete().then(() => {
          batch.commit();
          dispatch(coursesSuccess(subjectsList.sort((a, b) => {
              if ( a.id < b.id ) {
                  return -1;
              }
              else if ( a.id > b.id ) {
                  return 1;
              }
              return 0;
          })));
        });
      });
    }
}

export function updateCourse(subjectID, course) {
    const courseRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(course.id);

    return dispatch => {
        return courseRef.set({
            ...course
        });
    };
}

export function deleteCourse(subjectID, courseID) {
    const courseRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID);
    const modulesRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules');
    const batch = db.batch();

    return dispatch => {
      dispatch(coursesBegin());

      return modulesRef.get().then((modules) => {
        if ( modules.docs.length ) {
          modules.forEach((module) => {
            const lessonsRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(module.id).collection('lessons');

            lessonsRef.get().then((lessons) => {
              if ( lessons.docs.length ) {
                lessons.forEach((lesson) => {
                  batch.delete(db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(module.id).collection('lessons').doc(lesson.id));
                });
              }
            });

            batch.delete(db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(module.id));
          })
        }

        courseRef.delete().then(() => {
          batch.commit();
          dispatch(coursesSuccess(subjectsList));
        });
      });
    }
}

export function updateModule(subjectID, courseID, module) {
    const moduleRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(module.id);

    return dispatch => {
        dispatch(coursesBegin());
        return moduleRef.set({
            ...module
        });
    };
}

export function deleteModule(subjectID, courseID, moduleID) {
    const moduleRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID);
    const lessonsRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons');
    const batch = db.batch();

    return dispatch => {
        dispatch(coursesBegin());
        return lessonsRef.get().then((snapshot) => {
          snapshot.forEach((doc) => {
            batch.delete(db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(doc.id));
          });
          moduleRef.delete().then(() => {
            batch.commit();
            dispatch(coursesSuccess(subjectsList));
          });
        })
    };
}

export function updateLesson(subjectID, courseID, moduleID, newLesson, updateTree) {
    const lessonRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(newLesson.id);
    const contentRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(newLesson.id).collection('content');
    const QARef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(newLesson.id).collection('QA');
    const lessonID = newLesson.id;
    const content = JSON.stringify(newLesson.content);
    const QA = JSON.stringify(newLesson.QA);
    let toDeleteI = 0;
    let toCreateI = 0;
    let toDeleteX = 0;
    let toCreateX = 0;

    delete newLesson.id;
    delete newLesson.content;
    delete newLesson.QA;

    return dispatch => {
        const handleContent = () => {
            contentRef.get().then(snapshot => {
                if ( snapshot.docs.length ) {
                    deleteDoc(snapshot);
                }
                else {
                    if ( content && JSON.parse(content) && JSON.parse(content).length ) {
                        createDoc();
                    }
                    else {
                        handleQuestions();
                    }
                }
            });
        };

        const deleteDoc = snapshot => {
            const docRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lessonID).collection('content').doc(snapshot.docs[toDeleteI].id);
            docRef.delete().then(() => {
                toDeleteI ++;
                if ( toDeleteI < snapshot.docs.length ) {
                    deleteDoc(snapshot);
                }
                else {
                    if ( JSON.parse(content) && JSON.parse(content).length ) {
                        createDoc();
                    }
                    else {
                        handleQuestions();
                    }
                }
            });
        };

        const createDoc = () => {
            const block = JSON.parse(content)[toCreateI];
            const docRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lessonID).collection('content').doc(block.id);

            delete block.id;

            docRef.set({
                ...block,
                order: toCreateI
            }).then(() => {
                toCreateI ++;
                if ( toCreateI < JSON.parse(content).length ) {
                    createDoc();
                }
                else {
                    handleQuestions();
                }
            });
        };


        const handleQuestions = () => {
            QARef.get().then(snapshot => {
                if ( snapshot.docs.length ) {
                    deleteQuestion(snapshot);
                }
                else {
                    if ( QA && JSON.parse(QA) && JSON.parse(QA).length ) {
                        createQuestion();
                    }
                    else {
                        lesson = {
                            ...newLesson,
                            id: lessonID
                        };
                        if ( content ) {
                            lesson.content = JSON.parse(content).sort((a, b) => a.order - b.order);
                        }
                        if ( QA ) {
                            lesson.QA = JSON.parse(QA).sort((a, b) => a.order - b.order);
                        }
                        dispatch(lessonSuccess(lesson));
                    }
                }
            });
        };

        const deleteQuestion = snapshot => {
            const docRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lessonID).collection('QA').doc(snapshot.docs[toDeleteX].id);
            docRef.delete().then(() => {
                toDeleteX ++;
                if ( toDeleteX < snapshot.docs.length ) {
                    deleteQuestion(snapshot);
                }
                else {
                    if ( JSON.parse(QA) && JSON.parse(QA).length ) {
                        createQuestion();
                    }
                    else {
                        lesson = {
                            ...newLesson,
                            id: lessonID
                        };
                        lesson.content = JSON.parse(content).sort((a, b) => a.order - b.order);
                        lesson.QA = JSON.parse(QA).sort((a, b) => a.order - b.order);
                        dispatch(lessonSuccess(lesson));
                    }
                }
            });
        };

        const createQuestion = () => {
            const block = JSON.parse(QA)[toCreateX];
            const docRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lessonID).collection('QA').doc(block.id);

            delete block.id;

            docRef.set({
                ...block,
                order: toCreateX
            }).then(() => {
                toCreateX ++;
                if ( toCreateX < JSON.parse(QA).length ) {
                    createQuestion();
                }
                else {
                    lesson = {
                        ...newLesson,
                        id: lessonID
                    };
                    lesson.content = JSON.parse(content).sort((a, b) => a.order - b.order);
                    lesson.QA = JSON.parse(QA).sort((a, b) => a.order - b.order);
                    dispatch(lessonSuccess(lesson));
                }
            });
        };

        dispatch(coursesBegin());

        return lessonRef.set({
            ...newLesson
        }).then(() => {
            handleContent();
        });
    };
}

export function copyLesson(subjectID, courseID, moduleID, newLesson) {
  const contentRef = db.collection('courses').doc(newLesson.subjectID).collection('coursesList').doc(newLesson.courseID).collection('modules').doc(newLesson.moduleID).collection('lessons').doc(newLesson.lesson.id).collection('content');
  const QARef = db.collection('courses').doc(newLesson.subjectID).collection('coursesList').doc(newLesson.courseID).collection('modules').doc(newLesson.moduleID).collection('lessons').doc(newLesson.lesson.id).collection('QA');
  const newID = generate({
      length: 20,
      numbers: true
  });
  const newLessonRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(newID);
  let content = null;
  let qa = null
  const batch = db.batch();

  return dispatch => {
    contentRef.get().then(snapshot => {
      content = snapshot.docs.map((doc) => doc.data());
      QARef.get().then(snapshot => {
        qa = snapshot.docs.map((doc) => doc.data())
        const createLesson = {
          ...newLesson.lesson,
          id: newID,
          name: {
            ru: '',
            en: `${newLesson.lesson.name.en || newLesson.lesson.name.ua}-copy`,
            ua: `${newLesson.lesson.name.ua}-копія`
          }
        }

        newLessonRef.set({
          ...createLesson
        }).then(() => {
          content.forEach((doc) => {
            batch.set(db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(createLesson.id).collection('content').doc(), doc);
          })
          qa.forEach((doc) => {
            batch.set(db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(createLesson.id).collection('QA').doc(), doc);
          })
          batch.commit();
        })
      })
    })
  }
}

export function deleteLesson(subjectID, courseID, moduleID, lessonID) {
    const lessonRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lessonID);

    return dispatch => {
        dispatch(coursesBegin());
        return lessonRef.delete().then(() => {
            dispatch(coursesSuccess(subjectsList));
        });
    };
}

export function fetchLesson(subjectID, courseID, moduleID, lessonID) {
    const lessonRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lessonID);
    const contentRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lessonID).collection('content');
    const QARef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lessonID).collection('QA');

    return dispatch => {
        dispatch(lessonBegin());
        return lessonRef.get().then(snapshot => {
            lesson = {
                ...snapshot.data(),
                id: snapshot.id
            };
            return contentRef.get().then(contentSnapshot => {
                const content = [];
                if ( contentSnapshot.docs.length ) {
                    contentSnapshot.docs.forEach(doc => {
                        content.push({
                            ...doc.data(),
                            id: doc.id
                        });
                    });
                }
                return QARef.get().then(QASnapshot => {
                    const QA = [];
                    if ( QASnapshot.docs.length ) {
                        QASnapshot.docs.forEach(doc => {
                            QA.push({
                                ...doc.data(),
                                id: doc.id
                            });
                        });
                    }
                    lesson.content = content.sort((a, b) => a.order - b.order);
                    lesson.QA = QA.sort((a, b) => a.order - b.order);
                    dispatch(lessonSuccess(lesson));
                });
            });
        });
    };
}

export function discardLesson() {
    return dispatch => {
        dispatch(discardLessonSuccess());
    }
}

export const discardLessonSuccess = () => {
    return {
        type: DISCARD_SUCCESS
    }
};

export const coursesBegin = () => {
    return {
        type: COURSES_BEGIN
    }
};
export const coursesSuccess = subjectsList => {
    return {
        type: COURSES_SUCCESS,
        payload: { subjectsList }
    }
};

export const coursesListBegin = () => {
    return {
        type: COURSES_LIST_BEGIN,
    }
};
export const coursesListSuccess = subjectCoursesList => {
    return {
        type: COURSES_LIST_SUCCESS,
        payload: { subjectCoursesList }
    }
};

export const modulesBegin = () => {
    return {
        type: MODULES_BEGIN
    }
};
export const modulesSuccess = modulesList => {
    return {
        type: MODULES_SUCCESS,
        payload: { modulesList }
    }
};

export const lessonsBegin = () => {
    return {
        type: LESSONS_BEGIN
    }
};
export const lessonsSuccess = lessonsList => {
    return {
        type: LESSONS_SUCCESS,
        payload: { lessonsList }
    }
};

export const allCoursesBegin = () => {
    return {
        type: ALL_COURSES_BEGIN
    }
};
export const allCoursesSuccess = allCoursesList => {
    return {
        type: ALL_COURSES_SUCCESS,
        payload: { allCoursesList }
    }
};

export const lessonBegin = () => {
    return {
        type: LESSON_BEGIN
    }
};
export const lessonSuccess = lesson => {
    return {
        type: LESSON_SUCCESS,
        payload: { lesson }
    }
};

export const modulesLessonBegin = () => {
    return {
        type: MODULES_LESSONS_BEGIN
    }
};
export const modulesLessonSuccess = modulesLessons => {
    return {
        type: MODULES_LESSONS_SUCCESS,
        payload: { modulesLessons }
    }
};

export const DISCARD_SUCCESS = 'DISCARD_SUCCESS';
export const COURSES_BEGIN = 'COURSES_BEGIN';
export const COURSES_SUCCESS = 'COURSES_SUCCESS';
export const ALL_COURSES_BEGIN = 'ALL_COURSES_BEGIN';
export const ALL_COURSES_SUCCESS = 'ALL_COURSES_SUCCESS';
export const LESSON_BEGIN = 'LESSON_BEGIN';
export const LESSON_SUCCESS = 'LESSON_SUCCESS';
export const MODULES_LESSONS_BEGIN = 'MODULES_LESSONS_BEGIN';
export const MODULES_LESSONS_SUCCESS = 'MODULES_LESSONS_SUCCESS';
export const LESSONS_BEGIN = 'LESSONS_BEGIN';
export const LESSONS_SUCCESS = 'LESSONS_SUCCESS';
export const COURSES_LIST_BEGIN = 'COURSES_LIST_BEGIN';
export const COURSES_LIST_SUCCESS = 'COURSES_LIST_SUCCESS';
export const MODULES_BEGIN = 'MODULES_BEGIN';
export const MODULES_SUCCESS = 'MODULES_SUCCESS';
