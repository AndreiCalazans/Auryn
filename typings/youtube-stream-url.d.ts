/* eslint-disable camelcase */
declare module 'youtube-stream-url' {
  export function getInfo({ url }: Url): Promise<YoutubeResponse>;
  export function getVideoId({ url }: Url): Promise<YoutubeResponse>;

  interface Url {
    url: string;
  }

  interface YoutubeFormat {
    url: string;
    quality: string;
    itag: string;
    type: string;
  }

  export interface YoutubeResponse {
    video_id: string;
    title: string;
    thumbnail_url: string;
    view_count: number;
    length_seconds: number;
    allow_embed: boolean;
    author: string;
    formats: YoutubeFormat[];
}
}
