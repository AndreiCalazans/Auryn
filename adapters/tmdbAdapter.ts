/* eslint-disable camelcase */
import { Asset, AssetType } from './asset';

interface TmdbCredits {
  crew: TmdbCrew[];
  cast: TmdbCrew[];
}

interface TmdbCrew {
  job: string;
  name: string;
}

interface TmdbArray<T> {
  results: T[];
}

interface TmdbVideo {
  key: string;
}

interface TmdbApi {
  poster_path: string;
  backdrop_path: string;
  name: string;
  title: string;
  overview: string;
  credits: TmdbCredits;
  id: number;
  videos: TmdbArray<TmdbVideo>;
  similar: TmdbArray<TmdbApi>;
}

const getFeaturedText = (credits: TmdbCredits): string => {
  if (!credits) return '';

  const director = credits.crew.find((it: TmdbCrew) => it.job === 'Director');
  const cast = credits.cast
    .slice(0, 3)
    .map((it: TmdbCrew) => it.name)
    .join(', ');
  if (director) return `Director: ${director.name} | Starring: ${cast}`;

  return `Starring: ${cast}`;
};

const fromApi = (item: TmdbApi): Asset => ({
  images: {
    Poster: `http://image.tmdb.org/t/p/w1280/${item.poster_path}`,
    Backdrop: `http://image.tmdb.org/t/p/w1280/${item.backdrop_path}`,
  },
  thumbs: {
    Poster: `http://image.tmdb.org/t/p/w500/${item.poster_path}`,
    Backdrop: `http://image.tmdb.org/t/p/w500/${item.backdrop_path}`,
  },
  title: item.name || item.title,
  details: item.overview,
  extra: getFeaturedText(item.credits),
  similar: item.similar && item.similar.results ? item.similar.results.map((it: TmdbApi) => fromApi(it)) : [],
  key: item.id.toString(),
  id: item.id,
  youtubeId: item.videos ? item.videos.results[0].key : 'nO_DIwuGBnA',
  type: 'name' in item ? AssetType.TV : AssetType.MOVIE,
});

export { fromApi };
