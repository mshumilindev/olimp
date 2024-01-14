import {
  FETCH_LESSON_META_BEGIN,
  FETCH_LESSON_META_SUCCESS,
  FETCH_LESSON_CONTENT_BEGIN,
  FETCH_LESSON_CONTENT_SUCCESS,
  FETCH_LESSON_QA_BEGIN,
  FETCH_LESSON_QA_SUCCESS,
} from "../actions/lessonActions";

const initialState = {
  loading: false,
  contentLoading: false,
  QALoading: false,
  lessonMeta: null,
  lessonContent: null,
  lessonQA: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_LESSON_META_BEGIN:
      return Object.assign(
        {},
        {
          ...state,
          loading: true,
        },
      );

    case FETCH_LESSON_META_SUCCESS:
      return Object.assign(
        {},
        {
          ...state,
          loading: false,
          lessonMeta: action.payload.lessonMeta,
        },
      );

    case FETCH_LESSON_CONTENT_BEGIN:
      return Object.assign(
        {},
        {
          ...state,
          contentLoading: true,
        },
      );

    case FETCH_LESSON_CONTENT_SUCCESS:
      return Object.assign(
        {},
        {
          ...state,
          contentLoading: false,
          lessonContent: action.payload.lessonContent,
        },
      );

    case FETCH_LESSON_QA_BEGIN:
      return Object.assign(
        {},
        {
          ...state,
          QALoading: true,
        },
      );

    case FETCH_LESSON_QA_SUCCESS:
      return Object.assign(
        {},
        {
          ...state,
          QALoading: false,
          lessonQA: action.payload.lessonQA,
        },
      );

    default:
      return state;
  }
}
