import firebase from "../../db/firestore";

const db = firebase.firestore();
const coursesCollection = db.collection('courses');
const subjectsList = [];

export const FETCH_SUBJECTS_BEGIN = 'FETCH_SUBJECTS_BEGIN';
export const FETCH_SUBJECTS_SUCCESS = 'FETCH_SUBJECTS_SUCCESS';

export function fetchSubjects() {
    if ( !subjectsList.length ) {
        return dispatch => {
            dispatch(fetchSubjectsBegin());

            return coursesCollection.get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    subjectsList.push({
                        ...doc.data(),
                        id: doc.id
                    });
                });
                dispatch(fetchSubjectsSuccess(subjectsList));
            });
        }
    }
    else {
        return dispatch => {
            dispatch(fetchSubjectsSuccess(subjectsList))
        }
    }
}

export const fetchSubjectsBegin = () => {
    return {
        type: FETCH_SUBJECTS_BEGIN
    }
};
export const fetchSubjectsSuccess = subjectsList => {
    return {
        type: FETCH_SUBJECTS_SUCCESS,
        payload: { subjectsList }
    }
};

export const FETCH_COURSESLIST_BEGIN = 'FETCH_COURSESLIST_BEGIN';
export const FETCH_COURSESLIST_SUCCESS = 'FETCH_COURSESLIST_SUCCESS';

export function fetchCoursesList(subjectID) {
    const courseListRef = db.collection('courses').doc(subjectID).collection('coursesList');

    return dispatch => {
        dispatch(fetchCoursesListBegin());
        return courseListRef.get().then((snapshot) => {
            subjectsList.find(item => item.id === subjectID).coursesList = [];
            snapshot.docs.forEach(doc => {
                subjectsList.find(item => item.id === subjectID).coursesList.push({
                    ...doc.data(),
                    id: doc.id
                });
            });
            dispatch(fetchCoursesListSuccess(subjectsList));
        });
    };
}

export const fetchCoursesListBegin = () => {
    return {
        type: FETCH_COURSESLIST_BEGIN
    }
};
export const fetchCoursesListSuccess = subjectsList => {
    return {
        type: FETCH_COURSESLIST_SUCCESS,
        payload: { subjectsList }
    }
};

export const FETCH_MODULES_BEGIN = 'FETCH_MODULES_BEGIN';
export const FETCH_MODULES_SUCCESS = 'FETCH_MODULES_SUCCESS';

export function fetchModules(subjectID, courseID) {
    const modulesRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules');

    return dispatch => {
        dispatch(fetchModulesBegin());
        return modulesRef.get().then((snapshot) => {
            subjectsList.find(item => item.id === subjectID).coursesList.find(item => item.id === courseID).modules = [];
            snapshot.docs.forEach(doc => {
                subjectsList.find(item => item.id === subjectID).coursesList.find(item => item.id === courseID).modules.push({
                    ...doc.data(),
                    id: doc.id
                });
            });
            dispatch(fetchModulesSuccess(subjectsList));
        });
    };
}

export const fetchModulesBegin = () => {
    return {
        type: FETCH_MODULES_BEGIN
    }
};
export const fetchModulesSuccess = subjectsList => {
    return {
        type: FETCH_MODULES_SUCCESS,
        payload: { subjectsList }
    }
};

export const FETCH_LESSONS_BEGIN = 'FETCH_LESSONS_BEGIN';
export const FETCH_LESSONS_SUCCESS = 'FETCH_LESSONS_SUCCESS';

export function fetchLessons(subjectID, courseID, moduleID) {
    const lessonsRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons');

    return dispatch => {
        dispatch(fetchLessonsBegin());
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
            dispatch(fetchLessonsSuccess(subjectsList));
        });
    };
}

export const fetchLessonsBegin = () => {
    return {
        type: FETCH_LESSONS_BEGIN
    }
};
export const fetchLessonsSuccess = subjectsList => {
    return {
        type: FETCH_LESSONS_SUCCESS,
        payload: { subjectsList }
    }
};