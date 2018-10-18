const got = require('got');
const btoa = require('btoa');

const USER_URL = process.env.TRANSMISSION_URL;
const USER_NAME = process.env.TRANSMISSION_AUTH_USER;
const USER_PASSWORD = process.env.TRANSMISSION_AUTH_PASSWORD;

let sessionId = '';

async function request(options = {}) {
  return got
    .post(`${USER_URL}/rpc`, {
      json: true,
      headers: {
        Authorization: `Basic ${btoa(`${USER_NAME}:${USER_PASSWORD}`)}`,
        'x-transmission-session-id': sessionId,
      },
      ...options,
    })
    .catch(async e => {
      // Retry request with CSRF if it failed
      if (
        e.response.statusCode === 409 &&
        options.body.method !== 'session-get'
      ) {
        sessionId = await getSession();
        return request(options);
      } else {
        throw e;
      }
    });
}

async function getSession() {
  try {
    await request({
      body: { method: 'session-get' },
    });
  } catch (e) {
    if (e.response) {
      return e.response.headers['x-transmission-session-id'];
    } else {
      throw e;
    }
  }
}

exports.fetchTorrents = async function fetchTorrents() {
  const res = await request({
    body: {
      method: 'torrent-get',
      arguments: {
        fields: [
          'id',
          'addedDate',
          'name',
          'totalSize',
          'error',
          'errorString',
          'isFinished',
          'leftUntilDone',
          'rateUpload',
          'sizeWhenDone',
          'status',
          'downloadDir',
          'uploadRatio',
        ],
      },
    },
  });
  return { data: res.body.arguments.torrents };
};

exports.deleteTorrents = async function deleteTorrent(ids) {
  await request({
    body: {
      method: 'torrent-remove',
      arguments: {
        'delete-local-data': true,
        ids: ids.map(Number),
      },
    },
  });
  return {};
};
