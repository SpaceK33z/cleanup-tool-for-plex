const restify = require('restify');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({
  path: process.env.ENV_FILE || '../../.env',
});

const { fetchTorrents, deleteTorrents } = require('./lib/transmission');
const { fetchDiskspace, fetchMovies, deleteMovies } = require('./lib/radarr');
const corsMiddleware = require('restify-cors-middleware');

const PORT = process.env.PORT || 8080;
const server = restify.createServer();

const cors = corsMiddleware({
  origins: ['*'],
});

server.pre(cors.preflight);
server.use(cors.actual);

server.get(
  '/*',
  restify.plugins.serveStatic({
    directory: path.join(__dirname, '../../frontend/dist'),
    default: 'index.html',
  })
);

server.get('/torrent', async (req, res, next) => {
  res.send(await fetchTorrents());
  return next();
});

server.del('/torrent/:ids', async (req, res, next) => {
  const ids = req.params.ids.split(',');
  if (!ids.length) {
    res.send(400, { error: 'Use one or multiple ids in the url.' });
    return next();
  }
  res.send(await deleteTorrents(req.params.ids.split(',')));
  return next();
});

server.get('/diskspace', async (req, res, next) => {
  res.send(await fetchDiskspace());
  return next();
});

server.get('/movie', async (req, res, next) => {
  res.send(await fetchMovies());
  return next();
});

server.del('/movie/:ids', async (req, res, next) => {
  const ids = req.params.ids.split(',');
  if (!ids.length) {
    res.send(400, { error: 'Use one or multiple ids in the url.' });
    return next();
  }
  res.send(await deleteMovies(req.params.ids.split(',')));
  return next();
});

server.listen(PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});
