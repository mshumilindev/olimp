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
                data.docs.forEach(doc => {
                    const docData = doc.data();

                    Object.assign(docData, {
                        id: doc.id
                    });

                    usersList.push(docData);
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

export const fetchUsersBegin = () => {
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

export const FETCH_PROFILE_BEGIN = 'FETCH_PROFILE_BEGIN';
export const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS';

export function fetchProfile(profileLogin) {
    const profileRef = db.collection('users').where('login', '==', profileLogin);

    return dispatch => {
        dispatch(fetchProfileBegin());
        return profileRef.get().then(snapshot => {
            const profile = {
                ...snapshot.docs[0].data(),
                id: snapshot.docs[0].id
            };

            dispatch(fetchProfileSuccess(profile));
        });
    }
}

export const fetchProfileBegin = () => {
    return {
        type: FETCH_PROFILE_BEGIN
    }
};
export const fetchProfileSuccess = profile => {
    return {
        type: FETCH_PROFILE_SUCCESS,
        payload: { profile }
    }
};

export const UPDATE_USER_BEGIN = 'UPDATE_USER_BEGIN';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';

export function updateUser(id, updatedFields) {
    const userDoc = db.collection('users').doc(id);

    return dispatch => {
        dispatch(updateUserBegin());
        return userDoc.set({
            ...updatedFields
        }).then(() => {
            return usersCollection.get().then((data) => {
                usersList.splice(0, usersList.length);
                data.docs.forEach(doc => {
                    const docData = doc.data();

                    Object.assign(docData, {
                        id: doc.id
                    });

                    usersList.push(docData);
                });
                dispatch(updateUserSuccess());
            });
        });
    }
}

export const updateUserBegin = () => {
    return {
        type: UPDATE_USER_BEGIN
    }
};
export const updateUserSuccess = usersList => {
    return {
        type: UPDATE_USER_SUCCESS,
        payload: { usersList }
    }
};

export const DELETE_USER_BEGIN = 'DELETE_USER_BEGIN';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';

export function deleteUser(id) {
    const userDoc = db.collection('users').doc(id);

    return dispatch => {
        dispatch(deleteUserBegin());
        return userDoc.delete().then(() => {
            return usersCollection.get().then((data) => {
                usersList.splice(0, usersList.length);
                data.docs.forEach(doc => {
                    const docData = doc.data();

                    Object.assign(docData, {
                        id: doc.id
                    });

                    usersList.push(docData);
                });
                dispatch(deleteUserSuccess());
            });
        });
    }
}

export const deleteUserBegin = () => {
    return {
        type: DELETE_USER_BEGIN
    }
};
export const deleteUserSuccess = usersList => {
    return {
        type: DELETE_USER_SUCCESS,
        payload: { usersList }
    }
};
