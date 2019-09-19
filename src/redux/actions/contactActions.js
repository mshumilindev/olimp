import firebase from "../../db/firestore";

const db = firebase.firestore();
const contactCollection = db.collection('contact');
const contactList = localStorage.getItem('contact') ? JSON.parse(localStorage.getItem('contact')).data : [];

export function fetchContact() {
    if ( !contactList.length ) {
        return dispatch => {
            dispatch(contactBegin());
            return contactCollection.get().then((data) => {
                contactList.splice(0, contactList.length);
                data.docs.map(doc => contactList.push({
                    ...doc.data(),
                    id: doc.id
                }));
                localStorage.setItem('contact', JSON.stringify({data: contactList}));

                dispatch(contactSuccess(contactList));
            });
        }
    }
    else {
        return dispatch => {
            dispatch(contactSuccess(contactList))
        }
    }
}

export function updateContact(newContacts) {
    const sortedList = newContacts.sort((a, b) => a.order - b.order);

    return dispatch => {
        dispatch(contactBegin());

        let i = 0;
        let x = 0;

        const removeContactItem = snapshot => {
            if ( snapshot.docs.length ) {
                const docRef = db.collection('contact').doc(snapshot.docs[i].id);

                docRef.delete().then(() => {
                    i++;

                    if ( i < snapshot.docs.length ) {
                        return removeContactItem(snapshot);
                    }
                    else {
                        return saveContactItem();
                    }
                });
            }
            else {
                return saveContactItem();
            }
        };

        const saveContactItem = () => {
            if ( sortedList.length ) {
                const currentItem = sortedList[x];
                const docRef = db.collection('contact').doc(currentItem.id);

                delete currentItem.id;

                docRef.set({
                    ...currentItem,
                    order: x
                }).then(() => {
                    x++;

                    if ( x < sortedList.length ) {
                        return saveContactItem();
                    }
                    else {
                        return redoList();
                    }
                });
            }
            else {
                return redoList();
            }
        };

        const redoList = () => {
            return contactCollection.get().then((data) => {
                contactList.splice(0, contactList.length);
                data.docs.map(doc => contactList.push({
                    ...doc.data(),
                    id: doc.id
                }));
                localStorage.setItem('contact', JSON.stringify({data: contactList}));

                dispatch(contactSuccess(contactList));
            });
        };

        return contactCollection.get().then(snapshot => {
            return removeContactItem(snapshot);
        });
    }
}

export const CONTACT_BEGIN = 'CONTACT_BEGIN';
export const CONTACT_SUCCESS = 'CONTACT_SUCCESS';

export const contactBegin =() => {
    return {
        type: CONTACT_BEGIN
    }
};
export const contactSuccess = contactList => {
    return {
        type: CONTACT_SUCCESS,
        payload: { contactList }
    }
};
