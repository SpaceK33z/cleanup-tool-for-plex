const { request } = require('./radarr');

exports.fetchShows = async function fetchShows() {
  const res = await request('series', {
    query: {
      order: 'asc',
      sort_by: 'sortTitle',
    },
  });
  return { data: res.body.records };
};

exports.deleteMovies = async function deleteMovies(ids) {
  await request('movie/editor/delete', {
    method: 'PUT',
    query: {
      deleteFiles: 'true',
      addExclusion: 'false',
    },
    body: ids,
  });
  return {};
};
