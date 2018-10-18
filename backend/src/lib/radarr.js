const got = require('got');
const btoa = require('btoa');

const USER_URL = process.env.RADARR_URL;
const USER_NAME = process.env.RADARR_AUTH_USER;
const USER_PASSWORD = process.env.RADARR_AUTH_PASSWORD;
const USER_API_KEY = process.env.RADARR_API_KEY;

async function request(url, options = {}) {
  return got(`${USER_URL}/api/${url}`, {
    json: true,
    headers: {
      Authorization: `Basic ${btoa(`${USER_NAME}:${USER_PASSWORD}`)}`,
      'x-api-key': USER_API_KEY,
    },
    ...options,
  });
}

exports.request = request;

exports.fetchDiskspace = async function fetchDiskspace() {
  const res = await request('diskspace');
  return { data: res.body };
};

exports.fetchMovies = async function fetchMovies() {
  const res = await request('movie', {
    query: {
      page: 1,
      pageSize: 99000,
      sortDir: 'asc',
      sortKey: 'sortTitle',
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
