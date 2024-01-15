import { db, storage } from "../../db/firestore";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  listAll,
  deleteObject,
  uploadBytes,
  getDownloadURL,
  getMetadata,
} from "firebase/storage";
import { Dispatch, Unsubscribe } from "redux";
import { TTextbook, TTextbookNew } from "@types";

const storageRef = ref(storage);

export function fetchLibrary() {
  let libraryCollection = collection(db, "library");
  let unsubscribe: Unsubscribe | null = null;

  return (dispatch: Dispatch) => {
    dispatch(fetchLibraryBegin());

    if (unsubscribe) {
      unsubscribe();
    }

    unsubscribe = onSnapshot(libraryCollection, (snapshot) => {
      const libraryList: TTextbook[] = [];

      snapshot.docs.forEach((doc) => {
        libraryList.push({
          ...doc.data() as Omit<TTextbook, 'id'>,
          id: doc.id,
        });
      });
      dispatch(fetchLibrarySuccess(libraryList));
    });
  };
}

export function fetchLibraryBooks() {
  const listRef = ref(storage, "library");

  return (dispatch: Dispatch) => {
    dispatch(fetchLibraryBooksBegin());
    let libraryList = [];

    listAll(listRef).then((data) => {
      let arr: TTextbookNew[] = [];
      let arrMetadata: Pick<TTextbookNew, 'metadata'>[] = [];
      data.items.forEach((item) => {
        arr.push(getDownloadURL(item) as unknown as TTextbookNew);
        arrMetadata.push(getMetadata(item) as unknown as Pick<TTextbookNew, 'metadata'>);
      });
      Promise.all(arr).then((data) => {
        Promise.all(arrMetadata).then((metadata) => {
          libraryList = data.map((item, index) => {
            return {
              url: item,
              metadata: {
                // @ts-ignore
                name: metadata[index].name,
                // @ts-ignore
                customMetadata: metadata[index].customMetadata,
              },
            };
          });
          dispatch(fetchLibraryBooksSuccess(libraryList));
        });
      });
      // updateMetadata()
    });
  };
}

export function fetchTextbook(textbookID: string) {
  const textbookRef = doc(
    db,
    "library",
    typeof textbookID === "object" ? textbookID[0] : textbookID,
  );

  return (dispatch: Dispatch) => {
    dispatch(fetchTextbookBegin());

    return getDoc(textbookRef).then((snapshot) => {
      dispatch(
        fetchTextbookSuccess({
          ...snapshot.data() as TTextbook,
          id: snapshot.id,
        }),
      );
    });
  };
}

export function deleteDocument(docID: string, docRef: string) {
  const documentRef = ref(storage, `library/${docRef}`);
  const documentDoc = doc(db, "library", docID);

  return (dispatch: Dispatch) => {
    dispatch(deleteDocBegin());
    deleteObject(documentRef)
      .then(() => {
        return deleteDoc(documentDoc);
      })
      .catch((err) => {
        return deleteDoc(documentDoc);
      });
  };
}

export function uploadDoc(newFile: TTextbook, file: File, id: string) {
  const documentRef = ref(storage, "library/" + file.name);
  const documentDoc = doc(db, "library", id);

  return (dispatch: Dispatch) => {
    dispatch(uploadDocBegin());
    return uploadBytes(documentRef, file).then(() => {
      return setDoc(documentDoc, { ...newFile, ref: file.name });
    });
  };
}

export function updateDocument(newFile: TTextbook, id: string) {
  const documentDoc = doc(db, "library", id);
  const teacherArray = Array.isArray(newFile.teacher)
    ? newFile.teacher
    : [newFile.teacher];

  return (dispatch: Dispatch) => {
    dispatch(updateDocBegin());
    return updateDoc(documentDoc, { ...newFile, teacher: teacherArray });
  };
}

export function downloadDoc(docRef: string, isNew: boolean) {
  return (dispatch: Dispatch) => {
    dispatch(downloadDocBegin());
      getDownloadURL(ref(storageRef, `library/${docRef}`))
        .then((url) => {
          if (docRef.includes(".pdf") && !isNew) {
            dispatch(downloadDocSuccess(url));
          } else {
            const a = window.document.createElement("a");
            a.target = "_blank";
            a.href = url;

            const e = window.document.createEvent("MouseEvents");
            e.initMouseEvent(
              "click",
              true,
              true,
              window,
              0,
              0,
              0,
              0,
              0,
              false,
              false,
              false,
              false,
              0,
              null,
            );
            a.dispatchEvent(e);
            dispatch(downloadDocSuccess(url));
          }
        });
  };
}

export function discardDoc() {
  return (dispatch: Dispatch) => {
    dispatch(discardDocSuccess());
  };
}

export const FETCH_LIBRARY_BEGIN = "FETCH_LIBRARY_BEGIN";
export const FETCH_LIBRARY_SUCCESS = "FETCH_LIBRARY_SUCCESS";
export const FETCH_TEXTBOOK_BEGIN = "FETCH_TEXTBOOK_BEGIN";
export const FETCH_TEXTBOOK_SUCCESS = "FETCH_TEXTBOOK_SUCCESS";
export const UPLOAD_DOC_BEGIN = "UPLOAD_DOC_BEGIN";
export const UPDATE_DOC_BEGIN = "UPDATE_DOC_BEGIN";
export const FETCH_LIBRARY_BOOKS_BEGIN = "FETCH_LIBRARY_BOOKS_BEGIN";
export const FETCH_LIBRARY_BOOKS_SUCCESS = "FETCH_LIBRARY_BOOKS_SUCCESS";
export const DELETE_DOC_BEGIN = "DELETE_DOC_BEGIN";
export const DOWNLOAD_DOC_BEGIN = "DOWNLOAD_DOC_BEGIN";
export const DOWNLOAD_DOC_SUCCESS = "DOWNLOAD_DOC_SUCCESS";
export const DISCARD_DOC_SUCCESS = "DISCARD_DOC_SUCCESS";

export const fetchTextbookBegin = () => {
  return {
    type: FETCH_TEXTBOOK_BEGIN,
  };
};
export const fetchTextbookSuccess = (textbook: TTextbook) => {
  return {
    type: FETCH_TEXTBOOK_SUCCESS,
    payload: { textbook },
  };
};

export const fetchLibraryBegin = () => {
  return {
    type: FETCH_LIBRARY_BEGIN,
  };
};
export const fetchLibrarySuccess = (libraryList: TTextbook[]) => {
  return {
    type: FETCH_LIBRARY_SUCCESS,
    payload: { libraryList },
  };
};

export const fetchLibraryBooksBegin = () => {
  return {
    type: FETCH_LIBRARY_BOOKS_BEGIN,
  };
};
export const fetchLibraryBooksSuccess = (booksList: TTextbookNew[]) => {
  return {
    type: FETCH_LIBRARY_BOOKS_SUCCESS,
    payload: { booksList },
  };
};

export const deleteDocBegin = () => {
  return {
    type: DELETE_DOC_BEGIN,
  };
};

export const uploadDocBegin = () => {
  return {
    type: UPLOAD_DOC_BEGIN,
  };
};

export const updateDocBegin = () => {
  return {
    type: UPDATE_DOC_BEGIN,
  };
};

export const downloadDocBegin = () => {
  return {
    type: DOWNLOAD_DOC_BEGIN,
  };
};

export const downloadDocSuccess = (downloadedTextbook: string) => {
  return {
    type: DOWNLOAD_DOC_SUCCESS,
    payload: { downloadedTextbook },
  };
};

export const discardDocSuccess = () => {
  return {
    type: DISCARD_DOC_SUCCESS,
  };
};
