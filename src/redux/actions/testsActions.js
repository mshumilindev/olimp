import firebase from "../../db/firestore";

const db = firebase.firestore();
const testsRef = db.collection('tests');

export function fetchTests() {
    return dispatch => {
        dispatch(testsBegin());
        testsRef.onSnapshot(snapshot => {
            const tests = [];

            snapshot.docs.forEach(doc => {
                tests.push({
                    ...doc.data(),
                    id: doc.id
                });
            });

            dispatch(testsSuccess(tests));
        });
    }
}

export function updateTest(newTest) {
    const id = newTest.lesson.lessonID + '_' + newTest.userID;

    return dispatch => {
        const testItemRef = db.collection('tests').doc(id);

        testItemRef.set({
            ...newTest
        }, { merge: true });
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
