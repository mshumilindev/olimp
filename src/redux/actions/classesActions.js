import {
  collection,
  onSnapshot,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../db/firestore";

const classesCollection = collection(db, "classes");
let classesList = [];

export function fetchClasses() {
  let unsubscribe = null;
  if (!classesList.length) {
    return (dispatch) => {
      dispatch(classesBegin());
      if (unsubscribe) {
        unsubscribe();
      }
      unsubscribe = onSnapshot(classesCollection, (snapshot) => {
        classesList = snapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          };
        });
        dispatch(classesSuccess(classesList));
      });
    };
  } else {
    return (dispatch) => {
      dispatch(classesSuccess(classesList));
    };
  }
}

export function removeClass(classID) {
  const classRef = doc(db, "classes", classID);

  return (dispatch) => {
    dispatch(classesBegin());
    return deleteDoc(classRef).then(() => {
      return getDocs(classesCollection).then((snapshot) => {
        classesList.splice(0, classesList.length);
        snapshot.docs.map((doc) => {
          return classesList.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        dispatch(classesSuccess(classesList));
      });
    });
  };
}

export function createClass(classID, classData) {
  const classRef = doc(db, "classes", classID);

  delete classData.id;

  return (dispatch) => {
    dispatch(classesBegin());
    return classRef
      .setDoc({
        ...classData,
      })
      .then(() => {
        return getDocs(classesCollection).then((snapshot) => {
          classesList.splice(0, classesList.length);
          snapshot.docs.map((doc) => {
            return classesList.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          dispatch(classesSuccess(classesList));
        });
      });
  };
}

export function updateClass(classID, classData) {
  const classRef = doc(db, "classes", classID);

  return (dispatch) => {
    dispatch(classBegin());
    return classRef.setDoc({
      ...classData,
    });
  };
}

export function fetchClass(classID) {
  const docRef = doc(db, "classes", classID);
  let unsubscribe;

  return (dispatch) => {
    dispatch(classBegin());
    if (unsubscribe) {
      unsubscribe();
    }
    unsubscribe = onSnapshot(docRef, (snapshot) => {
      dispatch(
        classSuccess({
          ...snapshot.data(),
          id: snapshot.id,
        }),
      );
    });
  };
}

export function discardClass() {
  return (dispatch) => {
    dispatch(discardClassSuccess());
  };
}

export const CLASSES_BEGIN = "CLASSES_BEGIN";
export const CLASSES_SUCCESS = "CLASSES_SUCCESS";
export const CLASS_BEGIN = "CLASS_BEGIN";
export const CLASS_SUCCESS = "CLASS_SUCCESS";
export const DISCARD_CLASS = "DISCARD_CLASS";

export const classesBegin = () => {
  return {
    type: CLASSES_BEGIN,
  };
};
export const classesSuccess = (classesList) => {
  return {
    type: CLASSES_SUCCESS,
    payload: { classesList },
  };
};
export const classBegin = () => {
  return {
    type: CLASS_BEGIN,
  };
};
export const classSuccess = (classData) => {
  return {
    type: CLASS_SUCCESS,
    payload: { classData },
  };
};
export const discardClassSuccess = () => {
  return {
    type: DISCARD_CLASS,
  };
};
