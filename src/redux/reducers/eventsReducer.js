import {
  FETCH_EVENTS_BEGIN,
  FETCH_EVENTS_SUCCESS,
  FETCH_CHAT_BEGIN,
  FETCH_CHAT_SUCCESS,
  FETCH_CHAT_ERROR,
  SET_ON_A_CALL_SUCCESS,
} from "../actions/eventsActions";

const initialState = {
  events: [],
  loading: false,
  chat: null,
  activeUsers: null,
  chatError: null,
  onACall: false,
};

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_EVENTS_BEGIN:
      return {
        ...state,
        loading: true,
      };

    case FETCH_EVENTS_SUCCESS:
      return Object.assign(
        {},
        {
          ...state,
          loading: false,
          events: action.payload.events,
        },
      );

    case FETCH_CHAT_BEGIN:
      return Object.assign(
        {},
        {
          ...state,
          loading: false,
        },
      );

    case FETCH_CHAT_SUCCESS:
      return Object.assign(
        {},
        {
          ...state,
          loading: false,
          chat: action.payload.chat,
          chatError: null,
        },
      );

    case FETCH_CHAT_ERROR:
      return Object.assign(
        {},
        {
          ...state,
          loading: false,
          chat: null,
          chatError: action.payload.chatError,
        },
      );

    case SET_ON_A_CALL_SUCCESS:
      return Object.assign(
        {},
        {
          ...state,
          onACall: action.payload.value,
        },
      );

    default:
      return state;
  }
}
