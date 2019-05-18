import {  YoutubeApiActions } from '../actions/youtubeActions';
import { VideoUriSource } from '@youi/react-native-youi';

/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

interface YoutubeReducerState {
  videoSource: VideoUriSource;
  fetching: boolean;
  fetched: boolean;
  error: Error | null;
}

const initalState: YoutubeReducerState = {
  videoSource: { uri: 'http://www.streambox.fr/playlists/x31jrg1/x31jrg1.m3u8', type: 'HLS' },
  fetching: false,
  fetched: false,
  error: null,
};

export const youtubeReducer = (state = initalState, action: YoutubeApiActions): YoutubeReducerState => {
  switch (action.type) {
    case 'YOUTUBE_VIDEO_FULFILLED': {
      const format = action.payload.formats ?
        action.payload.formats.find(fmt => fmt.type.indexOf('mp4') > 0 && fmt.quality === 'hd720')
        : null;
      if (format) {
        return {
          ...state,
          videoSource: {
            uri: format.url,
            type: 'MP4',
          },
          fetching: false,
          fetched: true,
        };
      }

      // No viable format found
      return {
        ...state,
        videoSource: initalState.videoSource,
        fetching: false,
        fetched: true,
      };
    }
    case 'YOUTUBE_VIDEO_REJECTED':
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
