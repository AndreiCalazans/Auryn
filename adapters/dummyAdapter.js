const fromApi = (fillSimilar = true) => ({
  'images': {
    'poster': 'https://via.placeholder.com/200x300',
    'backdrop': 'https://via.placeholder.com/1068x600',
  },
  'thumbs': {
    'poster': 'https://via.placeholder.com/400x600',
    'backdrop': 'https://via.placeholder.com/534x300',
  },
  'title': 'You.i TV',
  'details': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'extra': 'Director: Alan Smithee | Starring: John Doe, Jane Doe',
  'similar': fillSimilar ? Array(5).fill(fromApi(false)) : [],
  'key': Date.now().toString(),
  'id': Date.now(),
  'youtubeId': 'nO_DIwuGBnA',
  'type': ['tv', 'movie'][Math.round(Math.random())],
});

export {
fromApi,
};
