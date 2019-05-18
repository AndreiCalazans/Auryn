import { TmdbResults, TmdbApi } from '../adapters/tmdbAdapter';

interface TmdbApiActions {
  type: 'TMDB_DISCOVER' | 'TMDB_MOVIES' | 'TMDB_TV' | 'TMDB_SEARCH';
  payload: Promise<TmdbResults<TmdbApi>>;
}

interface TmdbApiActionsFulfilled {
  type: 'TMDB_DISCOVER_FULFILLED'
      | 'TMDB_MOVIES_FULFILLED'
      | 'TMDB_TV_FULFILLED'
      | 'TMDB_SEARCH_FULFILLED';
  payload: TmdbResults<TmdbApi>;
}

interface TmdbApiDetailActions {
  type: 'TMDB_DETAILS' | 'TMDB_CACHE';
  payload: Promise<TmdbApi>;
}

interface TmdbApiDetailActionsFulfilled {
  type: 'TMDB_DETAILS_FULFILLED' | 'TMDB_CACHE_FULFILLED';
  payload: TmdbApi;
}

interface TmdbApiActionsRejected {
  type: 'TMDB_DISCOVER_REJECTED'
      | 'TMDB_MOVIES_REJECTED'
      | 'TMDB_TV_REJECTED'
      | 'TMDB_SEARCH_REJECTED'
      | 'TMDB_DETAILS_REJECTED'
      | 'TMDB_CACHE_REJECTED';
  payload: Error;
}

export type TmdbActionTypes =
    TmdbApiActions
  | TmdbApiActionsFulfilled
  | TmdbApiDetailActions
  | TmdbApiDetailActionsFulfilled
  | TmdbApiActionsRejected

export interface TmdbStore {
  tmdbReducer: TmdbReducerState;
}

export interface TmdbState<T> {
  data: T;
  fetching: boolean;
  fetched: boolean;
  error: Error | null;
}

export interface TmdbSearch {
  tv: TmdbResults<TmdbApi>;
  movies: TmdbResults<TmdbApi>;
}

export interface TmdbReducerState {
  discover: TmdbState<TmdbResults<TmdbApi>>;
  movies: TmdbState<TmdbResults<TmdbApi>>;
  tv: TmdbState<TmdbResults<TmdbApi>>;
  details: TmdbState<TmdbApi> | {};
  cache: TmdbState<TmdbApi[]>;
  search: TmdbSearch | {};
}
