import firebase from "../../db/firestore";

const db = firebase.firestore();
const contactCollection = db.collection('contact');
const newContact = [];

export const FETCH_CONTACT_BEGIN = 'FETCH_CONTACT_BEGIN';
export const FETCH_CONTACT_SUCCESS = 'FETCH_CONTACT_SUCCESS';

export function fetchContact() {
    if ( !newContact.length ) {
        return dispatch => {
            dispatch(fetchContactBegin());
            return contactCollection.get().then((data) => {
                data.docs.map(doc => newContact.push(doc.data()));

                dispatch(fetchContactSuccess(newContact));
            });
        }
    }
    else {
        return dispatch => {
            dispatch(fetchContactSuccess(newContact))
        }
    }
}

export const fetchContactBegin =() => {
    return {
        type: FETCH_CONTACT_BEGIN
    }
};
export const fetchContactSuccess = contactList => {
    return {
        type: FETCH_CONTACT_SUCCESS,
        payload: { contactList }
    }
};
