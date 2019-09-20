import firebase from "../../db/firestore";

const db = firebase.firestore();

const notificationsCollection = db.collection('notifications');
const notificationsList = localStorage.getItem('notifications') ? JSON.parse(localStorage.getItem('notifications')) : {};

export function fetchNotifications() {
    if ( !notificationsList.length ) {
        return dispatch => {
            dispatch(fetchNotificationsBegin());
            return notificationsCollection.get().then(snapshot => {
                snapshot.docs.forEach(doc => {
                    notificationsList[doc.id] = doc.data();
                });
                dispatch(fetchNotificationsSuccess(notificationsList));
            });

        }
    }
    else {
        return dispatch => {
            dispatch(fetchNotificationsSuccess(notificationsList))
        }
    }
}

export function updateNotification(type, newNotification) {
    const notificationRef = db.collection('notifications').doc(type);

    return dispatch => {
        dispatch(fetchNotificationsBegin());
        return notificationRef.set({
            ...newNotification
        }).then(() => {
            notificationsList[type] = newNotification;
            dispatch(fetchNotificationsSuccess(notificationsList));
        });

    }
}

export const NOTIFICATIONS_BEGIN = 'NOTIFICATIONS_BEGIN';
export const NOTIFICATIONS_SUCCESS = 'NOTIFICATIONS_SUCCESS';

export const fetchNotificationsBegin =() => {
    return {
        type: NOTIFICATIONS_BEGIN
    }
};
export const fetchNotificationsSuccess = notificationsList => {
    return {
        type: NOTIFICATIONS_SUCCESS,
        payload: { notificationsList }
    }
};
