import firebase from "../../db/firestore";

const db = firebase.firestore();
const libraryCollection = db.collection('library');
const libraryList = [];

const storage = firebase.storage();
const storageRef = storage.ref();

export const FETCH_LIBRARY_BEGIN = 'FETCH_LIBRARY_BEGIN';
export const FETCH_LIBRARY_SUCCESS = 'FETCH_LIBRARY_SUCCESS';

export function fetchLibrary() {
    if ( !libraryList.length ) {
        return dispatch => {
            dispatch(fetchLibraryBegin());

            return libraryCollection.get().then((data) => {
                libraryList.splice(0, libraryList.length);
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

export const FETCH_TEXTBOOK_BEGIN = 'FETCH_TEXTBOOK_BEGIN';
export const FETCH_TEXTBOOK_SUCCESS = 'FETCH_TEXTBOOK_SUCCESS';

export function fetchTextbook(textbookID) {
    const textbookRef = db.collection('library').doc(textbookID);

    return dispatch => {
        dispatch(fetchTextbookBegin());

        return textbookRef.get().then(snapshot => {
            dispatch(fetchTextbookSuccess({
                ...snapshot.data(),
                id: snapshot.id
            }));
        });
    }
}

export const fetchTextbookBegin = () => {
    return {
        type: FETCH_TEXTBOOK_BEGIN
    }
};
export const fetchTextbookSuccess = textbook => {
    return {
        type: FETCH_TEXTBOOK_SUCCESS,
        payload: { textbook }
    }
};

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

export const DELETE_DOC_BEGIN = 'DELETE_DOC_BEGIN';
export const DELETE_DOC_SUCCESS = 'DELETE_DOC_SUCCESS';

export function deleteDoc(docID, docRef) {
    const documentRef = storageRef.child('library/' + docRef);
    const documentDoc = db.collection('library').doc(docID);

    return dispatch => {
        dispatch(deleteDocBegin());
        return documentRef.delete().then(() => {
            return documentDoc.delete().then(() => {
                const doc = libraryList.find(item => item.id === docID);
                libraryList.splice(libraryList.indexOf(doc), libraryList.indexOf(doc) + 1);
                dispatch(deleteDocSuccess(libraryList.sort((a, b) => {
                    if ( a.name < b.name ) {
                        return -1;
                    }
                    if ( a.name > b.name ) {
                        return 1;
                    }
                    return 0;
                })));
            });
        });
    };
}

export const deleteDocBegin = () => {
    return {
        type: DELETE_DOC_BEGIN
    }
};
export const deleteDocSuccess = libraryList => {
    return {
        type: DELETE_DOC_SUCCESS,
        payload: { libraryList }
    }
};

export const UPLOAD_DOC_BEGIN = 'UPLOAD_DOC_BEGIN';
export const UPLOAD_DOC_SUCCESS = 'UPLOAD_DOC_SUCCESS';

export function uploadDoc(newFile, file, id) {
    const documentRef = storageRef.child('library/' + file.name);
    const documentDoc = db.collection('library').doc(id);

    return dispatch => {
        dispatch(uploadDocBegin());
        return documentRef.put(file).then((snapshot) => {
            return documentDoc.set({...newFile, ref: file.name}).then(() => {
                libraryList.push({...newFile, ref: file.name, id: id});
                dispatch(uploadDocSuccess(libraryList.sort((a, b) => {
                    if ( a.name < b.name ) {
                        return -1;
                    }
                    if ( a.name > b.name ) {
                        return 1;
                    }
                    return 0;
                })));
            });
        });
    };
}

export const uploadDocBegin = () => {
    return {
        type: UPLOAD_DOC_BEGIN
    }
};
export const uploadDocSuccess = libraryList => {
    return {
        type: UPLOAD_DOC_SUCCESS,
        payload: { libraryList }
    }
};

export const UPDATE_DOC_BEGIN = 'UPDATE_DOC_BEGIN';
export const UPDATE_DOC_SUCCESS = 'UPDATE_DOC_SUCCESS';

export function updateDoc(newFile, id) {
    const documentDoc = db.collection('library').doc(id);

    return dispatch => {
        dispatch(updateDocBegin());
        return documentDoc.update({...newFile}).then(() => {
            libraryList.find(item => item.ref === newFile.ref).name = newFile.name;
            libraryList.find(item => item.ref === newFile.ref).tags = newFile.tags;
            libraryList.find(item => item.ref === newFile.ref).teacher = newFile.teacher;
            dispatch(updateDocSuccess(libraryList.sort((a, b) => {
                if ( a.name < b.name ) {
                    return -1;
                }
                if ( a.name > b.name ) {
                    return 1;
                }
                return 0;
            })));
        });
    };
}

export const updateDocBegin = () => {
    return {
        type: UPDATE_DOC_BEGIN
    }
};
export const updateDocSuccess = libraryList => {
    return {
        type: UPDATE_DOC_SUCCESS,
        payload: { libraryList }
    }
};

export const DOWNLOAD_DOC_BEGIN = 'DOWNLOAD_DOC_BEGIN';
export const DOWNLOAD_DOC_SUCCESS = 'DOWNLOAD_DOC_SUCCESS';

export function downloadDoc(ref) {
    return dispatch => {
        dispatch(downloadDocBegin());
        storageRef.child('library/' + ref).getDownloadURL().then((url) => {
            const a = window.document.createElement("a");
            a.target = '_blank';
            a.href = url;

            const e = window.document.createEvent("MouseEvents");
            e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
            dispatch(downloadDocSuccess());
        });
    }
}

export const downloadDocBegin = () => {
    return {
        type: DOWNLOAD_DOC_BEGIN
    }
};

export const downloadDocSuccess = () => {
    return {
        type: DOWNLOAD_DOC_SUCCESS
    }
};
