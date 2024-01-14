import { UPDATES_BEGIN, UPDATES_SUCCESS } from "../actions/updatesActions";

const initialState = {
  loading: false,
};

export default function handleStaticInfo(state = initialState, action) {
  switch (action.type) {
    case UPDATES_BEGIN:
      return {
        ...state,
        loading: true,
      };

    case UPDATES_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
