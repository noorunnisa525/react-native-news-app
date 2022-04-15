import * as types from '../actions/types';
import {appState, responseAction} from '../utils/types';

const initialState: appState = {
  language: 'en',
  channels: {},
  tabs: [],
  newsStoreData: {},
  onNewsPressCount: 0,
  onExpandDetail: 0,
};

const appReducer = (state = initialState, action: responseAction) => {
  switch (action.type) {
    case types.GET_CONFIG_RESPONSE: {
      return {
        ...state,
        tabs: action.payload.tabs,
        channels: action.payload.channels,
      };
    }
    case types.GET_CATEGORY_NEWS_RESPONSE: {
      return {
        ...state,
        newsStoreData: action.payload.news,
      };
    }
    case types.ON_PRESS_NEWS_DETAIL: {
      return {
        ...state,
        onNewsPressCount: action.payload,
      };
    }
    case types.ON_EXPAND_DETAIL: {
      return {
        ...state,
        onExpandDetail:
          state.onExpandDetail == 4 ? 0 : state.onExpandDetail + 1,
      };
    }
    default: {
      return state;
    }
  }
};

export default appReducer;
