import firebase from "../../db/firestore";

const db = firebase.firestore();
const classesCollection = db.collection('classes');
const classesList = [];

export function fetchClasses() {
    if ( !classesList.length ) {
        return dispatch => {
            dispatch(classesBegin());
            return classesCollection.get().then(snapshot => {
                classesList.splice(0, classesList.length);
                snapshot.docs.map(doc => {
                    return classesList.push({
                        ...doc.data(),
                        id: doc.id
                    })
                });
                dispatch(classesSuccess(classesList));
            });
        };
    }
    else {
        return dispatch => {
            dispatch(classesSuccess(classesList));
        };
    }
}

export function removeClass(classID) {
    const classRef = db.collection('classes').doc(classID);

    return dispatch => {
        dispatch(classesBegin());
        return classRef.delete().then(() => {
            return classesCollection.get().then(snapshot => {
                classesList.splice(0, classesList.length);
                snapshot.docs.map(doc => {
                    return classesList.push({
                        ...doc.data(),
                        id: doc.id
                    });
                });
                dispatch(classesSuccess(classesList));
            });
        });
    }
}

export function createClass(classID, classData) {
    const classRef = db.collection('classes').doc(classID);

    delete classData.id;

    return dispatch => {
        dispatch(classesBegin());
        return classRef.set({
            ...classData
        }).then(() => {
            return classesCollection.get().then(snapshot => {
                classesList.splice(0, classesList.length);
                snapshot.docs.map(doc => {
                    return classesList.push({
                        ...doc.data(),
                        id: doc.id
                    });
                });
                dispatch(classesSuccess(classesList));
            });
        });
    };
}

export function updateClass(classID, classData) {
    const classRef = db.collection('classes').doc(classID);

    return dispatch => {
        dispatch(classBegin());
        return classRef.set({
            ...classData
        }).then(() => {
            return classesCollection.get().then(snapshot => {
                classesList.splice(0, classesList.length);
                snapshot.docs.map(doc => {
                    return classesList.push({
                        ...doc.data(),
                        id: doc.id
                    })
                });
                dispatch(classesSuccess(classesList));
                dispatch(classSuccess(classData));
            });
        });
    };
}

export function fetchClass(classID) {
    const docRef = db.collection('classes').doc(classID);

    return dispatch => {
        dispatch(classBegin());
        return docRef.get().then(snapshot => {
            dispatch(classSuccess({
                ...snapshot.data(),
                id: snapshot.id
            }));
        });
    }
}

export function discardClass() {
    return dispatch => {
        dispatch(discardClassSuccess());
    }
}

export const CLASSES_BEGIN = 'CLASSES_BEGIN';
export const CLASSES_SUCCESS = 'CLASSES_SUCCESS';
export const CLASS_BEGIN = 'CLASS_BEGIN';
export const CLASS_SUCCESS = 'CLASS_SUCCESS';
export const DISCARD_CLASS = 'DISCARD_CLASS';

export const classesBegin = () => {
    return {
        type: CLASSES_BEGIN
    }
};
export const classesSuccess = classesList => {
    return {
        type: CLASSES_SUCCESS,
        payload: { classesList }
    }
};
export const classBegin = () => {
    return {
        type: CLASS_BEGIN
    }
};
export const classSuccess = classData => {
    return {
        type: CLASS_SUCCESS,
        payload: { classData }
    }
};
export const discardClassSuccess = () => {
    return {
        type: DISCARD_CLASS
    }
};
