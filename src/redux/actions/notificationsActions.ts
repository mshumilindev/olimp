import { TNotification } from "@types";
import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  onSnapshot,
  Query,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { Dispatch, Unsubscribe } from "redux";
import { db } from "../../db/firestore";

export const fetchNotifications = (userID: string) => {
  let notificationsCollection: CollectionReference | Query = collection(db, "notifications");
  let unsubscribe: Unsubscribe | null = null;

  if (userID) {
    notificationsCollection = query(
      collection(db, "notifications"),
      where("targetUsers", "array-contains", userID),
    );
  }

  return (dispatch: Dispatch) => {
    dispatch(fetchNotificationsBegin());
    if (unsubscribe) {
      unsubscribe();
    }
    unsubscribe = onSnapshot(notificationsCollection, (snapshot) => {
      const notificationsList: TNotification[] = [];

      snapshot.docs.forEach((doc) => {
        notificationsList.push({
          ...doc.data() as Omit<TNotification, 'id'>,
          id: doc.id,
        });
      });
      console.log(notificationsList)
      dispatch(fetchNotificationsSuccess(notificationsList));
    });
  };
}

export const updateNotification = (newNotification: TNotification) => {
  const notificationRef = doc(db, "notifications", newNotification.id);

  return (dispatch: Dispatch) => {
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

export function removeNotification(notificationID: string) {
  const notificationRef = doc(db, "notifications", notificationID);

  return (dispatch: Dispatch) => {
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
export const fetchNotificationsSuccess = (notificationsList: TNotification[]) => {
  return {
    type: NOTIFICATIONS_SUCCESS,
    payload: { notificationsList },
  };
};
