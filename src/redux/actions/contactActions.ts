import { TContact } from "@types";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  QuerySnapshot,
} from "firebase/firestore";
import { Dispatch } from "redux";
import { db } from "../../db/firestore";

const contactCollection = collection(db, "contact");
const contactList: TContact[] = [];

export function fetchContact() {
  if (!contactList.length) {
    return (dispatch: Dispatch) => {
      dispatch(contactBegin());
      return getDocs(contactCollection).then((data) => {
        contactList.splice(0, contactList.length);
        data.docs.map((doc) =>
          contactList.push({
            ...doc.data() as Omit<TContact, 'id'>,
            id: doc.id,
          }),
        );

        dispatch(contactSuccess(contactList));
      });
    };
  } else {
    return (dispatch: Dispatch) => {
      dispatch(contactSuccess(contactList));
    };
  }
}

export function updateContact(newContacts: TContact[]) {
  const sortedList = newContacts.sort((a, b) => a.order - b.order);

  return (dispatch: Dispatch) => {
    dispatch(contactBegin());

    let i = 0;
    let x = 0;

    const removeContactItem = (snapshot: QuerySnapshot) => {
      if (snapshot.docs.length) {
        const docRef = doc(db, "contact", snapshot.docs[i].id);

        deleteDoc(docRef).then(() => {
          i++;

          if (i < snapshot.docs.length) {
            return removeContactItem(snapshot);
          } else {
            return saveContactItem();
          }
        });
      } else {
        return saveContactItem();
      }
    };

    const saveContactItem = () => {
      if (sortedList.length) {
        const currentItem = sortedList[x];
        const docRef = doc(db, 'contact', currentItem.id || '');

        delete currentItem.id;

        setDoc(docRef, {
          ...currentItem,
          order: x,
        }).then(() => {
          x++;

          if (x < sortedList.length) {
            return saveContactItem();
          } else {
            return redoList();
          }
        });
      } else {
        return redoList();
      }
    };

    const redoList = () => {
      return getDocs(contactCollection).then((data) => {
        contactList.splice(0, contactList.length);
        data.docs.map((doc) =>
          contactList.push({
            ...doc.data() as Omit<TContact, 'id'>,
            id: doc.id,
          }),
        );

        dispatch(contactSuccess(contactList));
      });
    };

    return getDocs(contactCollection).then((snapshot) => {
      return removeContactItem(snapshot);
    });
  };
}

export const CONTACT_BEGIN = "CONTACT_BEGIN";
export const CONTACT_SUCCESS = "CONTACT_SUCCESS";

export const contactBegin = () => {
  return {
    type: CONTACT_BEGIN,
  };
};
export const contactSuccess = (contactList: TContact[]) => {
  return {
    type: CONTACT_SUCCESS,
    payload: { contactList },
  };
};
