/*Search for movies using TMDB API and display results with pagination and add to cart functionality -- JC */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { searchMovies, posterUrl, hasKey } from '../services/tmdb';
import { useCart } from '../hooks/useCart';

export default function Search() {
  const [query, setQuery] = useLocalStorage('search.query', '');
  const [results, setResults] = useLocalStorage('search.results', []);
  const [page, setPage] = useLocalStorage('search.page', 1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const { add } = useCart();

  const canSearch = useMemo(() => query.trim().length > 0, [query]);

  const runSearch = useCallback(
    async (nextPage = 1) => {
      if (!canSearch) return;
      setLoading(true);
      setErr('');
      try {
        const data = await searchMovies(query, nextPage);
        setResults(data.results ?? []);
        setPage(data.page ?? 1);
        setTotalPages(data.total_pages ?? 1);
      } catch {
        setErr('Search failed');
      } finally {
        setLoading(false);
      }
    },
    [canSearch, query, setResults, setPage]
  );

  useEffect(() => {
    if (canSearch && results.length === 0) {
      runSearch(page || 1);
    }
  }, [canSearch, results.length, page, runSearch]);

  return (
    <section className="stack">
      <h1>Search Movies</h1>

      {!hasKey && (
        <div className="card" role="alert">
          TMDB key missing. Add <code>REACT_APP_TMDB_KEY</code> to <code>.env</code> and restart.
        </div>
      )}

      <form
        className="stack"
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(1);
        }}
      >
        <input
          type="search"
          placeholder="Search TMDB…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem 0.9rem',
            borderRadius: '0.6rem',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text)',
          }}
        />
        <div>
          <button className="btn primary" type="submit" disabled={!canSearch || loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </div>
      </form>

      {err && (
        <div className="card" role="alert">
          {err}
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {results.map((m) => (
          <article className="card" key={m.id}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <img
                src={posterUrl(m.poster_path, 185) || 'https://via.placeholder.com/92x138?text=No+Image'}
                alt={m.title}
                width={92}
                height={138}
                style={{ borderRadius: '8px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>{m.title}</h3>
                <div className="text-muted">
                  {(m.release_date || '').slice(0, 4)} • ⭐ {m.vote_average?.toFixed?.(1) ?? '—'}
                </div>
                <p style={{ marginTop: '8px' }}>
                  {m.overview ? m.overview.slice(0, 160) + (m.overview.length > 160 ? '…' : '') : 'No overview'}
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button
                    className="btn"
                    onClick={() =>
                      add({
                        id: `tmdb-${m.id}`,
                        title: m.title,
                        price: 0,
                        qty: 1,
                        image: posterUrl(m.poster_path, 92),
                      })
                    }
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
          <button className="btn" disabled={page <= 1 || loading} onClick={() => runSearch(page - 1)}>
            Prev
          </button>
          <button className="btn" disabled={page >= totalPages || loading} onClick={() => runSearch(page + 1)}>
            Next
          </button>
          <span className="text-muted" style={{ alignSelf: 'center' }}>
            Page {page} / {totalPages}
          </span>
        </div>
      )}
    </section>
  );
}
