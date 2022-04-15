import * as types from '../actions/types';
import {responseAction, userState} from '../utils/types';

const initialState: userState = {
  saveNews: {},
  isNotification: true,
  nightMode: false,
  adminCredentials: {},
  ratingDetail: null,
};

const appReducer = (state = initialState, action: responseAction) => {
  switch (action.type) {
    case types.SAVE_NEWS_RESPONSE: {
      return {
        ...state,
        saveNews: action.payload.news,
      };
    }
    case types.OFF_NOTIFICATION: {
      return {
        ...state,
        isNotification: false,
      };
    }
    case types.ON_NOTIFICATION: {
      return {
        ...state,
        isNotification: true,
      };
    }
    case types.DISABLE_NIGHT_MODE: {
      return {
        ...state,
        nightMode: false,
      };
    }
    case types.ENABLE_NIGHT_MODE: {
      return {
        ...state,
        nightMode: true,
      };
    }
    case types.SET_ADMIN_CREDENTIALS: {
      return {
        ...state,
        adminCredentials: action.payload,
      };
    }
    case types.ON_RATE: {
      return {
        ...state,
        ratingDetail: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default appReducer;
