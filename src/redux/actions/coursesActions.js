import firebase from "../../db/firestore";

const db = firebase.firestore();
const coursesCollection = db.collection('courses');
const subjectsList = [];

export function fetchSubjects() {
    if ( !subjectsList.length ) {
        return dispatch => {
            dispatch(coursesBegin());

            return coursesCollection.get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    subjectsList.push({
                        ...doc.data(),
                        id: doc.id
                    });
                });
                dispatch(coursesSuccess(subjectsList));
            });
        }
    }
    else {
        return dispatch => {
            dispatch(coursesSuccess(subjectsList))
        }
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

export function updateLesson(subjectID, courseID, moduleID, lesson) {
    const lessonRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lesson.id);
    const lessonID = lesson.id;

    delete lesson.id;

    return dispatch => {
        dispatch(coursesBegin());
        return lessonRef.set({
            ...lesson
        }).then(() => {
            const foundSubject = subjectsList.find(item => item.id === subjectID);
            const foundCourse = foundSubject.coursesList.find(item => item.id === courseID);
            const foundModule = foundCourse.modules.find(item => item.id === moduleID);
            let foundLesson = null;

            if ( foundModule.lessons ) {
                foundLesson = foundModule.lessons.find(item => item.id === lessonID);
            }

            if ( foundLesson ) {
                foundModule.lessons.splice(foundModule.lessons.indexOf(foundLesson), 1);
            }

            if ( foundModule.lessons ) {
                foundModule.lessons.push({
                    ...lesson,
                    id: lessonID
                });
            }

            dispatch(coursesSuccess(subjectsList));
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

export const COURSES_BEGIN = 'COURSES_BEGIN';
export const COURSES_SUCCESS = 'COURSES_SUCCESS';
