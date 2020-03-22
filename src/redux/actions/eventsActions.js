import firebase from "../../db/firestore";

const db = firebase.firestore();
const eventsCollection = db.collection('events');
const events = [];

export const FETCH_EVENTS_BEGIN = 'FETCH_EVENTS_BEGIN';
export const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS';

export function fetchEvents() {
    if ( !events.length ) {
        return dispatch => {
            dispatch(fetchEventsBegin());
            return eventsCollection.get().then((data) => {
                data.docs.forEach(doc => {
                    const docData = doc.data();

                    events.push(docData);
                });
                dispatch(fetchEventsSuccess(events));
            });
        }
    }
    else {
        return dispatch => {
            dispatch(fetchEventsSuccess(events))
        }
    }
}

export const fetchEventsBegin = () => {
    return {
        type: FETCH_EVENTS_BEGIN
    }
};
export const fetchEventsSuccess = usersList => {
    return {
        type: FETCH_EVENTS_SUCCESS,
        payload: { events }
    }
};