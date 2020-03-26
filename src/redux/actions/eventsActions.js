import firebase from "../../db/firestore";

const db = firebase.firestore();
const eventsCollection = db.collection('events');
const events = [];

export const FETCH_EVENTS_BEGIN = 'FETCH_EVENTS_BEGIN';
export const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS';

export function fetchEvents(userID) {
    return dispatch => {
        dispatch(fetchEventsBegin());
        return eventsCollection.onSnapshot(snapshot => {
            snapshot.docs.forEach(doc => {
                if ( !events || !events.length || !events.find(eventItem => eventItem.id === doc.id ) ) {
                    events.push({
                        ...doc.data(),
                        id: doc.id
                    });
                }
                else {
                    events[events.indexOf(events.find(eventItem => eventItem.id === doc.id ))] = {
                        ...doc.data(),
                        id: doc.id
                    };
                }
            });
            dispatch(fetchEventsSuccess(Object.assign([], events.filter(eventItem => eventItem.organizer === userID || eventItem.participants.indexOf(userID) !== -1))));
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
    return dispatch => {
        dispatch(fetchChatBegin());
        const currentChat = events.find(eventItem => eventItem.id === chatID);

        if ( !currentChat ) {
            dispatch(fetchChatError('videochat_does_not_exist'));
        }
        else {
            // === Check for time
            if ( false ) {
                return dispatch(fetchChatError('wrong_time_for_chat'));
            }
            if ( currentChat.organizer !== userID && currentChat.participants.indexOf(userID) === -1 ) {
                return dispatch(fetchChatError('user_not_allowed_to_chat'));
            }
            return dispatch(fetchChatSuccess(currentChat));
        }
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

export function removeActiveUser(chatID, newActiveUsers) {
    const chatRef = db.collection('events').doc(chatID);

    return dispatch => {
        return chatRef.set({
            activeUsers: newActiveUsers
        }, { merge: true });
    }
}

export function setChatStart(chatID, isStarted) {
    const chatRef = db.collection('events').doc(chatID);

    return dispatch => {
        return chatRef.set({
            started: isStarted
        }, { merge: true });
    }
}

export function setStopChat(chatID, activeUsers) {
    const chatRef = db.collection('events').doc(chatID);

    return dispatch => {
        return chatRef.set({
            started: false,
            activeUsers: []
        }, {merge: true});
    };
}
