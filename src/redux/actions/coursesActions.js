import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { generate } from "generate-password";
import { db } from "../../db/firestore";

const coursesCollection = collection(db, "courses");
let subjectsList = [];
const allCoursesList = [];
let lesson = null;

export function fetchSubjects() {
  let unsubscribe;
  return (dispatch) => {
    dispatch(coursesBegin());

    if (unsubscribe) {
      unsubscribe();
    }

    unsubscribe = onSnapshot(coursesCollection, (snapshot) => {
      let allCoursesInSubject = [];

      subjectsList = snapshot.docs.map((doc) => {
        allCoursesInSubject.push(
          getDocs(collection(db, "courses", doc.id, "coursesList")),
        );

        return {
          ...doc.data(),
          id: doc.id,
        };
      });

      Promise.all(allCoursesInSubject).then((data) => {
        data.forEach((item, index) => {
          subjectsList[index].children = item.size;
        });
        dispatch(coursesSuccess(subjectsList));
      });
    });
  };
}

export function fetchAllCourses() {
  return (dispatch) => {
    dispatch(allCoursesBegin());

    return getDocs(coursesCollection).then((snapshot) => {
      allCoursesList.splice(0, allCoursesList.length);
      let i = 0;

      if (snapshot.docs.length) {
        snapshot.docs.forEach((doc) => {
          const coursesListRef = collection(
            db,
            "courses",
            doc.id,
            "coursesList",
          );

          if (!allCoursesList.some((item) => item.id === doc.id)) {
            allCoursesList.push({
              ...doc.data(),
              id: doc.id,
              coursesList: [],
            });
          }

          getDocs(coursesListRef).then((courseSnapshot) => {
            courseSnapshot.forEach((courseDoc) => {
              if (
                !allCoursesList
                  .find((item) => item.id === doc.id)
                  .coursesList.some((item) => item.id === courseDoc.id)
              ) {
                allCoursesList
                  .find((item) => item.id === doc.id)
                  .coursesList.push({
                    ...courseDoc.data(),
                    id: courseDoc.id,
                  });
              }
            });
            i++;

            if (i === snapshot.docs.length) {
              dispatch(allCoursesSuccess(allCoursesList));
            }
          });
        });
      } else {
        dispatch(allCoursesSuccess(allCoursesList));
      }
    });
  };
}

export function fetchModulesLessons(subjectID, courseID) {
  const modulesRef = collection(
    db,
    "courses",
    subjectID,
    "coursesList",
    courseID,
    "modules",
  );
  const modulesLessons = [];
  let modulesI = 0;

  return (dispatch) => {
    dispatch(modulesLessonBegin());

    modulesLessons.splice(0, modulesLessons.length);

    const getLessons = (snapshot) => {
      const module = snapshot.docs[modulesI];
      const lessonsRef = collection(
        db,
        "courses",
        subjectID,
        "coursesList",
        courseID,
        "modules",
        module.id,
        "lessons",
      );

      modulesLessons.push({
        ...module.data(),
        id: module.id,
        lessons: [],
      });

      getDocs(lessonsRef).then((lessons) => {
        if (!lessons.empty) {
          if (lessons.docs.length) {
            lessons.docs.forEach((lesson) => {
              modulesLessons
                .find((item) => item.id === module.id)
                .lessons.push({
                  ...lesson.data(),
                  id: lesson.id,
                });
            });
            modulesI++;

            if (modulesI < snapshot.docs.length) {
              getLessons(snapshot);
            } else {
              dispatch(modulesLessonSuccess(modulesLessons));
            }
          }
        } else {
          modulesI++;
          if (modulesI < snapshot.docs.length) {
            getLessons(snapshot);
          } else {
            dispatch(modulesLessonSuccess(modulesLessons));
          }
        }
      });
    };

    return getDocs(modulesRef).then((snapshot) => {
      if (snapshot.docs.length) {
        getLessons(snapshot);
      } else {
        dispatch(modulesLessonSuccess(modulesLessons));
      }
    });
  };
}

export function fetchCoursesList(subjectID, userID, clearArray) {
  let courseListRef = null;
  let unsubscribe = null;

  if (userID) {
    courseListRef = query(
      collection(db, "courses", subjectID, "coursesList"),
      where("teacher", "==", userID),
    );
  } else {
    courseListRef = collection(db, "courses", subjectID, "coursesList");
  }

  return (dispatch) => {
    dispatch(coursesListBegin());
    if (unsubscribe) {
      unsubscribe();
    }
    if (clearArray) {
      return dispatch(coursesListSuccess([]));
    }
    unsubscribe = onSnapshot(
      courseListRef,
      { includeMetadataChanges: true },
      (snapshot) => {
        const modulesList = [];
        snapshot.docs.forEach((doc) => {
          modulesList.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        dispatch(coursesListSuccess(modulesList));
      },
    );
  };
}

export function fetchModules(subjectID, courseID) {
  const modulesRef = collection(
    db,
    "courses",
    subjectID,
    "coursesList",
    courseID,
    "modules",
  );
  let unsubscribe = null;

  return (dispatch) => {
    dispatch(modulesBegin());
    if (unsubscribe) {
      unsubscribe();
    }

    unsubscribe = onSnapshot(modulesRef, (snapshot) => {
      const modulesList = [];
      snapshot.docs.forEach((doc) => {
        modulesList.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      dispatch(modulesSuccess(modulesList));
    });
  };
}

export function getModules(subjectID, courseID) {
  const modulesRef = collection(
    db,
    "courses",
    subjectID,
    "coursesList",
    courseID,
    "modules",
  );

  return (dispatch) => {
    return getDocs(modulesRef);
  };
}

export function getLessons(subjectID, courseID, moduleID) {
  const lessonsRef = collection(
    db,
    "courses",
    subjectID,
    "coursesList",
    courseID,
    "modules",
    moduleID,
    "lessons",
  );

  return (dispatch) => {
    return getDocs(lessonsRef);
  };
}

export function fetchLessons(subjectID, courseID, moduleID) {
  const lessonsRef = collection(
    db,
    "courses",
    subjectID,
    "coursesList",
    courseID,
    "modules",
    moduleID,
    "lessons",
  );
  let unsubscribe = null;

  return (dispatch) => {
    dispatch(lessonsBegin());
    if (unsubscribe) {
      unsubscribe();
    }
    unsubscribe = onSnapshot(
      lessonsRef,
      { includeMetadataChanges: true },
      (snapshot) => {
        const lessonsList = [];

        snapshot.docs.forEach((doc) => {
          lessonsList.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        dispatch(lessonsSuccess(lessonsList));
      },
    );
  };
}

export function updateLessonsOrder(
  subjectID,
  courseID,
  moduleID,
  lessonsToUpdate,
) {
  return (dispatch) => {
    lessonsToUpdate.forEach((item, index) => {
      const lessonRef = doc(
        db,
        "courses",
        subjectID,
        "coursesList",
        courseID,
        "modules",
        moduleID,
        "lessons",
        item.id,
      );

      setDoc(
        lessonRef,
        {
          index: item.index,
        },
        { merge: true },
      ).then();
    });
  };
}

export function updateSubject(subject) {
  const subjectRef = doc(db, "courses", subject.id);
  const subjectID = subject.id;

  delete subject.id;

  return (dispatch) => {
    dispatch(coursesBegin());
    return setDoc(subjectRef, {
      ...subject,
    }).then(() => {
      if (
        subjectsList.indexOf(
          subjectsList.find((item) => item.id === subjectID),
        ) !== -1
      ) {
        subjectsList.splice(
          subjectsList.indexOf(
            subjectsList.find((item) => item.id === subjectID),
          ),
          1,
        );
      }
      subjectsList.push({
        ...subject,
        id: subjectID,
      });
      dispatch(
        coursesSuccess(
          subjectsList.sort((a, b) => {
            if (a.id < b.id) {
              return -1;
            } else if (a.id > b.id) {
              return 1;
            }
            return 0;
          }),
        ),
      );
    });
  };
}

export function deleteSubject(subjectID) {
  const subjectRef = doc(db, "courses", subjectID);
  const coursesRef = collection(db, "courses", subjectID, "coursesList");
  const batch = writeBatch(db);

  return (dispatch) => {
    dispatch(coursesBegin());

    return getDocs(coursesRef).then((courses) => {
      if (courses.docs.length) {
        courses.forEach((course) => {
          const modulesRef = collection(
            db,
            "courses",
            subjectID,
            "coursesList",
            course.id,
            "modules",
          );

          getDocs(modulesRef).then((modules) => {
            if (modules.docs.length) {
              modules.forEach((module) => {
                const lessonsRef = collection(
                  db,
                  "courses",
                  subjectID,
                  "coursesList",
                  course.id,
                  "modules",
                  module.id,
                  "lessons",
                );

                getDocs(lessonsRef).then((lessons) => {
                  if (lessons.docs.length) {
                    lessons.forEach((lesson) => {
                      batch.delete(
                        doc(
                          db,
                          "courses",
                          subjectID,
                          "coursesList",
                          course.id,
                          "modules",
                          module.id,
                          "lessons",
                          lesson.id,
                        ),
                      );
                    });
                  }
                });

                batch.delete(
                  doc(
                    db,
                    "courses",
                    subjectID,
                    "coursesList",
                    course.id,
                    "modules",
                    module.id,
                  ),
                );
              });
            }
            batch.delete(
              doc(db, "courses", subjectID, "coursesList", course.id),
            );
          });
        });
      }

      deleteDoc(subjectRef).then(() => {
        batch.commit();
        dispatch(
          coursesSuccess(
            subjectsList.sort((a, b) => {
              if (a.id < b.id) {
                return -1;
              } else if (a.id > b.id) {
                return 1;
              }
              return 0;
            }),
          ),
        );
      });
    });
  };
}

export function updateCourse(subjectID, course) {
  const courseRef = doc(db, "courses", subjectID, "coursesList", course.id);

  return (dispatch) => {
    return setDoc(courseRef, {
      ...course,
    });
  };
}

export function deleteCourse(subjectID, courseID) {
  const courseRef = doc(db, "courses", subjectID, "coursesList", courseID);
  const modulesRef = collection(
    db,
    "courses",
    subjectID,
    "coursesList",
    courseID,
    "modules",
  );
  const batch = writeBatch(db);

  return (dispatch) => {
    dispatch(coursesBegin());

    return getDocs(modulesRef).then((modules) => {
      if (modules.docs.length) {
        modules.forEach((module) => {
          const lessonsRef = collection(
            db,
            "courses",
            subjectID,
            "coursesList",
            courseID,
            "modules",
            module.id,
            "lessons",
          );

          getDocs(lessonsRef).then((lessons) => {
            if (lessons.docs.length) {
              lessons.forEach((lesson) => {
                batch.delete(
                  doc(
                    db,
                    "courses",
                    subjectID,
                    "coursesList",
                    courseID,
                    "modules",
                    module.id,
                    "lessons",
                    lesson.id,
                  ),
                );
              });
            }
          });

          batch.delete(
            doc(
              db,
              "courses",
              subjectID,
              "coursesList",
              courseID,
              "modules",
              module.id,
            ),
          );
        });
      }

      deleteDoc(courseRef).then(() => {
        batch.commit();
        dispatch(coursesSuccess(subjectsList));
      });
    });
  };
}

export function updateModule(subjectID, courseID, module) {
  const moduleRef = doc(
    db,
    "courses",
    subjectID,
    "coursesList",
    courseID,
    "modules",
    module.id,
  );

  return (dispatch) => {
    dispatch(coursesBegin());
    return setDoc(moduleRef, {
      ...module,
    });
  };
}

export function deleteModule(subjectID, courseID, moduleID) {
  const moduleRef = doc(
    db,
    "courses",
    subjectID,
    "coursesList",
    courseID,
    "modules",
    moduleID,
  );
  const lessonsRef = collection(
    db,
    "courses",
    subjectID,
    "coursesList",
    courseID,
    "modules",
    moduleID,
    "lessons",
  );
  const batch = writeBatch(db);

  return (dispatch) => {
    dispatch(coursesBegin());
    return getDocs(lessonsRef).then((snapshot) => {
      snapshot.forEach((doc) => {
        batch.delete(
          doc(
            db,
            "courses",
            subjectID,
            "coursesList",
            courseID,
            "modules",
            moduleID,
            "lessons",
            doc.id,
          ),
        );
      });
      deleteDoc(moduleRef).then(() => {
        batch.commit();
        dispatch(coursesSuccess(subjectsList));
      });
    });
  };
}

export function updateLesson(
  subjectID,
  courseID,
  moduleID,
  newLesson,
  updateTree,
) {
  const lessonRef = doc(
    db,
    "courses",
    subjectID,
    "coursesList",
    courseID,
    "modules",
    moduleID,
    "lessons",
    newLesson.id,
  );
  const contentRef = collection(
    db,
    "courses",
    subjectID,
    "coursesList",
    courseID,
    "modules",
    moduleID,
    "lessons",
    newLesson.id,
    "content",
  );
  const QARef = collection(
    db,
    "courses",
    subjectID,
    "coursesList",
    courseID,
    "modules",
    moduleID,
    "lessons",
    newLesson.id,
    "QA",
  );
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

  return (dispatch) => {
    const handleContent = () => {
      getDocs(contentRef).then((snapshot) => {
        if (snapshot.docs.length) {
          deleteDocument(snapshot);
        } else {
          if (content && JSON.parse(content) && JSON.parse(content).length) {
            createDoc();
          } else {
            handleQuestions();
          }
        }
      });
    };

    const deleteDocument = (snapshot) => {
      const docRef = doc(
        db,
        "courses",
        subjectID,
        "coursesList",
        courseID,
        "modules",
        moduleID,
        "lessons",
        lessonID,
        "content",
        snapshot.docs[toDeleteI].id,
      );
      deleteDoc(docRef).then(() => {
        toDeleteI++;
        if (toDeleteI < snapshot.docs.length) {
          deleteDocument(snapshot);
        } else {
          if (JSON.parse(content) && JSON.parse(content).length) {
            createDoc();
          } else {
            handleQuestions();
          }
        }
      });
    };

    const createDoc = () => {
      const block = JSON.parse(content)[toCreateI];
      const docRef = doc(
        db,
        "courses",
        subjectID,
        "coursesList",
        courseID,
        "modules",
        moduleID,
        "lessons",
        lessonID,
        "content",
        block.id,
      );

      delete block.id;

      setDoc(docRef, {
        ...block,
        order: toCreateI,
      }).then(() => {
        toCreateI++;
        if (toCreateI < JSON.parse(content).length) {
          createDoc();
        } else {
          handleQuestions();
        }
      });
    };

    const handleQuestions = () => {
      getDocs(QARef).then((snapshot) => {
        if (snapshot.docs.length) {
          deleteQuestion(snapshot);
        } else {
          if (QA && JSON.parse(QA) && JSON.parse(QA).length) {
            createQuestion();
          } else {
            lesson = {
              ...newLesson,
              id: lessonID,
            };
            if (content) {
              lesson.content = JSON.parse(content).sort(
                (a, b) => a.order - b.order,
              );
            }
            if (QA) {
              lesson.QA = JSON.parse(QA).sort((a, b) => a.order - b.order);
            }
            dispatch(lessonSuccess(lesson));
          }
        }
      });
    };

    const deleteQuestion = (snapshot) => {
      const docRef = doc(
        db,
        "courses",
        subjectID,
        "coursesList",
        courseID,
        "modules",
        moduleID,
        "lessons",
        lessonID,
        "QA",
        snapshot.docs[toDeleteX].id,
      );
      deleteDoc(docRef).then(() => {
        toDeleteX++;
        if (toDeleteX < snapshot.docs.length) {
          deleteQuestion(snapshot);
        } else {
          if (JSON.parse(QA) && JSON.parse(QA).length) {
            createQuestion();
          } else {
            lesson = {
              ...newLesson,
              id: lessonID,
            };
            lesson.content = JSON.parse(content).sort(
              (a, b) => a.order - b.order,
            );
            lesson.QA = JSON.parse(QA).sort((a, b) => a.order - b.order);
            dispatch(lessonSuccess(lesson));
          }
        }
      });
    };

    const createQuestion = () => {
      const block = JSON.parse(QA)[toCreateX];
      const docRef = doc(
        db,
        "courses",
        subjectID,
        "coursesList",
        courseID,
        "modules",
        moduleID,
        "lessons",
        lessonID,
        "QA",
        block.id,
      );

      delete block.id;

      setDoc(docRef, {
        ...block,
        order: toCreateX,
      }).then(() => {
        toCreateX++;
        if (toCreateX < JSON.parse(QA).length) {
          createQuestion();
        } else {
          lesson = {
            ...newLesson,
            id: lessonID,
          };
          lesson.content = JSON.parse(content).sort(
            (a, b) => a.order - b.order,
          );
          lesson.QA = JSON.parse(QA).sort((a, b) => a.order - b.order);
          dispatch(lessonSuccess(lesson));
        }
      });
    };

    dispatch(coursesBegin());

    return setDoc(lessonRef, {
      ...newLesson,
    }).then(() => {
      handleContent();
    });
  };
}

export function copyLesson(subjectID, courseID, moduleID, newLesson) {
  const contentRef = collection(
    db,
    "courses",
    newLesson.subjectID,
    "coursesList",
    newLesson.courseID,
    "modules",
    newLesson.moduleID,
    "lessons",
    newLesson.lesson.id,
    "content",
  );
  const QARef = collection(
    db,
    "courses",
    newLesson.subjectID,
    "coursesList",
    newLesson.courseID,
    "modules",
    newLesson.moduleID,
    "lessons",
    newLesson.lesson.id,
    "QA",
  );
  const newID = generate({
    length: 20,
    numbers: true,
  });
  const newLessonRef = doc(
    db,
    "courses",
    subjectID,
    "coursesList",
    courseID,
    "modules",
    moduleID,
    "lessons",
    newID,
  );
  let content = null;
  let qa = null;
  const batch = writeBatch(db);

  return (dispatch) => {
    getDocs(contentRef).then((snapshot) => {
      content = snapshot.docs.map((doc) => doc.data());
      getDocs(QARef).then((snapshot) => {
        qa = snapshot.docs.map((doc) => doc.data());
        const createLesson = {
          ...newLesson.lesson,
          id: newID,
          name: {
            ru: "",
            en: `${newLesson.lesson.name.en || newLesson.lesson.name.ua}-copy`,
            ua: `${newLesson.lesson.name.ua}-копія`,
          },
        };

        setDoc(newLessonRef, {
          ...createLesson,
        }).then(() => {
          content.forEach((doc) => {
            batch.set(
              doc(
                db,
                "courses",
                subjectID,
                "coursesList",
                courseID,
                "modules",
                moduleID,
                "lessons",
                createLesson.id,
                "content",
              ).doc(),
              doc,
            );
          });
          qa.forEach((doc) => {
            batch.set(
              doc(
                db,
                "courses",
                subjectID,
                "coursesList",
                courseID,
                "modules",
                moduleID,
                "lessons",
                createLesson.id,
                "QA",
              ).doc(),
              doc,
            );
          });
          batch.commit();
        });
      });
    });
  };
}

export function deleteLesson(subjectID, courseID, moduleID, lessonID) {
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

  return (dispatch) => {
    dispatch(coursesBegin());
    return deleteDoc(lessonRef).then(() => {
      dispatch(coursesSuccess(subjectsList));
    });
  };
}

export function fetchLesson(subjectID, courseID, moduleID, lessonID) {
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
  const contentRef = collection(
    db,
    "courses",
    subjectID,
    "coursesList",
    courseID,
    "modules",
    moduleID,
    "lessons",
    lessonID,
    "content",
  );
  const QARef = collection(
    db,
    "courses",
    subjectID,
    "coursesList",
    courseID,
    "modules",
    moduleID,
    "lessons",
    lessonID,
    "QA",
  );

  return (dispatch) => {
    dispatch(lessonBegin());
    return getDoc(lessonRef).then((snapshot) => {
      lesson = {
        ...snapshot.data(),
        id: snapshot.id,
      };
      return getDocs(contentRef).then((contentSnapshot) => {
        const content = [];
        if (contentSnapshot.docs.length) {
          contentSnapshot.docs.forEach((doc) => {
            content.push({
              ...doc.data(),
              id: doc.id,
            });
          });
        }
        return getDocs(QARef).then((QASnapshot) => {
          const QA = [];
          if (QASnapshot.docs.length) {
            QASnapshot.docs.forEach((doc) => {
              QA.push({
                ...doc.data(),
                id: doc.id,
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
  return (dispatch) => {
    dispatch(discardLessonSuccess());
  };
}

export const discardLessonSuccess = () => {
  return {
    type: DISCARD_SUCCESS,
  };
};

export const coursesBegin = () => {
  return {
    type: COURSES_BEGIN,
  };
};
export const coursesSuccess = (subjectsList) => {
  return {
    type: COURSES_SUCCESS,
    payload: { subjectsList },
  };
};

export const coursesListBegin = () => {
  return {
    type: COURSES_LIST_BEGIN,
  };
};
export const coursesListSuccess = (subjectCoursesList) => {
  return {
    type: COURSES_LIST_SUCCESS,
    payload: { subjectCoursesList },
  };
};

export const modulesBegin = () => {
  return {
    type: MODULES_BEGIN,
  };
};
export const modulesSuccess = (modulesList) => {
  return {
    type: MODULES_SUCCESS,
    payload: { modulesList },
  };
};

export const lessonsBegin = () => {
  return {
    type: LESSONS_BEGIN,
  };
};
export const lessonsSuccess = (lessonsList) => {
  return {
    type: LESSONS_SUCCESS,
    payload: { lessonsList },
  };
};

export const allCoursesBegin = () => {
  return {
    type: ALL_COURSES_BEGIN,
  };
};
export const allCoursesSuccess = (allCoursesList) => {
  return {
    type: ALL_COURSES_SUCCESS,
    payload: { allCoursesList },
  };
};

export const lessonBegin = () => {
  return {
    type: LESSON_BEGIN,
  };
};
export const lessonSuccess = (lesson) => {
  return {
    type: LESSON_SUCCESS,
    payload: { lesson },
  };
};

export const modulesLessonBegin = () => {
  return {
    type: MODULES_LESSONS_BEGIN,
  };
};
export const modulesLessonSuccess = (modulesLessons) => {
  return {
    type: MODULES_LESSONS_SUCCESS,
    payload: { modulesLessons },
  };
};

export const DISCARD_SUCCESS = "DISCARD_SUCCESS";
export const COURSES_BEGIN = "COURSES_BEGIN";
export const COURSES_SUCCESS = "COURSES_SUCCESS";
export const ALL_COURSES_BEGIN = "ALL_COURSES_BEGIN";
export const ALL_COURSES_SUCCESS = "ALL_COURSES_SUCCESS";
export const LESSON_BEGIN = "LESSON_BEGIN";
export const LESSON_SUCCESS = "LESSON_SUCCESS";
export const MODULES_LESSONS_BEGIN = "MODULES_LESSONS_BEGIN";
export const MODULES_LESSONS_SUCCESS = "MODULES_LESSONS_SUCCESS";
export const LESSONS_BEGIN = "LESSONS_BEGIN";
export const LESSONS_SUCCESS = "LESSONS_SUCCESS";
export const COURSES_LIST_BEGIN = "COURSES_LIST_BEGIN";
export const COURSES_LIST_SUCCESS = "COURSES_LIST_SUCCESS";
export const MODULES_BEGIN = "MODULES_BEGIN";
export const MODULES_SUCCESS = "MODULES_SUCCESS";
