import * as types from "../actions/types";

const defaultState = {
  initializing: false,
  connected: false,
  error: false,
  channel: null,
  data: []
}

const channelsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case types.INIT_CHANNEL:
      return Object.assign({}, state, {
        initializing: true,
        channel: action.channel
      });

    case types.CHANNEL_SUCCESS:
      return Object.assign({}, state, {
        initializing: false,
        connected: true
      });

    case types.CHANNEL_CLOSED:
      return Object.assign({}, state, {
        initializing: false,
        connected: false,
        error: true,
      });

    case types.CHANNEL_ERROR:
      return Object.assign({}, state, {
        initializing: false,
        connected: false,
        error: true,
      });

    case types.RECEIVED_DATA:
      return Object.assign({}, state, {
        data: [...state.data, action.data]
      });

    default:
      return state;
  }
};

export default channelsReducer;
