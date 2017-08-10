import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";
import channel from "./channels"
import keycloak from "./keycloak";

const state = combineReducers({
  routing: routerReducer,
  channel,
  keycloak
});

export default state;
