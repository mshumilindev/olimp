import firebase from "../../db/firestore";
import moment from 'moment';

const db = firebase.firestore();
const events = [];

export const FETCH_EVENTS_BEGIN = 'FETCH_EVENTS_BEGIN';
export const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS';

export function fetchEvents() {
    return dispatch => {
        const eventsCollection = db.collection('events').orderBy('datetime');

        dispatch(fetchEventsBegin());
        return eventsCollection.onSnapshot({ includeMetadataChanges: true }, snapshot => {
            events.all = [];
            snapshot.docs.forEach(doc => {
                events.all.push({
                    ...doc.data(),
                    id: doc.id
                });
            });
            dispatch(fetchEventsSuccess(Object.assign({}, events)));
        });
    }
}

export function fetchEventsOrganizer(userID) {
    return dispatch => {
        const eventsCollection = db.collection('events').where('organizer', '==', userID);

        dispatch(fetchEventsBegin());
        return eventsCollection.onSnapshot({ includeMetadataChanges: true }, snapshot => {
            events.organizer = [];
            snapshot.docs.forEach(doc => {
                events.organizer.push({
                    ...doc.data(),
                    id: doc.id
                });
            });
            dispatch(fetchEventsSuccess(Object.assign({}, events)));
        });
    }
}

export function fetchEventsParticipant(userID, date) {
    return dispatch => {
        let eventsCollection = db.collection('events').where('participants', 'array-contains', userID);

        if ( date ) {
            eventsCollection = eventsCollection.where('datetime', '>=', date);
        }

        dispatch(fetchEventsBegin());
        return eventsCollection.onSnapshot({ includeMetadataChanges: true }, snapshot => {
            events.participant = [];

            snapshot.docs.forEach(doc => {
                events.participant.push({
                    ...doc.data(),
                    id: doc.id
                });
            });
            dispatch(fetchEventsSuccess(Object.assign({}, events)));
        });
    }
}

export const fetchEventsBegin = () => {
    return {
        type: FETCH_EVENTS_BEGIN
    }
};
export const fetchEventsSuccess = events => {
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
    const eventRef = db.collection('events').doc(chatID);

    return dispatch => {
        dispatch(fetchChatBegin());

        eventRef.onSnapshot({ includeMetadataChanges: true }, doc => {
            if ( !doc.exists ) {
                dispatch(fetchChatError('videochat_does_not_exist'));
            }
            else {
                const currentChat = doc.data();

                // === Check for time
                if ( false ) {
                    return dispatch(fetchChatError('wrong_time_for_chat'));
                }
                if ( currentChat.organizer !== userID && currentChat.participants.indexOf(userID) === -1 ) {
                    return dispatch(fetchChatError('user_not_allowed_to_chat'));
                }
                return dispatch(fetchChatSuccess(currentChat));
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
export function setChatStart(chatID, isStarted) {
    const chatRef = db.collection('events').doc(chatID);

    return dispatch => {
        return chatRef.set({
            started: isStarted ? moment().unix() : null
        }, { merge: true });
    }
}

export function setStopChat(chatID) {
    const chatRef = db.collection('events').doc(chatID);

    return dispatch => {
        return chatRef.set({
            started: false,
            chalkBoardOpen: false
        }, {merge: true});
    };
}

export function discardChat() {
    return dispatch => {
        return dispatch(fetchChatSuccess(null));
    }
}

export function setOnACall(value) {
    return dispatch => {
        return dispatch(setOnACallSuccess(value));
    }
}

export function sendChalkBoard(chatID, value) {
    return dispatch => {
        const chatRef = db.collection('events').doc(chatID);

        return chatRef.set({
            chalkBoard: value
        }, {merge: true});
    }
}

export function toggleChalkBoard(chatID, value) {
    return dispatch => {
        const chatRef = db.collection('events').doc(chatID);

        return chatRef.set({
            chalkBoardOpen: value
        }, {merge: true});
    }
}

export function toggleLesson(chatID, value) {
    return dispatch => {
        const chatRef = db.collection('events').doc(chatID);

        return chatRef.set({
            lessonOpen: value
        }, {merge: true});
    }
}

export const SET_ON_A_CALL_SUCCESS = 'SET_ON_A_CALL_SUCCESS';

export const setOnACallSuccess = value => {
    return {
        type: SET_ON_A_CALL_SUCCESS,
        payload: { value }
    }
};

export function deleteEvent(eventID) {
    const chatRef = db.collection('events').doc(eventID);

    return dispatch => {
        return chatRef.delete();
    }
}

export function updateEvent(eventID, newEvent) {
    const chatRef = db.collection('events').doc(eventID);

    return dispatch => {
        return chatRef.set({
            ...newEvent
        }, {merge: true});
    }
}
