import {requestAction, responseAction} from '../utils/types';
import * as types from './types';

export function getConfigRequest(): requestAction {
  return {
    type: types.GET_CONFIG_REQUEST,
    data: {},
  };
}
export function getConfigResponse(payload: object): responseAction {
  return {
    type: types.GET_CONFIG_RESPONSE,
    payload,
  };
}
export function getCategoryNewsRequest(data: object): requestAction {
  return {
    type: types.GET_CATEGORY_NEWS_REQUEST,
    data,
  };
}
export function getCategoryNewsResponse(payload: object): responseAction {
  return {
    type: types.GET_CATEGORY_NEWS_RESPONSE,
    payload,
  };
}
export function onPressNewsDetailCount(payload: number): responseAction {
  return {
    type: types.ON_PRESS_NEWS_DETAIL,
    payload,
  };
}
export function onExpandDetails(): any {
  return {
    type: types.ON_EXPAND_DETAIL,
  };
}
