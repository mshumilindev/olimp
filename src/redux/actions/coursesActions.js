import firebase from "../../db/firestore";

const db = firebase.firestore();
const coursesCollection = db.collection('courses');
const subjectsList = [];
const allCoursesList = [];
let lesson = null;

export function fetchSubjects() {
    return dispatch => {
        if ( !subjectsList.length ) {
            dispatch(coursesBegin());

            return coursesCollection.get().then((snapshot) => {
                subjectsList.splice(0, subjectsList.length);
                snapshot.docs.forEach(doc => {
                    subjectsList.push({
                        ...doc.data(),
                        id: doc.id
                    });
                });
                dispatch(coursesSuccess(subjectsList));
            });
        }
        else {
            dispatch(coursesSuccess(subjectsList));
        }
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

export function fetchCoursesList(subjectID) {
    const courseListRef = db.collection('courses').doc(subjectID).collection('coursesList');

    return dispatch => {
        dispatch(coursesBegin());
        return courseListRef.get().then((snapshot) => {
            subjectsList.find(item => item.id === subjectID).coursesList = [];
            snapshot.docs.forEach(doc => {
                subjectsList.find(item => item.id === subjectID).coursesList.push({
                    ...doc.data(),
                    id: doc.id
                });
            });
            dispatch(coursesSuccess(subjectsList));
        });
    };
}

export function fetchModules(subjectID, courseID) {
    const modulesRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules');

    return dispatch => {
        dispatch(coursesBegin());
        return modulesRef.get().then((snapshot) => {
            subjectsList.find(item => item.id === subjectID).coursesList.find(item => item.id === courseID).modules = [];
            snapshot.docs.forEach(doc => {
                subjectsList.find(item => item.id === subjectID).coursesList.find(item => item.id === courseID).modules.push({
                    ...doc.data(),
                    id: doc.id
                });
            });
            dispatch(coursesSuccess(subjectsList));
        });
    };
}

export function fetchLessons(subjectID, courseID, moduleID) {
    const lessonsRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons');

    return dispatch => {
        dispatch(coursesBegin());
        return lessonsRef.get().then((snapshot) => {
            subjectsList
                .find(item => item.id === subjectID).coursesList
                .find(item => item.id === courseID).modules
                .find(item => item.id === moduleID).lessons = [];
            snapshot.docs.forEach(doc => {
                subjectsList
                    .find(item => item.id === subjectID).coursesList
                    .find(item => item.id === courseID).modules
                    .find(item => item.id === moduleID).lessons
                    .push({
                        ...doc.data(),
                        id: doc.id
                    });
            });
            dispatch(coursesSuccess(subjectsList));
        });
    };
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

    return dispatch => {
        dispatch(coursesBegin());
        return subjectRef.delete().then(() => {
            subjectsList.splice(subjectsList.indexOf(subjectsList.find(item => item.id === subjectID)), 1);
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

export function updateCourse(subjectID, course) {
    const courseRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(course.id);
    const courseID = course.id;

    delete course.id;

    return dispatch => {
        dispatch(coursesBegin());
        return courseRef.set({
            ...course
        }).then(() => {
            const foundSubject = subjectsList.find(item => item.id === subjectID);
            let foundCourse = null;

            if ( foundSubject.coursesList ) {
                foundCourse = foundSubject.coursesList.find(item => item.id === courseID);
            }

            if ( foundCourse ) {
                foundSubject.coursesList.splice(foundSubject.coursesList.indexOf(foundCourse), 1);
            }

            if ( foundSubject.coursesList ) {
                foundSubject.coursesList.push({
                    ...course,
                    id: courseID
                });
            }

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

export function deleteCourse(subjectID, courseID) {
    const courseRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID);

    return dispatch => {
        dispatch(coursesBegin());
        return courseRef.delete().then(() => {
            const foundSubject = subjectsList.find(item => item.id === subjectID);
            foundSubject.coursesList.splice(foundSubject.coursesList.indexOf(foundSubject.coursesList.find(item => item.id === courseID)), 1);
            dispatch(coursesSuccess(subjectsList));
        });
    };
}

export function updateModule(subjectID, courseID, module) {
    const moduleRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(module.id);
    const moduleID = module.id;

    delete module.id;

    return dispatch => {
        dispatch(coursesBegin());
        return moduleRef.set({
            ...module
        }).then(() => {
            const foundSubject = subjectsList.find(item => item.id === subjectID);
            const foundCourse = foundSubject.coursesList.find(item => item.id === courseID);
            let foundModule = null;

            if ( foundCourse.modules ) {
                foundModule = foundCourse.modules.find(item => item.id === moduleID);
            }

            if ( foundModule ) {
                foundCourse.modules.splice(foundCourse.modules.indexOf(foundModule), 1);
            }

            if ( foundCourse.modules ) {
                foundCourse.modules.push({
                    ...module,
                    id: moduleID
                });
            }

            dispatch(coursesSuccess(subjectsList));
        });
    };
}

export function deleteModule(subjectID, courseID, moduleID) {
    const moduleRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID);

    return dispatch => {
        dispatch(coursesBegin());
        return moduleRef.delete().then(() => {
            const foundSubject = subjectsList.find(item => item.id === subjectID);
            const foundCourse = foundSubject.coursesList.find(item => item.id === courseID);

            foundCourse.modules.splice(foundCourse.modules.indexOf(foundCourse.modules.find(item => item.id === moduleID)), 1);
            dispatch(coursesSuccess(subjectsList));
        });
    };
}

export function updateLesson(subjectID, courseID, moduleID, newLesson, updateTree) {
    const lessonRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(newLesson.id);
    const contentRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(newLesson.id).collection('content');
    const questionsRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(newLesson.id).collection('questions');
    const lessonID = newLesson.id;
    const content = JSON.stringify(newLesson.content);
    const questions = JSON.stringify(newLesson.questions);
    let toDeleteI = 0;
    let toCreateI = 0;
    let toDeleteX = 0;
    let toCreateX = 0;

    delete newLesson.id;
    delete newLesson.content;
    delete newLesson.questions;

    return dispatch => {
        const handleContent = () => {
            contentRef.get().then(snapshot => {
                if ( snapshot.docs.length ) {
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
            questionsRef.get().then(snapshot => {
                if ( snapshot.docs.length ) {
                    deleteQuestion(snapshot);
                }
                else {
                    if ( JSON.parse(questions) && JSON.parse(questions).length ) {
                        createQuestion();
                    }
                    else {
                        lesson = {
                            ...newLesson,
                            id: lessonID
                        };
                        lesson.content = JSON.parse(content).sort((a, b) => a.order - b.order);
                        lesson.questions = JSON.parse(questions).sort((a, b) => a.order - b.order);
                        dispatch(lessonSuccess(lesson));
                    }
                }
            });
        };

        const deleteQuestion = snapshot => {
            const docRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lessonID).collection('questions').doc(snapshot.docs[toDeleteX].id);
            docRef.delete().then(() => {
                toDeleteX ++;
                if ( toDeleteX < snapshot.docs.length ) {
                    deleteQuestion(snapshot);
                }
                else {
                    if ( JSON.parse(questions) && JSON.parse(questions).length ) {
                        createQuestion();
                    }
                    else {
                        lesson = {
                            ...newLesson,
                            id: lessonID
                        };
                        lesson.content = JSON.parse(content).sort((a, b) => a.order - b.order);
                        lesson.questions = JSON.parse(questions).sort((a, b) => a.order - b.order);
                        dispatch(lessonSuccess(lesson));
                    }
                }
            });
        };

        const createQuestion = () => {
            const block = JSON.parse(questions)[toCreateX];
            const docRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lessonID).collection('questions').doc(block.id);

            delete block.id;

            docRef.set({
                ...block,
                order: toCreateX
            }).then(() => {
                toCreateX ++;
                if ( toCreateX < JSON.parse(questions).length ) {
                    createQuestion();
                }
                else {
                    lesson = {
                        ...newLesson,
                        id: lessonID
                    };
                    lesson.content = JSON.parse(content).sort((a, b) => a.order - b.order);
                    lesson.questions = JSON.parse(questions).sort((a, b) => a.order - b.order);
                    dispatch(lessonSuccess(lesson));
                }
            });
        };

        dispatch(coursesBegin());

        return lessonRef.set({
            ...newLesson
        }).then(() => {
            handleContent();
            if ( updateTree ) {
                const lessonsRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons');

                dispatch(coursesBegin());
                return lessonsRef.get().then((snapshot) => {
                    subjectsList
                        .find(item => item.id === subjectID).coursesList
                        .find(item => item.id === courseID).modules
                        .find(item => item.id === moduleID).lessons = [];
                    snapshot.docs.forEach(doc => {
                        subjectsList
                            .find(item => item.id === subjectID).coursesList
                            .find(item => item.id === courseID).modules
                            .find(item => item.id === moduleID).lessons
                            .push({
                                ...doc.data(),
                                id: doc.id
                            });
                    });
                    dispatch(coursesSuccess(subjectsList));
                });
            }
        });
    };
}

export function deleteLesson(subjectID, courseID, moduleID, lessonID) {
    const lessonRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lessonID);

    return dispatch => {
        dispatch(coursesBegin());
        return lessonRef.delete().then(() => {
            const foundSubject = subjectsList.find(item => item.id === subjectID);
            const foundCourse = foundSubject.coursesList.find(item => item.id === courseID);
            const foundModule = foundCourse.modules.find(item => item.id === moduleID);

            foundModule.lessons.splice(foundModule.lessons.indexOf(foundModule.lessons.find(item => item.id === lessonID)), 1);
            dispatch(coursesSuccess(subjectsList));
        });
    };
}

export function fetchLesson(subjectID, courseID, moduleID, lessonID) {
    const lessonRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lessonID);
    const contentRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lessonID).collection('content');
    const questionsRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lessonID).collection('questions');

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
                return questionsRef.get().then(questionsSnapshot => {
                    const questions = [];
                    if ( questionsSnapshot.docs.length ) {
                        questionsSnapshot.docs.forEach(doc => {
                            questions.push({
                                ...doc.data(),
                                id: doc.id
                            });
                        });
                    }
                    lesson.content = content.sort((a, b) => a.order - b.order);
                    lesson.questions = questions.sort((a, b) => a.order - b.order);
                    dispatch(lessonSuccess(lesson));
                });
            });
        });
    };
}

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

export const COURSES_BEGIN = 'COURSES_BEGIN';
export const COURSES_SUCCESS = 'COURSES_SUCCESS';
export const ALL_COURSES_BEGIN = 'ALL_COURSES_BEGIN';
export const ALL_COURSES_SUCCESS = 'ALL_COURSES_SUCCESS';
export const LESSON_BEGIN = 'LESSON_BEGIN';
export const LESSON_SUCCESS = 'LESSON_SUCCESS';
export const MODULES_LESSONS_BEGIN = 'MODULES_LESSONS_BEGIN';
export const MODULES_LESSONS_SUCCESS = 'MODULES_LESSONS_SUCCESS';
