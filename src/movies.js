export class Movies {
  constructor(api, lastRequest = '', cache = {}) {
    this.api = api;

    this.lastRequest = lastRequest;
    this.cache = cache;
  }

  async makeRequest(searchTerm) {
    this.lastRequest = searchTerm.toLowerCase().trim();

    if (this.cache[this.lastRequest] !== undefined) return;

    // const data = await fetch(this.api + 's=' + this.lastRequest).then((r) => r.json());
    const data = await fetch(`${this.api}s=${this.lastRequest}`)
      .then((r) => r.json())
      .then(async (json) => {
        const request = (url) => fetch(url).then((response) => response.json());

        const search = json.Search.map((movie) =>
          request(`${this.api}t=${movie.Title}`)
        );

        const infoMovies = await Promise.all(search);

        const res = { totalResults: infoMovies.length };

        res.search = infoMovies.map((movie) => ({
          poster: movie.Poster,
          title: movie.Title,
          year: movie.Year,
          genre: movie.Genre,
          rating: `${movie.imdbRating} / 10`,
        }));

        return res;
      })
      .catch((_) => ({
        totalResults: 0,
        search: [],
      }));

    this.cache[this.lastRequest] = {
      count: data.totalResults,
      search: data.search,
    };
  }

  clearCacheFromTag(tag) {
    delete this.cache[tag.toLowerCase()];
  }
}
