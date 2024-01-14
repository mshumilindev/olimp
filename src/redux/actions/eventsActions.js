import { db } from "../../db/firestore";
import moment from "moment";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc, where, writeBatch } from "firebase/firestore"; 

const events = [];

export const FETCH_EVENTS_BEGIN = "FETCH_EVENTS_BEGIN";
export const FETCH_EVENTS_SUCCESS = "FETCH_EVENTS_SUCCESS";

export function fetchEvents() {
  let unsubscribe = null;
  const batch = writeBatch(db);

  return (dispatch) => {
    const eventsCollection = query(collection(db, 'events'), orderBy('datetime'));

    dispatch(fetchEventsBegin());
    if (unsubscribe) {
      unsubscribe();
    }
    unsubscribe = onSnapshot(eventsCollection, (snapshot) => {
      events.all = snapshot.docs
        .filter((doc) => {
          const chatDate = moment(doc.data().datetime * 1000)
            .startOf("day")
            .unix();
          const dateNow = moment().startOf("day").unix();
          if (dateNow - chatDate > 604800) {
            batch.delete(collection(db, "events").doc(doc.id));
          } else {
            return true;
          }
        })
        .map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          };
        });
      batch.commit();
      dispatch(fetchEventsSuccess(events));
    });
  };
}

export function fetchEventsOrganizer(userID) {
  let unsubscribe = null;

  return (dispatch) => {
    const eventsCollectionQuery = query(collection(db, "events"), where("organizer", "==", userID));

    dispatch(fetchEventsBegin());
    if (unsubscribe) {
      unsubscribe();
    }
    unsubscribe = onSnapshot(eventsCollectionQuery, (snapshot) => {
      events.organizer = [];
      snapshot.docs.forEach((doc) => {
        events.organizer.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      dispatch(fetchEventsSuccess(Object.assign({}, events)));
    });
  };
}

export function fetchEventsParticipant(userID, date) {
  let unsubscribe = null;

  return (dispatch) => {
    let eventsCollection = date ? query(collection(db, 'events'), where('participants', 'array-contains', userID)) : query(collection(db, 'events'), where('participants', 'array-contains', userID), where('datetime', '>=', date));

    dispatch(fetchEventsBegin());
    if (unsubscribe) {
      unsubscribe();
    }
    unsubscribe = onSnapshot(eventsCollection, (snapshot) => {
      events.participant = [];

      snapshot.docs.forEach((doc) => {
        events.participant.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      dispatch(fetchEventsSuccess(Object.assign({}, events)));
    });
  };
}

export const fetchEventsBegin = () => {
  return {
    type: FETCH_EVENTS_BEGIN,
  };
};
export const fetchEventsSuccess = (events) => {
  return {
    type: FETCH_EVENTS_SUCCESS,
    payload: { events },
  };
};

// === CHAT
export const FETCH_CHAT_BEGIN = "FETCH_CHAT_BEGIN";
export const FETCH_CHAT_SUCCESS = "FETCH_CHAT_SUCCESS";
export const FETCH_CHAT_ERROR = "FETCH_CHAT_ERROR";

export function fetchChat(
  chatID,
  userID,
  userRole,
  userIsManagement = "teacher",
) {
  let unsubscribe = null;
  const eventRef = doc(db, 'events', chatID);

  return (dispatch) => {
    dispatch(fetchChatBegin());

    if (unsubscribe) {
      unsubscribe();
    }

    unsubscribe = onSnapshot(eventRef, (doc) => {
      if (!doc.exists) {
        dispatch(fetchChatError("videochat_does_not_exist"));
      } else {
        const currentChat = doc.data();

        // === Check for time
        if (false) {
          return dispatch(fetchChatError("wrong_time_for_chat"));
        }
        if (userRole === "admin" || userIsManagement !== "teacher") {
          return dispatch(fetchChatSuccess(currentChat));
        }
        if (
          currentChat.organizer !== userID &&
          currentChat.participants.indexOf(userID) === -1
        ) {
          return dispatch(fetchChatError("user_not_allowed_to_chat"));
        }
        return dispatch(fetchChatSuccess(currentChat));
      }
    });
  };
}

export const fetchChatBegin = () => {
  return {
    type: FETCH_CHAT_BEGIN,
  };
};
export const fetchChatError = (chatError) => {
  return {
    type: FETCH_CHAT_ERROR,
    payload: { chatError },
  };
};
export const fetchChatSuccess = (chat) => {
  return {
    type: FETCH_CHAT_SUCCESS,
    payload: { chat },
  };
};

// === CHAT
export function setChatStart(chatID, isStarted) {
  const chatRef = doc(db, 'events', chatID);

  return () => {
    return setDoc(
      chatRef,
      {
        started: isStarted ? moment().unix() : null,
      },
      { merge: true },
    );
  };
}

export function setStopChat(chatID) {
  const chatRef = doc(db, 'events', chatID);

  return () => {
    return setDoc(
      chatRef,
      {
        started: false,
        chalkBoardOpen: false,
      },
      { merge: true },
    );
  };
}

export function discardChat() {
  return (dispatch) => {
    return dispatch(fetchChatSuccess(null));
  };
}

export function setOnACall(value) {
  return (dispatch) => {
    return dispatch(setOnACallSuccess(value));
  };
}

export function sendChalkBoard(chatID, value) {
  return (dispatch) => {
    const chatRef = doc(db, 'events', chatID);

    return setDoc(
      chatRef,
      {
        chalkBoard: value,
      },
      { merge: true },
    );
  };
}

export function toggleChalkBoard(chatID, value) {
  return () => {
    const chatRef = doc(db, 'events', chatID);

    return setDoc(
      chatRef,
      {
        chalkBoardOpen: value,
      },
      { merge: true },
    );
  };
}

export function toggleLesson(chatID, value) {
  return (dispatch) => {
    const chatRef = doc(db, 'events', chatID);

    return setDoc(
      chatRef,
      {
        lessonOpen: value,
      },
      { merge: true },
    );
  };
}

export const SET_ON_A_CALL_SUCCESS = "SET_ON_A_CALL_SUCCESS";

export const setOnACallSuccess = (value) => {
  return {
    type: SET_ON_A_CALL_SUCCESS,
    payload: { value },
  };
};

export function deleteEvent(eventID) {
  const chatRef = doc(db, 'events', eventID);

  return (dispatch) => {
    return deleteDoc(chatRef);
  };
}

export function deleteMultipleEvents() {
  const batch = writeBatch(db);
  return (dispatch) => {
    const filteredEvents = events.all.filter((ev, index) => index < 500);

    filteredEvents.forEach((ev) => {
      const eventRef = doc(db, 'events', ev.id);
      batch.delete(eventRef);
    });
    batch.commit();
  };
}

export function updateEvent(eventID, newEvent) {
  const chatRef = doc(db, 'events', eventID);

  return (dispatch) => {
    return setDoc(
      chatRef,
      {
        ...newEvent,
      },
      { merge: true },
    );
  };
}
