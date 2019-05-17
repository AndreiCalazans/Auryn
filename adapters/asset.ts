export interface Asset {
  images: AssetImages;
  thumbs: AssetImages;
  title: string;
  details: string;
  extra: string;
  similar: object[];
  key: string;
  id: number | string;
  youtubeId: string;
  type: AssetType;
}

export interface AssetImages {
  Poster: string;
  Backdrop: string;
}

export enum AssetType {
  TV = 'tv',
  MOVIE = 'movie',
}
