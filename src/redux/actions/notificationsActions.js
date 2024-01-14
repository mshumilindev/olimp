import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../db/firestore";

export function fetchNotifications(userID) {
  let notificationsCollection = collection(db, "notifications");
  let unsubscribe = null;

  if (userID) {
    notificationsCollection = query(
      collection(db, "notifications"),
      where("targetUsers", "array-contains", userID),
    );
  }

  return (dispatch) => {
    dispatch(fetchNotificationsBegin());
    if (unsubscribe) {
      unsubscribe();
    }
    unsubscribe = onSnapshot(notificationsCollection, (snapshot) => {
      const notificationsList = [];

      snapshot.docs.forEach((doc) => {
        notificationsList.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      dispatch(fetchNotificationsSuccess(notificationsList));
    });
  };
}

export function updateNotification(newNotification) {
  const notificationRef = doc(db, "notifications", newNotification.id);

  return (dispatch) => {
    dispatch(fetchNotificationsBegin());
    return setDoc(
      notificationRef,
      {
        ...newNotification,
      },
      { merge: true },
    );
  };
}

export function removeNotification(notificationID) {
  const notificationRef = doc(db, "notifications", notificationID);

  return (dispatch) => {
    dispatch(fetchNotificationsBegin());
    return deleteDoc(notificationRef);
  };
}

export const NOTIFICATIONS_BEGIN = "NOTIFICATIONS_BEGIN";
export const NOTIFICATIONS_SUCCESS = "NOTIFICATIONS_SUCCESS";

export const fetchNotificationsBegin = () => {
  return {
    type: NOTIFICATIONS_BEGIN,
  };
};
export const fetchNotificationsSuccess = (notificationsList) => {
  return {
    type: NOTIFICATIONS_SUCCESS,
    payload: { notificationsList },
  };
};
