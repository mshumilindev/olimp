import firebase from "../../db/firestore";

const db = firebase.firestore();
const classesCollection = db.collection('classes');
const classesList = [];

export function fetchClasses() {
    if ( !classesList.length ) {
        return dispatch => {
            dispatch(classesBegin());
            return classesCollection.get().then(snapshot => {
                snapshot.docs.map(doc => {
                    classesList.push({
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
export const CLASSES_BEGIN = 'CLASSES_BEGIN';
export const CLASSES_SUCCESS = 'CLASSES_SUCCESS';

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
