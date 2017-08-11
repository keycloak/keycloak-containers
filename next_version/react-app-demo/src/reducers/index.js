import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";
import channels from "./channels"
import keycloak from "./keycloak";

const state = combineReducers({
  routing: routerReducer,
  channels,
  keycloak
});

export default state;
