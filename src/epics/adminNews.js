import * as constants from '../constants';
import { ajax } from 'rxjs/observable/dom/ajax';
import { apiUrl } from '../config';
import * as loginHelper from '../core/helpers/loginHelper';
import _ from 'lodash';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

export const getAdminNewsListEpic = action$ => {
  return action$.ofType(constants.ADMIN_NEWS_GET_NEWS)
    .mergeMap(() => {
      const headers = {
        'authorization': 'Basic YnVyY3p1OmFiY2RmcmJrMzQwMzQxZmRzZnZkcw==',
        'x-access-token': loginHelper.getLoginToken()
      };

      return ajax.get(`${apiUrl}/admin/news`, headers)
        .map(responseData => {
          const { success, reason, newses } = responseData.response.reason;
          if (success === false && reason === 'bad-token') {
            return {
              type: constants.ADMIN_TOKEN_EXPIRED
            };
          }

          return {
            type: constants.ADMIN_NEWS_GET_NEWS_SUCCESS,
            payload: {
              newsList: newses
            }
          };
        })
        .catch(error => ({
          type: constants.ADMIN_NEWS_GET_NEWS_ERROR,
          payload: error
        }));
    });
};

export const addNewsEpic = (action$, store) => {
  return action$.ofType(constants.ADMIN_NEWS_ADD_NEWS)
    .mergeMap(action => {
      const headers = {
        'authorization': 'Basic YnVyY3p1OmFiY2RmcmJrMzQwMzQxZmRzZnZkcw==',
        'x-access-token': loginHelper.getLoginToken()
      };

      return ajax({
        url: `${apiUrl}/admin/news`,
        body: action.payload,
        headers: headers,
        method: 'POST',
        responseType: 'json'
      })
      .map(responseData => {
        const { success, reason, message, news } = responseData.response;
        if (success === false && reason === 'bad-token') {
          return {
            type: constants.ADMIN_TOKEN_EXPIRED
          };
        }

        if (responseData.response.success === false) {
          return {
            type: constants.ADMIN_NEWS_ADD_NEWS_ERROR,
            payload: {
              message
            }
          };
        }

        const state = store.getState().adminNewsState;
        let newsList = _.cloneDeep(state.newsList);
        newsList.unshift(news);

        return {
          type: constants.ADMIN_NEWS_ADD_NEWS_SUCCESS,
          payload: {
            newsList
          }
        };
      })
      .catch(error => ({
        type: constants.ADMIN_NEWS_ADD_NEWS_ERROR,
        payload: {
          error
        }
      }));
    });
};

export const deleteAdminNewsEpic = (action$) => {
  return action$.ofType(constants.ADMIN_NEWS_DELETE_NEWS)
    .mergeMap(action => {
      const headers = {
        'authorization': 'Basic YnVyY3p1OmFiY2RmcmJrMzQwMzQxZmRzZnZkcw==',
        'x-access-token': loginHelper.getLoginToken()
      };

      return ajax.delete(`${apiUrl}/admin/news/${action.payload.newsId}`, headers)
        .map(responseData => {
          const { success, reason, message, newses } = responseData.response;
          if (success === false && reason === 'bad-token') {
            return {
              type: constants.ADMIN_TOKEN_EXPIRED
            };
          }

          if (success === false) {
            return {
              type: constants.ADMIN_NEWS_DELETE_NEWS_ERROR,
              payload: {
                message
              }
            };
          }

          return {
            type: constants.ADMIN_NEWS_DELETE_NEWS_SUCCESS,
            payload: {
              newsList: {
                newses
              }
            }
          };
        })
        .catch(error => ({
          type: constants.ADMIN_NEWS_DELETE_NEWS_ERROR,
          payload: {
            error
          }
        }));
    });
};
