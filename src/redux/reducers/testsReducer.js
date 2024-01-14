import { TESTS_BEGIN, TESTS_SUCCESS } from "../actions/testsActions";

const initialState = {
  loading: false,
  tests: null,
};

export default function handleTests(state = initialState, action) {
  switch (action.type) {
    case TESTS_BEGIN:
      return Object.assign(
        {},
        {
          ...state,
          loading: true,
        },
      );

    case TESTS_SUCCESS:
      return Object.assign(
        {},
        {
          ...state,
          loading: false,
          tests: action.payload.tests,
        },
      );

    default:
      return state;
  }
}
