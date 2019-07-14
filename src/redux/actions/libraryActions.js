import firebase from "../../db/firestore";

const db = firebase.firestore();
const libraryCollection = db.collection('library');
const libraryList = [];

export const FETCH_LIBRARY_BEGIN = 'FETCH_LIBRARY_BEGIN ';
export const FETCH_LIBRARY_SUCCESS = 'FETCH_LIBRARY_SUCCESS';

export function fetchLibrary() {
    if ( !libraryList.length ) {
        return dispatch => {
            dispatch(fetchLibraryBegin());

            return libraryCollection.get().then((data) => {
                data.docs.forEach(doc => {
                    libraryList.push({
                        ...doc.data(),
                        id: doc.id
                    });
                });
                dispatch(fetchLibrarySuccess(libraryList.sort((a, b) => {
                    if ( a.name < b.name ) {
                        return -1;
                    }
                    if ( a.name > b.name ) {
                        return 1;
                    }
                    return 0;
                })));
            });
        }
    }
    else {
        return dispatch => {
            dispatch(fetchLibrarySuccess(libraryList.sort((a, b) => {
                if ( a.name < b.name ) {
                    return -1;
                }
                if ( a.name > b.name ) {
                    return 1;
                }
                return 0;
            })));
        }
    }
}

export const fetchLibraryBegin = () => {
    return {
        type: FETCH_LIBRARY_BEGIN
    }
};
export const fetchLibrarySuccess = libraryList => {
    return {
        type: FETCH_LIBRARY_SUCCESS,
        payload: { libraryList }
    }
};
