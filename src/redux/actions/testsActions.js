import { db } from "../../db/firestore";
import { collection, onSnapshot, doc, setDoc, where, query, deleteDoc, writeBatch } from "firebase/firestore"; 

export function fetchTests(userID) {
  let testsRef = collection(db, 'tests');
  let unsubscribe = null;

  if (userID) {
    testsRef = query(testsRef, where('userID', '==', userID));
  }

  return (dispatch) => {
    dispatch(testsBegin());
    if (unsubscribe) {
      unsubscribe();
    }
    unsubscribe = onSnapshot(testsRef, (snapshot) => {
      const tests = [
        ...snapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          };
        }),
      ];

      dispatch(testsSuccess(tests));
    });
  };
}

export function updateTest(newTest) {
  const id =
    newTest.lesson.subjectID +
    "_" +
    newTest.lesson.courseID +
    "_" +
    newTest.lesson.moduleID +
    "_" +
    newTest.lesson.lessonID +
    "_" +
    newTest.userID;

  return (dispatch) => {
    dispatch(testsBegin());
    const testItemRef = doc(db, 'tests', id);

    setDoc(
      testItemRef,
      {
        ...newTest,
      },
      { merge: true },
    );
  };
}

export function deleteTest(testID) {
  const testItemRef = doc(db, 'tests', testID);

  return () => {
    return deleteDoc(testItemRef);
  };
}

export function deleteTests(testIDs) {
  const batch = writeBatch(db);

  return () => {
    testIDs.forEach((id) => {
      batch.delete(collection(db, "tests").doc(id));
    });
    batch.commit();
  };
}

export const TESTS_BEGIN = "TESTS_BEGIN";
export const TESTS_SUCCESS = "TESTS_SUCCESS";

export const testsBegin = () => {
  return {
    type: TESTS_BEGIN,
  };
};
export const testsSuccess = (tests) => {
  return {
    type: TESTS_SUCCESS,
    payload: { tests },
  };
};
