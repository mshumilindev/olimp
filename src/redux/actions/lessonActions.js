import firebase from "../../db/firestore";

const db = firebase.firestore();

export function fetchLessonMeta(subjectID, courseID, moduleID, lessonID) {
    const lessonRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lessonID);

    return dispatch => {
        dispatch(fetchLessonMetaBegin());
        return lessonRef.onSnapshot(snapshot => {
            const lessonMeta = {
                ...snapshot.data(),
                id: snapshot.id
            };
            dispatch(fetchLessonMetaSuccess(lessonMeta));
        });
    };
}

export const FETCH_LESSON_META_BEGIN = 'FETCH_LESSON_META_BEGIN';
export const FETCH_LESSON_META_SUCCESS = 'FETCH_LESSON_META_SUCCESS';

export const fetchLessonMetaBegin = () => {
    return {
        type: FETCH_LESSON_META_BEGIN
    }
};

export const fetchLessonMetaSuccess = lessonMeta => {
    return {
        type: FETCH_LESSON_META_SUCCESS,
        payload: {lessonMeta}
    }
};

export function fetchLessonContent(subjectID, courseID, moduleID, lessonID) {
    const lessonContentRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lessonID).collection('content');

    return dispatch => {
        dispatch(fetchLessonContentBegin());
        return lessonContentRef.onSnapshot(snapshot => {
            const lessonContent = [];

            if ( snapshot.docs.length ) {
                snapshot.docs.forEach(item => lessonContent.push({
                    ...item.data(),
                    id: item.id
                }));
            }
            dispatch(fetchLessonContentSuccess(lessonContent));
        });
    };
}

export const FETCH_LESSON_CONTENT_BEGIN = 'FETCH_LESSON_CONTENT_BEGIN';
export const FETCH_LESSON_CONTENT_SUCCESS = 'FETCH_LESSON_CONTENT_SUCCESS';

export const fetchLessonContentBegin = () => {
    return {
        type: FETCH_LESSON_CONTENT_BEGIN
    }
};

export const fetchLessonContentSuccess = lessonContent => {
    return {
        type: FETCH_LESSON_CONTENT_SUCCESS,
        payload: {lessonContent}
    }
};
