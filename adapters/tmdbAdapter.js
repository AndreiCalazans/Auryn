const fromApi = item => ({
    'images': {
      'poster': `http://image.tmdb.org/t/p/w1280/${item.poster_path}`,
      'backdrop': `http://image.tmdb.org/t/p/w1280/${item.backdrop_path}`,
    },
    'thumbs': {
      'poster': `http://image.tmdb.org/t/p/w500/${item.poster_path}`,
      'backdrop': `http://image.tmdb.org/t/p/w500/${item.backdrop_path}`,
    },
    'title': item.name || item.title,
    'details': item.overview,
    'extra': getFeaturedText(item.credits),
    'similar': item.similar && item.similar.results ? item.similar.results.map(it => fromApi(it)) : [],
    'key': item.id.toString(),
    'id': item.id,
    'youtubeId': item.videos ? item.videos.results[0].key : 'nO_DIwuGBnA',
    'type': 'name' in item ? 'tv' : 'movie',
  });

const getFeaturedText = credits => {
  if (!credits) return '';

  const director = credits.crew.find(it => it.job === 'Director');
  const cast = credits.cast.slice(0, 3).map(it => it.name).join(', ');
  if (director)
    return `Director: ${director.name} | Starring: ${cast}`;

  return `Starring: ${cast}`;
};

export {
  fromApi,
};
