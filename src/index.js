import { view, movie, elemsDOM } from './storage.js';

// export const elemsDOM = {
//   searchInput: document.getElementById('search-input'),
//   listTags: document.querySelector('[data-id="list_search_history"]'),
//   main: document.querySelector('[data-id="main"]'),
//   searchMovies: document.querySelector('[data-id="search_movies"]'),
//   searchResults: document.querySelector('[data-id="search_results"]'),
//   searchTitle: document.querySelector('[data-id="search_title_live"]'),
// };

// event
elemsDOM.searchInput.onkeydown = async (event) => {
  if (event.code !== 'Enter' || elemsDOM.searchInput.value === '') return;

  await livePage(elemsDOM.searchInput.value);

  view.addTag(elemsDOM.searchInput.value);
  elemsDOM.searchInput.value = '';
};

async function oneClick(event) {
  if (event.target.dataset.id !== undefined) return;

  await livePage(event.target.innerText);

  view.swapTags(event.target);
}

function doubleClick(event) {
  view.removeTag(event.target);
  movie.clearCacheFromTag(event.target.innerText);
}

function createClicker(clickFn = oneClick, dblClickFn = doubleClick) {
  let timer;

  return function(event) {
    const context = this;

    if (timer) {
      clearTimeout(timer);
      dblClickFn.call(context, event);
      timer = null;
      return;
    }

    timer = setTimeout(
      function(ctx) {
        timer = null;
        clickFn.call(ctx, event);
      },
      250,
      context
    );
  };
}

elemsDOM.listTags.onclick = createClicker();

// helpers
async function livePage(request) {
  const setVisibleBlocks = (valueTitle, valueMovies) => {
    elemsDOM.searchTitle.style.display = valueTitle;
    elemsDOM.searchMovies.style.display = valueMovies;
  };
  const spinner = document.createElement('div');

  spinner.classList.add('spinner');
  elemsDOM.searchResults.insertAdjacentElement('afterbegin', spinner);
  setVisibleBlocks('none', 'none');

  elemsDOM.main.classList.add('search_more_history', 'search_live');

  await movie.makeRequest(request);
  view.createMoviesCard(movie);

  elemsDOM.searchResults.removeChild(spinner);
  setVisibleBlocks('block', 'grid');
}
