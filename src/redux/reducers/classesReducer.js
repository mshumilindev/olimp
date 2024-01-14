import {
  CLASSES_BEGIN,
  CLASSES_SUCCESS,
  CLASS_BEGIN,
  CLASS_SUCCESS,
  DISCARD_CLASS,
} from "../actions/classesActions";

const initialState = {
  classesList: null,
  loading: false,
};

export default function handleStaticInfo(state = initialState, action) {
  switch (action.type) {
    case CLASSES_BEGIN:
      return Object.assign(
        {},
        {
          ...state,
          loading: true,
        },
      );

    case CLASSES_SUCCESS:
      return Object.assign(
        {},
        {
          ...state,
          loading: false,
          classesList: action.payload.classesList,
        },
      );

    case CLASS_BEGIN:
      return Object.assign(
        {},
        {
          ...state,
          loading: true,
        },
      );

    case CLASS_SUCCESS:
      return Object.assign(
        {},
        {
          ...state,
          loading: false,
          classData: action.payload.classData,
        },
      );

    case DISCARD_CLASS:
      return Object.assign(
        {},
        {
          ...state,
          loading: false,
          classData: null,
        },
      );

    default:
      return state;
  }
}
