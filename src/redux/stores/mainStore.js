import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import index from "../reducers/index";

export const mainStore = createStore(index, applyMiddleware(thunk));
