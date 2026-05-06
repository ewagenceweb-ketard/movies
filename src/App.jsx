import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const categories = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

const demoMovies = [
  { id: 27205, title: 'Inception', vote_average: 8.8, release_date: '2010-07-16', poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', overview: 'A skilled thief enters dreams to steal secrets and plant ideas.' },
  { id: 155, title: 'The Dark Knight', vote_average: 9.0, release_date: '2008-07-18', poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', overview: 'Batman faces the Joker in Gotham City.' },
  { id: 157336, title: 'Interstellar', vote_average: 8.7, release_date: '2014-11-07', poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', overview: 'Explorers travel through a wormhole to save humanity.' },
  { id: 98, title: 'Gladiator', vote_average: 8.5, release_date: '2000-05-05', poster_path: '/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg', overview: 'A betrayed Roman general seeks revenge in the arena.' },
  { id: 680, title: 'Pulp Fiction', vote_average: 8.9, release_date: '1994-10-14', poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', overview: 'Connected crime stories unfold in Los Angeles.' },
  { id: 19995, title: 'Avatar', vote_average: 7.9, release_date: '2009-12-18', poster_path: '/kyeqWdyUXW608qlYkRqosgbbJyK.jpg', overview: 'A marine discovers Pandora and its native civilization.' },
];

const demoActors = [
  { id: 6193, name: 'Leonardo DiCaprio' },
  { id: 3894, name: 'Christian Bale' },
  { id: 10297, name: 'Matthew McConaughey' },
  { id: 934, name: 'Russell Crowe' },
  { id: 31, name: 'Tom Hanks' },
  { id: 500, name: 'Tom Cruise' },
];

const demoCredits = {
  directors: [{ id: 525, name: 'Christopher Nolan', profile_path: null }],
  cast: [
    { id: 6193, name: 'Leonardo DiCaprio', character: 'Dom Cobb', profile_path: null },
    { id: 24045, name: 'Joseph Gordon-Levitt', character: 'Arthur', profile_path: null },
    { id: 27578, name: 'Elliot Page', character: 'Ariadne', profile_path: null },
  ],
};

function poster(path, size = '500x750') {
  return path ? `${IMAGE_URL}${path}` : `https://placehold.co/${size}?text=No+Poster`;
}

function profile(path) {
  return path ? `${IMAGE_URL}${path}` : 'https://placehold.co/300x450?text=No+Photo';
}

export default function App() {
  const [movies, setMovies] = useState(demoMovies);
  const [actors, setActors] = useState(demoActors);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedActor, setSelectedActor] = useState('');
  const [selectedPersonName, setSelectedPersonName] = useState('');
  const [personFilterType, setPersonFilterType] = useState('cast');
  const [selectedYear, setSelectedYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [movieCredits, setMovieCredits] = useState(demoCredits);
  const [isCreditsLoading, setIsCreditsLoading] = useState(false);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1980 + 1 }, (_, index) => currentYear - index);
  }, []);

  useEffect(() => {
    if (API_KEY) fetchActors();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedYear, selectedActor, personFilterType]);

  useEffect(() => {
    if (API_KEY) fetchMovies(currentPage);
  }, [selectedCategory, selectedYear, selectedActor, personFilterType, currentPage]);

  async function fetchActors() {
    try {
      const res = await fetch(`${BASE_URL}/person/popular?api_key=${API_KEY}&page=1`);
      const data = await res.json();
      const popularActors = data.results?.map((actor) => ({ id: actor.id, name: actor.name }));
      if (popularActors?.length) setActors(popularActors);
    } catch {
      setActors(demoActors);
    }
  }

  async function fetchMovies(page = 1) {
    try {
      setIsLoading(true);
      let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}`;

      if (selectedYear) url += `&primary_release_year=${selectedYear}`;
      else url += '&primary_release_date.gte=1980-01-01';
      if (selectedCategory) url += `&with_genres=${selectedCategory}`;
      if (selectedActor) {
        url += personFilterType === 'crew' ? `&with_crew=${selectedActor}` : `&with_cast=${selectedActor}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setMovies(data.results || demoMovies);
      setTotalPages(Math.min(data.total_pages || 1, 500));
      setTotalResults(data.total_results || 0);
    } catch {
      setMovies(demoMovies);
      setTotalPages(1);
      setTotalResults(demoMovies.length);
    } finally {
      setIsLoading(false);
    }
  }

  async function openMovieDetails(movie) {
    setSelectedMovie(movie);
    await fetchMovieCredits(movie.id);
  }

  async function fetchMovieCredits(movieId) {
    try {
      setIsCreditsLoading(true);
      const res = await fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`);
      const data = await res.json();
      const directors = data.crew?.filter((person) => person.job === 'Director') || [];
      const cast = data.cast?.slice(0, 50) || [];
      setMovieCredits({ directors, cast });
    } catch {
      setMovieCredits(demoCredits);
    } finally {
      setIsCreditsLoading(false);
    }
  }

  function showPersonMovies(person, type = 'cast') {
    setSelectedActor(String(person.id));
    setSelectedPersonName(person.name);
    setPersonFilterType(type);
    setSelectedMovie(null);
    setSelectedCategory(null);
    setCurrentPage(1);
  }

  function clearPersonFilter() {
    setSelectedActor('');
    setSelectedPersonName('');
    setPersonFilterType('cast');
    setCurrentPage(1);
  }

  const selectedActorName = selectedPersonName || actors.find((actor) => String(actor.id) === selectedActor)?.name;
  const topPicks = [...movies].sort((a, b) => b.vote_average - a.vote_average).slice(0, 20);

  return (
    <div className="app">
      <div className="container">
        <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="hero">
          <div>
            <h1><span>🎬</span> Movie Dashboard</h1>
            <p>Base films TMDb de 1980 à aujourd’hui, catégories, acteurs, recommandations et fiches détaillées.</p>
          </div>
          {!API_KEY && <div className="warning">Mode démo : ajoute VITE_TMDB_API_KEY dans .env.local</div>}
        </motion.header>

        <section className="filters">
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="">Toutes les années</option>
            {years.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>

          <select
            value={selectedActor}
            onChange={(e) => {
              setSelectedActor(e.target.value);
              const actor = actors.find((item) => String(item.id) === e.target.value);
              setSelectedPersonName(actor?.name || '');
              setPersonFilterType('cast');
            }}
          >
            <option value="">Tous les acteurs</option>
            {actors.map((actor) => <option key={actor.id} value={actor.id}>{actor.name}</option>)}
          </select>
        </section>

        <section className="categoryBar">
          <button className={!selectedCategory ? 'pill active' : 'pill'} onClick={() => setSelectedCategory(null)}>All</button>
          {categories.map((cat) => (
            <button key={cat.id} className={selectedCategory === cat.id ? 'pill active' : 'pill'} onClick={() => setSelectedCategory(cat.id)}>
              {cat.name}
            </button>
          ))}
        </section>

        <section className="block">
          <h2>🏆 Top Recommendations</h2>
          <div className="topGrid">
            {topPicks.map((movie) => <MovieCard key={movie.id} movie={movie} compact onClick={() => openMovieDetails(movie)} />)}
          </div>
        </section>

        <section className="block">
          <div className="listHeader">
            <div>
              <h2>{selectedActorName ? `Films avec ${selectedActorName}` : selectedYear ? `Films de ${selectedYear}` : 'Tous les films'}</h2>
              <p>{totalResults.toLocaleString()} films trouvés • Page {currentPage} / {totalPages}</p>
              {selectedActorName && <button className="secondaryButton" onClick={clearPersonFilter}>Retirer le filtre personne</button>}
            </div>
          </div>

          {isLoading ? <p className="loading">Chargement des films...</p> : (
            <div className="movieGrid">
              {movies.map((movie) => <MovieCard key={movie.id} movie={movie} onClick={() => openMovieDetails(movie)} />)}
            </div>
          )}

          <div className="pagination">
            <button onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))} disabled={currentPage === 1 || isLoading}>Page précédente</button>
            <span>Page {currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))} disabled={currentPage === totalPages || isLoading}>Page suivante</button>
          </div>
        </section>
      </div>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          credits={movieCredits}
          loading={isCreditsLoading}
          onClose={() => setSelectedMovie(null)}
          onPersonClick={showPersonMovies}
        />
      )}
    </div>
  );
}

function MovieCard({ movie, onClick, compact = false }) {
  return (
    <article className="card" onClick={onClick}>
      <img src={poster(movie.poster_path)} alt={movie.title} className={compact ? 'poster compact' : 'poster'} />
      <div className="cardBody">
        <h3>{movie.title}</h3>
        <p>{movie.release_date?.slice(0, 4) || 'Année inconnue'}</p>
        <span>⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
      </div>
    </article>
  );
}

function MovieModal({ movie, credits, loading, onClose, onPersonClick }) {
  return (
    <div className="modalOverlay" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="modal" onClick={(e) => e.stopPropagation()}>
        <img src={poster(movie.poster_path)} alt={movie.title} className="modalHero" />
        <div className="modalContent">
          <h2>{movie.title}</h2>
          <p className="muted">Sortie : {movie.release_date || 'Inconnue'} • ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</p>
          <p>{movie.overview || 'Aucun synopsis disponible pour ce film.'}</p>

          <h3>Réalisateur</h3>
          {loading ? <p className="muted">Chargement...</p> : credits.directors?.length ? (
            <div className="peopleRow">
              {credits.directors.map((director) => (
                <button key={director.id} className="personChip" onClick={() => onPersonClick(director, 'crew')}>
                  <img src={profile(director.profile_path)} alt={director.name} />
                  <span>{director.name}</span>
                </button>
              ))}
            </div>
          ) : <p className="muted">Aucun réalisateur disponible.</p>}

          <h3>Acteurs</h3>
          {loading ? <p className="muted">Chargement...</p> : credits.cast?.length ? (
            <div className="castGrid customScroll">
              {credits.cast.map((actor) => (
                <button key={actor.cast_id || actor.id} className="actorCard" onClick={() => onPersonClick(actor, 'cast')}>
                  <img src={profile(actor.profile_path)} alt={actor.name} />
                  <strong>{actor.name}</strong>
                  <small>{actor.character || 'Rôle inconnu'}</small>
                </button>
              ))}
            </div>
          ) : <p className="muted">Aucun casting disponible.</p>}

          <button className="closeButton" onClick={onClose}>Fermer</button>
        </div>
      </motion.div>
    </div>
  );
}
