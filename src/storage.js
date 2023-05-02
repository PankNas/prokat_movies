import { View } from './views.js';
import { Movies } from './movies.js';
// import { elemsDOM } from './index.js';

export let view;
export let movie;

export const elemsDOM = {
  searchInput: document.getElementById('search-input'),
  listTags: document.querySelector('[data-id="list_search_history"]'),
  main: document.querySelector('[data-id="main"]'),
  searchMovies: document.querySelector('[data-id="search_movies"]'),
  searchResults: document.querySelector('[data-id="search_results"]'),
  searchTitle: document.querySelector('[data-id="search_title_live"]'),
};

window.addEventListener('unload', () => {
  const saveToLocalStorage = (key, value) =>
    localStorage.setItem(key, JSON.stringify(value));

  saveToLocalStorage('states', elemsDOM.main.classList);
  saveToLocalStorage('cache', movie.cache);
  saveToLocalStorage('lastRequest', movie.lastRequest);
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadPage);
} else {
  loadPage();
}

function loadPage() {
  const loadFromLocalStorage = (key, defaultValue) => {
    const value = JSON.parse(localStorage.getItem(key));

    return value !== null && value !== undefined ? value : defaultValue;
  };

  view = new View();
  movie = new Movies(
    'https://www.omdbapi.com/?type=movie&apikey=e7bd3636&',
    loadFromLocalStorage('lastRequest', ''),
    loadFromLocalStorage('cache', {})
  );

  repairPage(loadFromLocalStorage('states', {}));
}

function repairPage(states) {
  const values = Object.values(states);

  if (values.length <= 1) return;

  elemsDOM.main.classList.add(...values);

  view.showTags(Object.keys(movie.cache));
  view.createMoviesCard(movie);
}
