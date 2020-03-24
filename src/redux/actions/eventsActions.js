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

// === CHAT
export const FETCH_CHAT_BEGIN = 'FETCH_CHAT_BEGIN';
export const FETCH_CHAT_SUCCESS = 'FETCH_CHAT_SUCCESS';
export const FETCH_CHAT_ERROR = 'FETCH_CHAT_ERROR';

export function fetchChat(chatID, userID) {
    const chatRef = db.collection('events').doc(chatID);

    return dispatch => {
        dispatch(fetchChatBegin());
        return chatRef.onSnapshot(doc => {
            if ( !doc.exists ) {
                dispatch(fetchChatError('videochat_does_not_exist'));
            }
            else {
                const chat = doc.data();

                if ( chat.organizer !== userID && chat.participants.indexOf(userID) === -1 ) {
                    return dispatch(fetchChatError('user_not_allowed_to_chat'));
                }
                // === Check for time
                if ( false ) {
                    return dispatch(fetchChatError('wrong_time_for_chat'));
                }

                return dispatch(fetchChatSuccess({
                    ...doc.data(),
                    id: doc.id
                }));
            }
        });
    }
}

export const fetchChatBegin = () => {
    return {
        type: FETCH_CHAT_BEGIN
    }
};
export const fetchChatError = chatError => {
    return {
        type: FETCH_CHAT_ERROR,
        payload: { chatError }
    }
};
export const fetchChatSuccess = chat => {
    return {
        type: FETCH_CHAT_SUCCESS,
        payload: { chat }
    }
};

// === CHAT
export function setActiveUser(chatID, newActiveUsers) {
    const chatRef = db.collection('events').doc(chatID);

    return dispatch => {
        return chatRef.set({
            activeUsers: newActiveUsers
        }, { merge: true });
    }
}
