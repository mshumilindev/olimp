import firebase from "../../db/firestore";

const db = firebase.firestore();
const usersCollection = db.collection('users');
const usersList = [];

export const FETCH_USERS_BEGIN = 'FETCH_USERS_BEGIN';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';

export function fetchUsers() {
    if ( !usersList.length ) {
        return dispatch => {
            dispatch(fetchUsersBegin());
            return usersCollection.get().then((data) => {
                data.docs.map(doc => {
                    const docData = doc.data();
                    usersList.push({
                        name: docData.name,
                        role: docData.role,
                        data: docData.data,
                        status: docData.status
                    });
                });
                dispatch(fetchUsersSuccess(usersList));
            });
        }
    }
    else {
        return dispatch => {
            dispatch(fetchUsersSuccess(usersList))
        }
    }
}

export const fetchUsersBegin =() => {
    return {
        type: FETCH_USERS_BEGIN
    }
};
export const fetchUsersSuccess = usersList => {
    return {
        type: FETCH_USERS_SUCCESS,
        payload: { usersList }
    }
};
