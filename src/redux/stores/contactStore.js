import { createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import contactReducer from "../reducers/contactReducers";

export const contactStore = createStore(
  contactReducer,
  applyMiddleware(ReduxThunk),
);
