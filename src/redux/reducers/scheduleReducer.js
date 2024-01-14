import {
  FETCH_LEVEL_COURSES_BEGIN,
  FETCH_LEVEL_COURSES_SUCCESS,
  FETCH_SCHEDULE_BEGIN,
  FETCH_SCHEDULE_SUCCESS,
  FETCH_COURSES_BEGIN,
  FETCH_COURSES_SUCCESS,
  SAVE_COURSE_BEGIN,
  SAVE_COURSE_SUCCESS,
  FETCH_CALENDAR_BEGIN,
  FETCH_CALENDAR_SUCCESS,
} from "../actions/scheduleActions";

const initialState = {
  scheduleList: [],
  levelCoursesList: [],
  coursesList: [],
  calendar: {},
  loading: false,
};

export default function scheduleReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SCHEDULE_BEGIN:
      return {
        ...state,
        loading: true,
      };

    case FETCH_SCHEDULE_SUCCESS:
      return {
        ...state,
        loading: false,
        scheduleList: action.payload.scheduleList,
      };

    case FETCH_LEVEL_COURSES_BEGIN:
      return {
        ...state,
        loading: true,
      };

    case FETCH_LEVEL_COURSES_SUCCESS:
      return {
        ...state,
        loading: false,
        levelCoursesList: action.payload.levelCoursesList,
      };

    case FETCH_COURSES_BEGIN:
      return {
        ...state,
        loading: true,
      };

    case FETCH_COURSES_SUCCESS:
      return {
        ...state,
        loading: false,
        coursesList: action.payload.coursesList,
      };

    case SAVE_COURSE_BEGIN:
      return {
        ...state,
        loading: true,
      };

    case SAVE_COURSE_SUCCESS:
      return {
        ...state,
        loading: false,
        coursesList: action.payload.coursesList,
      };

    case FETCH_CALENDAR_BEGIN:
      return {
        ...state,
        loading: true,
      };

    case FETCH_CALENDAR_SUCCESS:
      return {
        ...state,
        loading: false,
        calendar: action.payload.calendar,
      };

    default:
      return state;
  }
}
