/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

 /* eslint-disable complexity */
import { fromApi, TmdbApi } from '../adapters/tmdbAdapter';
import { TmdbReducerState, TmdbActionTypes } from '../typings/tmdbReduxTypes';

const normalize = (array: TmdbApi[], length = 10, imagePath: 'poster' | 'backdrop' = 'backdrop') =>
  array.filter(asset => {
    const hasImage = imagePath === 'poster' ? asset.poster_path : asset.backdrop_path;
    return asset.original_language === 'en' && hasImage && !asset.adult;
  })
  .slice(0, length)
  .map(it => fromApi(it));

const initialState: TmdbReducerState = { // eslint-disable-line max-lines-per-function
  discover: {
    data: [],
    fetching: false,
    fetched: false,
    error: null,
  },
  movies: {
    data: [],
    fetching: false,
    fetched: false,
    error: null,
  },
  tv: {
    data: [],
    fetching: false,
    fetched: false,
    error: null,
  },
  details: {
    data: {},
    fetching: false,
    fetched: false,
    error: null,
  },
  cache: {
    data: [],
    fetching: false,
    fetched: false,
    error: null,
  },
  search: {
    data: { tv: [], movies: [] },
    fetching: false,
    fetched: false,
    error: null,
  },
};

// eslint-disable-next-line max-lines-per-function
export const tmdbReducer = (state = initialState, action: TmdbActionTypes): TmdbReducerState => {
  switch (action.type) {
    case 'TMDB_DISCOVER_FULFILLED':
      return {
        ...state,
        discover: {
          data: normalize(action.payload.results, 12),
          fetching: false,
          fetched: true,
        },
      };

    case 'TMDB_DISCOVER_REJECTED':
      return {
        ...state,
        discover: {
          fetching: false,
          error: action.payload,
        },
      };

    case 'TMDB_DISCOVER':
      return {
        ...state,
        discover: {
          fetching: true,
          fetched: false,
        },
      };

    case 'TMDB_MOVIES_FULFILLED':
      return {
        ...state,
        movies: {
          data: normalize(action.payload.results, 10, 'poster'),
          fetching: false,
          fetched: true,
        },
      };

    case 'TMDB_MOVIES_REJECTED':
      return {
        ...state,
        movies: {
          fetching: false,
          error: action.payload,
        },
      };

    case 'TMDB_MOVIES':
      return {
        ...state,
        movies: { fetching: true, fetched: false },
      };

    case 'TMDB_TV_FULFILLED':
      return {
        ...state,
        tv: {
          data: normalize(action.payload.results),
          fetching: false,
          fetched: true,
        },
      };

    case 'TMDB_TV_REJECTED':
      return {
        ...state,
        tv: {
          fetching: false,
          error: action.payload,
        },
      };

    case 'TMDB_TV':
      return {
        ...state,
        tv: { fetching: true, fetched: false },
      };

    case 'TMDB_DETAILS_FULFILLED':
      return {
        ...state,
        details: {
          data: fromApi(action.payload),
          fetching: false,
          fetched: true,
        },
      };

    case 'TMDB_DETAILS_REJECTED':
      return {
        ...state,
        details: {
          fetching: false,
          error: action.payload,
        },
      };

    case 'TMDB_DETAILS':
      return {
        ...state,
        details: { fetching: true, fetched: false },
      };

    case 'TMDB_CACHE_FULFILLED':
      const cache = [...state.cache.data as TmdbApi[]];
      const index = cache.findIndex(it => it && it.id === action.payload.id);
      if (index >= 0) {
        const asset = cache.splice(index, 1);
        cache.unshift(asset[0]);
      } else
        cache.unshift(action.payload);

      if (cache.length > 5) cache.pop();

      return {
        ...state,
        cache: {
          data: cache,
          fetching: false,
          fetched: true,
        },
      };

    case 'TMDB_CACHE_REJECTED':
      return {
        ...state,
        cache: {
          fetching: false,
          error: action.payload,
        },
      };

    case 'TMDB_CACHE':
      return {
        ...state,
        cache: { fetching: true, fetched: false },
      };

    case 'TMDB_SEARCH_FULFILLED':
      const data = {
        movies: normalize(action.payload.results.filter(it => it.media_type === 'movie'), 10),
        tv: normalize(action.payload.results.filter(it => it.media_type === 'tv'), 10),
      };
      return {
        ...state,
        search: {
          data,
          fetching: false,
          fetched: true,
        },
      };

    case 'TMDB_SEARCH_REJECTED':
      return {
        ...state,
        search: {
          fetching: false,
          error: action.payload,
        },
      };

    case 'TMDB_SEARCH':
      return {
        ...state,
        search: { fetching: true },
      };

    default:
      return state;
  }
};
