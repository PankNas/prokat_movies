import { elemsDOM } from './storage.js';

export class View {
  constructor() {
    this.tagsValue = new Map();
  }

  addTag(text) {
    // text = text.toLowerCase().trim();
    text = text.trim();

    const curTag = this.tagsValue.get(text);

    if (curTag !== undefined) {
      this.swapTags(curTag);
      return;
    }

    this.insertTag(text);
  }

  insertTag(text) {
    const newTag = document.createElement('li');

    newTag.classList.add('search__history__box');
    newTag.innerText = text;

    elemsDOM.listTags.insertAdjacentElement('afterbegin', newTag);
    this.tagsValue.set(text, newTag);
  }

  showTags(tags) {
    tags.forEach((tag) => this.insertTag(tag));
  }

  swapTags(tag) {
    elemsDOM.listTags.removeChild(tag);
    elemsDOM.listTags.insertAdjacentElement('afterbegin', tag);
  }

  removeTag(itemTag) {
    elemsDOM.listTags.removeChild(itemTag);
    this.tagsValue.delete(itemTag.innerText);

    if (elemsDOM.listTags.children.length === 0) {
      elemsDOM.main.className = 'main';
    }
  }

  setTotalRes(text) {
    elemsDOM.searchTitle.innerText = text;
  }

  isError(curRequest) {
    if (
      curRequest === undefined ||
      curRequest.search.find((movie) => movie.poster === 'N/A')
    ) {
      this.setTotalRes('Something went wrong ¯\\_(ツ)_/¯');
      elemsDOM.main.classList.remove('search_scroll');
      return true;
    }

    return false;
  }

  createMoviesCard(movies) {
    const curRequest = movies.cache[movies.lastRequest];

    elemsDOM.searchMovies.innerHTML = '';

    if (this.isError(curRequest)) return;

    const title =
      curRequest.count > 0
        ? `Found ${curRequest.count} movies`
        : 'Too many results';

    this.setTotalRes(title);

    curRequest?.search.forEach((movie) => {
      const itemMovie = `<div class="search__results__movies__card search__results__movies__card_poster font_color_white">
          <img src="${
            movie.poster
          }" class="search__results__movies__card__img" alt="movie_img"/>

          <div class="search__results__movies__card__content">
            <img src="src/img/icon/finger_up.png" alt="rating_img" class="movies__card__rating__img"/>
            <p class="movies__card__rating__text">${movie.rating}</p>
            <h2 class="search__results__movies__card__title">
              ${movie.title}
            </h2>
            <p class="search__results__movies__card__desc">
              ${movie.genre} <span>${movie.year}</span>
            </p>
          </div>
        </div>`;

      elemsDOM.searchMovies.insertAdjacentHTML('beforeend', itemMovie);
    });

    this.isSplitState(curRequest);
  }

  isSplitState(curRequest) {
    if (curRequest?.search.length > 4) {
      elemsDOM.main.classList.add('search_scroll');
    } else {
      elemsDOM.main.classList.remove('search_scroll');
    }
  }
}
