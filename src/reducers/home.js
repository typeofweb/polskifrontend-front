import * as constants from '../constants';
import _ from 'lodash';
import * as settingsHelper from '../core/helpers/settingsHelper';

export const initialState = {
  blogList: [],
  blogListNextPage: 1,
  blogListLoading: false,
  blogListError: false,
  articlesLoading: false,
  articlesError: false,
  blogProposalUrl: '',
  blogProposalUrlValid: true,

  allArticlesList: [],
  allArticlesNextPage: 1,
  allArticlesListLoading: false,
  allArticlesListError: false,

  isListOptionSelected: false,
  isTilesOptionSelected: true,

  clickedLinks: []
};

export default function homeReducer(state = initialState, action) {
  switch (action.type) {
    case constants.HOME_GET_BLOG_LIST_REQUEST:
      return { ...state, blogListLoading: true, blogList: action.payload.blogList, blogListError: false };
    case constants.HOME_GET_BLOG_LIST_SUCCESS:
      return { ...state, blogList: action.payload.blogs, blogListNextPage: action.payload.nextPage, blogListLoading: false, isTilesOptionSelected: true, isListOptionSelected: false };
    case constants.HOME_GET_BLOG_LIST_ERROR:
      return { ...state, blogListLoading: false, blogListError: true };

    case constants.HOME_SWITCH_TO_LIST_VIEW:
      return { ...state, allArticlesListLoading: true, allArticlesList: action.payload === 1 ? [] : state.allArticlesList, allArticlesListError: false };
    case constants.HOME_SWITCH_TO_LIST_VIEW_SUCCESS:
      const newArticlesList = _.cloneDeep(state.allArticlesList);
      newArticlesList.push(...action.payload.articles);

      // store this setting in cookie
      const listSettings = settingsHelper.getSettings();
      listSettings.tiles = false;
      settingsHelper.saveSettings(listSettings);

      return { ...state, allArticlesList: newArticlesList, allArticlesNextPage: action.payload.nextPage, allArticlesListLoading: false, isTilesOptionSelected: false, isListOptionSelected: true };
    case constants.HOME_SWITCH_TO_LIST_VIEW_ERROR:
      return { ...state, allArticlesListLoading: false, allArticlesListError: true };

    case constants.HOME_ADD_LINK_TO_CLICKED:
      const links = _.cloneDeep(state.clickedLinks);
      links.push(action.payload);
      return { ...state, clickedLinks: links };
    default:
      return { ...state };
  }
}
