import firebase from "../../db/firestore";

const db = firebase.firestore();

export function fetchLessonMeta(subjectID, courseID, moduleID, lessonID) {
    const lessonRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lessonID);
    let unsubscribe = null;

    return dispatch => {
        dispatch(fetchLessonMetaBegin());
        if ( unsubscribe ) {
            unsubscribe();
        }
        unsubscribe = lessonRef.onSnapshot(snapshot => {
            const lessonMeta = {
                ...snapshot.data(),
                id: snapshot.id
            };
            dispatch(fetchLessonMetaSuccess(lessonMeta));
        });
    };
}

export function updateLessonMeta(subjectID, courseID, moduleID, lessonID, newMeta) {
    const lessonRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lessonID);

    return dispatch => {
        dispatch(fetchLessonMetaBegin());
        return lessonRef.set({
            ...newMeta
        }, {merge: true});
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
    let unsubscribe = null;

    return dispatch => {
        dispatch(fetchLessonContentBegin());
        if ( unsubscribe ) {
            unsubscribe();
        }
        unsubscribe = lessonContentRef.onSnapshot(snapshot => {
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

export function updateLessonContent(subjectID, courseID, moduleID, lessonID, newContent) {
    const lessonContentRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lessonID).collection('content');

    return dispatch => {
        dispatch(fetchLessonContentBegin());
        lessonContentRef.get().then(snapshot => {
            const toDelete = snapshot.docs.filter(doc => !newContent.find(item => item.id === doc.id));
            const toUpdate = snapshot.docs.filter(doc => newContent.find(item => item.id === doc.id));
            const toCreate = newContent.filter(item => !snapshot.docs.find(doc => doc.id === item.id));

            if ( toDelete.length ) {
                toDelete.forEach(doc => {
                    doc.ref.delete();
                });
            }

            if ( toUpdate.length ) {
                toUpdate.forEach(doc => {
                    doc.ref.set({
                        ...newContent.find(item => item.id === doc.id)
                    }, {merge: true});
                });
            }

            if ( toCreate.length ) {
                toCreate.forEach(item => {
                    const newContentItem = lessonContentRef.doc(item.id);

                    newContentItem.set(item);
                });
            }
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

export function fetchLessonQA(subjectID, courseID, moduleID, lessonID) {
    const lessonQARef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lessonID).collection('QA');
    let unsubscribe = null;

    return dispatch => {
        dispatch(fetchLessonQABegin());
        if ( unsubscribe ) {
            unsubscribe();
        }
        unsubscribe = lessonQARef.onSnapshot(snapshot => {
            const lessonQA = [];

            if ( snapshot.docs.length ) {
                snapshot.docs.forEach(item => lessonQA.push({
                    ...item.data(),
                    id: item.id
                }));
            }
            dispatch(fetchLessonQASuccess(lessonQA));
        });
    };
}

export function updateLessonQA(subjectID, courseID, moduleID, lessonID, newQA) {
    const lessonQARef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(moduleID).collection('lessons').doc(lessonID).collection('QA');

    return dispatch => {
        dispatch(fetchLessonQABegin());
        lessonQARef.get().then(snapshot => {
            const toDelete = snapshot.docs.filter(doc => !newQA.find(item => item.id === doc.id));
            const toUpdate = snapshot.docs.filter(doc => newQA.find(item => item.id === doc.id));
            const toCreate = newQA.filter(item => !snapshot.docs.find(doc => doc.id === item.id));

            if ( toDelete.length ) {
                toDelete.forEach(doc => {
                    doc.ref.delete();
                });
            }

            if ( toUpdate.length ) {
                toUpdate.forEach(doc => {
                    doc.ref.set({
                        ...newQA.find(item => item.id === doc.id)
                    }, {merge: true});
                });
            }

            if ( toCreate.length ) {
                toCreate.forEach(item => {
                    const newContentItem = lessonQARef.doc(item.id);

                    newContentItem.set(item);
                });
            }
        });
    };
}

export const FETCH_LESSON_QA_BEGIN = 'FETCH_LESSON_QA_BEGIN';
export const FETCH_LESSON_QA_SUCCESS = 'FETCH_LESSON_QA_SUCCESS';

export const fetchLessonQABegin = () => {
    return {
        type: FETCH_LESSON_QA_BEGIN
    }
};

export const fetchLessonQASuccess = lessonQA => {
    return {
        type: FETCH_LESSON_QA_SUCCESS,
        payload: {lessonQA}
    }
};
