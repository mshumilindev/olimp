import firebase from "../../db/firestore";

const db = firebase.firestore();

export function fetchTests(userID) {
    let testsRef = db.collection('tests');
    let unsubscribe = null;

    if ( userID ) {
        testsRef = testsRef.where('userID', '==', userID);
    }

    return dispatch => {
      dispatch(testsBegin());
      if ( unsubscribe ) {
          unsubscribe();
      }
      unsubscribe = testsRef.onSnapshot(snapshot => {
        const tests = [...snapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id
          }
        })];

        dispatch(testsSuccess(tests));
      });
    }
}

export function updateTest(newTest) {
    const id = newTest.lesson.subjectID + '_' + newTest.lesson.courseID + '_' + newTest.lesson.moduleID + '_' + newTest.lesson.lessonID + '_' + newTest.userID;

    return dispatch => {
        dispatch(testsBegin());
        const testItemRef = db.collection('tests').doc(id);

        testItemRef.set({
            ...newTest
        }, { merge: true });
    }
}

export function deleteTest(testID) {
    const testItemRef = db.collection('tests').doc(testID);

    return dispatch => {
        return testItemRef.delete();
    }
}

export function deleteTests(testIDs) {
  const batch = db.batch();

  return dispatch => {
    testIDs.forEach((id) => {
      batch.delete(db.collection('tests').doc(id))
    });
    batch.commit();
  }
}

export const TESTS_BEGIN = 'TESTS_BEGIN';
export const TESTS_SUCCESS = 'TESTS_SUCCESS';

export const testsBegin = () => {
    return {
        type: TESTS_BEGIN
    }
};
export const testsSuccess = tests => {
    return {
        type: TESTS_SUCCESS,
        payload: { tests }
    }
};
