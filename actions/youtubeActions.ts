/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import Youtube from 'youtube-stream-url';
import { Dispatch } from 'redux';

interface YoutubeApiAction {
  type: 'YOUTUBE_VIDEO' | 'YOUTUBE_VIDEO_REJECTED';
  payload: Promise<Youtube.YoutubeResponse>;
  meta: {
    debounce: {
      time: number;
    };
  };
}

interface YoutubeFulfilledApiAction {
  type: 'YOUTUBE_VIDEO_FULFILLED';
  payload: Youtube.YoutubeResponse;
}

export type YoutubeApiActions = YoutubeApiAction | YoutubeFulfilledApiAction;

export const getVideoSourceByYoutubeId = (key: string) => (dispatch: Dispatch<YoutubeApiAction>) => dispatch({
  type: 'YOUTUBE_VIDEO',
  meta: {
    debounce: {
      time: 500,
    },
  },
  payload: Youtube.getInfo({ url: `http://www.youtube.com/watch?v=${key}` }),
});
