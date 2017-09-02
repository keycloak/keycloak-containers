import * as types from "../actions/types";

const defaultState = {
  commandChannel: null,
  resultChannel: null,
  results: []
}

const channelsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case types.INIT_CHANNEL:
      return Object.assign({}, state, {
        commandChannel: action.payload.commandChannel,
        resultChannel: action.payload.resultChannel
      });

    case types.CHANNEL_SUCCESS:
      return Object.assign({}, state, {

      });

    case types.CHANNEL_CLOSED:
      return Object.assign({}, state, {});

    case types.CHANNEL_ERROR:
      return Object.assign({}, state, {});

    case types.RECEIVED_RESULT:
      return Object.assign({}, state, {
        results: [...state.results, action.result]
      });

    default:
      return state;
  }
};

export default channelsReducer;
