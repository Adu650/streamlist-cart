/* Adding the ability to search for movies per Week 3 Assignment 1 -- JC */
const API = 'https://api.themoviedb.org/3';
const KEY = process.env.REACT_APP_TMDB_KEY;

export const hasKey = Boolean(KEY);

export async function searchMovies(query, page = 1) {
  if (!query?.trim()) {
    return { results: [], page: 1, total_pages: 0, total_results: 0 };
  }

  const url = new URL(`${API}/search/movie`);
  url.searchParams.set('api_key', KEY || '');
  url.searchParams.set('query', query);
  url.searchParams.set('page', String(page));
  url.searchParams.set('include_adult', 'false');

  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  return res.json();
}

export function posterUrl(path, size = 342) {
  return path ? `https://image.tmdb.org/t/p/w${size}${path}` : null;
}
