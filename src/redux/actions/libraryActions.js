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
            const element = document.createElement('a');
            element.setAttribute('href', url);
            element.setAttribute('target', '_blank');

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
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
