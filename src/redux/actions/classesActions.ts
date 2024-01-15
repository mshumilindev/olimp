import { TClass } from "@types";
import {
  collection,
  onSnapshot,
  doc,
  getDocs,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { Dispatch, Unsubscribe } from "redux";
import { db } from "../../db/firestore";

const classesCollection = collection(db, "classes");
let classesList: TClass[] = [];

export function fetchClasses() {
  let unsubscribe: Unsubscribe | null = null;
  if (!classesList.length) {
    return (dispatch: Dispatch) => {
      dispatch(classesBegin());
      if (unsubscribe) {
        unsubscribe();
      }
      unsubscribe = onSnapshot(classesCollection, (snapshot) => {
        classesList = snapshot.docs.map((doc) => {
          return {
            ...doc.data() as Omit<TClass, 'id'>,
            id: doc.id,
          };
        });
        dispatch(classesSuccess(classesList));
      });
    };
  } else {
    return (dispatch: Dispatch) => {
      dispatch(classesSuccess(classesList));
    };
  }
}

export function removeClass(classID: string) {
  const classRef = doc(db, "classes", classID);

  return (dispatch: Dispatch) => {
    dispatch(classesBegin());
    return deleteDoc(classRef).then(() => {
      return getDocs(classesCollection).then((snapshot) => {
        classesList.splice(0, classesList.length);
        snapshot.docs.map((doc) => {
          return classesList.push({
            ...doc.data() as Omit<TClass, 'id'>,
            id: doc.id,
          });
        });
        dispatch(classesSuccess(classesList));
      });
    });
  };
}

export function createClass(classID: string, classData: TClass) {
  const classRef = doc(db, "classes", classID);

  delete classData.id;

  return (dispatch: Dispatch) => {
    dispatch(classesBegin());
    return setDoc(classRef, {
        ...classData,
      })
      .then(() => {
        return getDocs(classesCollection).then((snapshot) => {
          classesList.splice(0, classesList.length);
          snapshot.docs.map((doc) => {
            return classesList.push({
              ...doc.data() as Omit<TClass, 'id'>,
              id: doc.id,
            });
          });
          dispatch(classesSuccess(classesList));
        });
      });
  };
}

export function updateClass(classID: string, classData: TClass) {
  const classRef = doc(db, "classes", classID);

  return (dispatch: Dispatch) => {
    dispatch(classBegin());
    return setDoc(classRef, {
      ...classData,
    });
  };
}

export function fetchClass(classID: string) {
  const docRef = doc(db, "classes", classID);
  let unsubscribe: Unsubscribe | null = null;

  return (dispatch: Dispatch) => {
    dispatch(classBegin());
    if (unsubscribe) {
      unsubscribe();
    }
    unsubscribe = onSnapshot(docRef, (snapshot) => {
      dispatch(
        classSuccess({
          ...snapshot.data() as Omit<TClass, 'id'>,
          id: snapshot.id,
        }),
      );
    });
  };
}

export function discardClass() {
  return (dispatch: Dispatch) => {
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
export const classesSuccess = (classesList: TClass[]) => {
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
export const classSuccess = (classData: TClass) => {
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
