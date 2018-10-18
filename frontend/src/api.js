const URL = 'http://localhost:8080';

export async function fetchTorrents() {
  const res = await fetch(`${URL}/torrent`);
  return res.json();
}

export async function deleteTorrents(ids) {
  await fetch(`${URL}/torrent/${ids.join(',')}`, {
    method: 'DELETE',
  });
  return null;
}

export async function fetchDiskspace() {
  const res = await fetch(`${URL}/diskspace`);
  return res.json();
}

export async function fetchMovies() {
  const res = await fetch(`${URL}/movie`);
  return res.json();
}

export async function deleteMovies(ids) {
  await fetch(`${URL}/movie/${ids.join(',')}`, {
    method: 'DELETE',
  });
  return null;
}
