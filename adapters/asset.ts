export interface Asset {
  images: AssetImages,
  thumbs: AssetImages,
  title: string,
  details: string,
  extra: string,
  similar: Array<object>,
  key: string,
  id: number,
  youtubeId: string,
  type: AssetType
}

export interface AssetImages {
  poster: string;
  backdrop: string;
}

export enum AssetType {
  TV = 'tv',
  MOVIE = 'movie'
}
