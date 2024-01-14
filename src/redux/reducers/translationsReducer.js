import {
  FETCH_TRANSLATIONS_BEGIN,
  FETCH_TRANSLATIONS_SUCCESS,
  UPDATE_TRANSLATION_BEGIN,
  UPDATE_TRANSLATION_SUCCESS,
} from "../actions/translationsActions";

const initialState = {
  translationsList: [],
  loading: false,
};

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_TRANSLATIONS_BEGIN:
      return {
        ...state,
        loading: true,
      };

    case FETCH_TRANSLATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        translationsList: action.payload.translationsList,
      };

    case UPDATE_TRANSLATION_BEGIN:
      return {
        ...state,
        loading: true,
      };

    case UPDATE_TRANSLATION_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
