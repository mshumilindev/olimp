import firebase from "../../db/firestore";

const db = firebase.firestore();

export function fetchNotifications(userID) {
    let notificationsCollection = db.collection('notifications');
    let unsubscribe = null;

    if ( userID )  {
        notificationsCollection = notificationsCollection.where('targetUsers', 'array-contains', userID);
    }

    return dispatch => {
        dispatch(fetchNotificationsBegin());
        if ( unsubscribe ) {
            unsubscribe();
        }
        unsubscribe = notificationsCollection.onSnapshot(snapshot => {
            const notificationsList = [];

            snapshot.docs.forEach(doc => {
                notificationsList.push({
                    ...doc.data(),
                    id: doc.id
                })
            });
            dispatch(fetchNotificationsSuccess(notificationsList));
        });

    }
}

export function updateNotification(newNotification) {
    const notificationRef = db.collection('notifications').doc(newNotification.id);

    return dispatch => {
        dispatch(fetchNotificationsBegin());
        return notificationRef.set({
            ...newNotification
        }, { merge: true });
    }
}

export function removeNotification(notificationID) {
    const notificationRef = db.collection('notifications').doc(notificationID);

    return dispatch => {
        dispatch(fetchNotificationsBegin());
        return notificationRef.delete();
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
