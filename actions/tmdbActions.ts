/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

 /* eslint-disable max-len */

import { tmdbApiKey } from '../secrets';
import { Dispatch } from 'redux';
import { TmdbApi } from '../adapters/tmdbAdapter';
import { AssetType } from '../adapters/asset';
import { TmdbActionTypes, TmdbStore } from '../typings/tmdbReduxTypes';

const familyFilter = false;
const familyGenre = 10751;

export const getDiscover = () => (dispatch: Dispatch<TmdbActionTypes>) => {
  let movies: TmdbApi[] = [];

  dispatch({
    type: 'TMDB_DISCOVER',
    payload: fetch(`http://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&with_original_language=en&with_genres=${familyFilter ? familyGenre : ''}`)
      .then(response => response.json())
      .then(json => {
        movies = json.results.slice(0, 12);
        return fetch(`http://api.themoviedb.org/3/discover/tv?api_key=${tmdbApiKey}&with_original_language=en&with_genres=${familyFilter ? familyGenre : ''}`);
      })
      .then(response => response.json())
      .then(tv => ({ results: movies.concat(tv.results.slice(0, 12)).sort(() => 0.5 - Math.random()) })),
  });
};

export const getMovies = () => (dispatch: Dispatch) => dispatch({
  type: 'TMDB_MOVIES',
  payload: fetch(`http://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&with_original_language=en`)
    .then(response => response.json()),
});

export const getTv = () => (dispatch: Dispatch) => dispatch({
  type: 'TMDB_TV',
  payload: fetch(`http://api.themoviedb.org/3/tv/popular?api_key=${tmdbApiKey}&with_original_language=en`)
    .then(response => response.json()),
});

export const prefetchDetails = (id: number | string, type: AssetType) => (dispatch: Dispatch, getState: () => TmdbStore) => {
  const { tmdbReducer: { cache: { data, fetching } } } = getState();

  if (fetching || !data)
    return dispatch({ type: 'NOOP' });

  const cachedPayload = data.find(it => it && (it.id === id && it.type === type));
  if (cachedPayload) {
    return dispatch({
      type: 'TMDB_CACHE',
      payload: Promise.resolve(cachedPayload),
    });
  }

  return dispatch({
    type: 'TMDB_CACHE',
    meta: {
      debounce: {
        time: 500,
        key: 'CACHE_DETAILS',
      },
    },
    payload: fetch(`http://api.themoviedb.org/3/${type}/${id}?append_to_response=similar,videos,credits&api_key=${tmdbApiKey}`)
      .then(response => response.json())
      .then(json => {
        json.type = type;
        return json;
      }),
  });
};

export const getDetailsByIdAndType = (id: number, type: AssetType) => (dispatch: Dispatch, getState: () => TmdbStore) => {
  const { tmdbReducer: { cache: { data } } } = getState();
  const cachedPayload = (data as TmdbApi[]).find(it => it.id === id && it.type === type);
  if (cachedPayload) {
    return dispatch({
      type: 'TMDB_DETAILS',
      payload: Promise.resolve(cachedPayload),
    });
  }

  return dispatch({
    type: 'TMDB_DETAILS',
    payload: fetch(`http://api.themoviedb.org/3/${type}/${id}?append_to_response=similar,videos,credits&api_key=${tmdbApiKey}`)
      .then(response => response.json())
      .then(json => {
        json.type = type;
        return json;
      }),
  });
};

export const search = (query: string) => (dispatch: Dispatch) => dispatch({
  type: 'TMDB_SEARCH',
  meta: {
    debounce: {
      time: 500,
    },
  },
  payload: fetch(`http://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&api_key=${tmdbApiKey}`)
    .then(response => response.json()),
});
