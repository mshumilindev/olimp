import {
  NOTIFICATIONS_BEGIN,
  NOTIFICATIONS_SUCCESS,
} from "../actions/notificationsActions";

const initialState = {
  notificationsList: null,
  loading: false,
};

export default function configReducer(state = initialState, action) {
  switch (action.type) {
    case NOTIFICATIONS_BEGIN:
      return Object.assign(
        {},
        {
          ...state,
          loading: true,
        },
      );

    case NOTIFICATIONS_SUCCESS:
      return Object.assign(
        {},
        {
          ...state,
          loading: false,
          notificationsList: action.payload.notificationsList,
        },
      );

    default:
      return state;
  }
}
