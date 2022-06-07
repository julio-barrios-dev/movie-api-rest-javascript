//Data

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    'Content-type': 'application/json;charset=utf-8',
  },
  params: {
    'api_key': API_KEY
  },
})

function likedMovieList() {
  const item = JSON.parse(localStorage.getItem('liked_movies'))
  let movies;

  if (item) {
    movies = item;
  } else {
    movies = {}
  }
  return movies
}

function likeMovie(movie) {

  const likedMovies = likedMovieList() 

  if (likedMovies[movie.id]) {
    likedMovies[movie.id] = undefined
  } else {
    likedMovies[movie.id] = movie
  }

  localStorage.setItem('liked_movies', JSON.stringify(likedMovies))
}

// Utils

const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute('data-img')
      entry.target.setAttribute('src', url)
    }
  })
})

function createMovies(movies, container,{ lazyLoad = false, clean = true}= {}) {
  if (clean) {
    container.innerHTML = ''
  }

  movies.forEach(movie => {
    const movieContainer = document.createElement('div')
    movieContainer.classList.add('movie-container')
    
    const movieImg = document.createElement('img')
    movieImg.classList.add('movie-img')
    movieImg.addEventListener('click', () => {
      location.hash = `#movie=${movie.id}`
    })
    movieImg.setAttribute('Alt', movie.title)
    movieImg.setAttribute(
      lazyLoad ? 'data-img' : 'src', 
      `https://image.tmdb.org/t/p/w300/${movie.poster_path}`)
      
      movieImg.addEventListener('error', () => {
        movieImg.setAttribute(
          'src',
          'https://static.platzi.com/static/images/error/img404.png'

        )
      })

      const movieBtn = document.createElement('button')
      movieBtn.classList.add('movie-btn')
      likedMovieList()[movie.id] && movieBtn.classList.add('movie-btn--liked')
      movieBtn.addEventListener('click', () => {
        movieBtn.classList.toggle('movie-btn--liked')
        likeMovie(movie)
        getLikedMovies()
        getTrendingMoviesPreview()
      })

      if (lazyLoad) {
      lazyLoader.observe(movieImg)
    }

    movieContainer.appendChild(movieImg)
    movieContainer.appendChild(movieBtn)
    container.appendChild(movieContainer)
  })
}

function createCategories(categories, container) {
  
  container.innerHTML = ''

  categories.forEach(category => {
    const categorieContainer = document.createElement('div')
    categorieContainer.classList.add('category-container')

    const categoryTitle = document.createElement('h3')
    categoryTitle.setAttribute('id', `id${category.id}`)
    categoryTitle.addEventListener('click', () => {
      location.hash = `#category=${category.id}-${category.name}`
    })

    categoryTitle.classList.add('category-title')
    const categoryTitleText = document.createTextNode(category.name)
    categoryTitle.appendChild(categoryTitleText)
    
    categorieContainer.appendChild(categoryTitle)
    container.appendChild(categorieContainer)
  })
}

// Llamados a la API

async function getTrendingMoviesPreview() {
  const { data } = await api('trending/movie/day')

  const movies = data.results

  createMovies(movies, trendingMoviesPreviewList, true)

}

async function getTrendingMovies() {
  const { data } = await api('trending/movie/day')

  const movies = data.results
  maxPage = data.total_pages

  createMovies(movies, genericSection, { lazyLoad: true, clean: true })
}

async function getPaginatedTrendingMovies() {
  const {
    scrollTop,
    scrollHeight, 
    clientHeight
  } = document.documentElement

  const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)

  const pageIsNotMax = page < maxPage

  if (scrollIsBottom && pageIsNotMax) {
    page++
    const { data } = await api('trending/movie/day', {
      params: {
        page,
      }
    }) 
    const movies = data.results

    createMovies(movies, genericSection, { lazyLoad: true, clean: false })
  }
}

async function getCategoriesPreview() {
  const { data } = await api('genre/movie/list')

  const categories = data.genres

  createCategories(categories, categoriesPreviewList)

}

async function getMoviesByCategory(id) {
  const { data } = await api('/discover/movie', {
    params: {
      'with_genres': id
    }
  })

  const movies = data.results
  maxPage = data.total_pages

  createMovies(movies, genericSection, { lazyLoad: true, clean: true })
}

function getPaginatedMoviesById(categoryId) {
  return async () => {
    const {
      scrollTop,
      scrollHeight, 
      clientHeight
    } = document.documentElement
  
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
  
    const pageIsNotMax = page < maxPage
    if (scrollIsBottom && pageIsNotMax) {
      page++
      const { data } = await api('/discover/movie', {
        params: {
          'with_genres': categoryId,
          page
        }
      }) 
      const movies = data.results
  
      createMovies(movies, genericSection, { lazyLoad: true, clean: false })
    }
  }
}

async function getMoviesBySearch(query) {
  const { data } = await api('/search/movie', {
    params: {
      query
    }
  })

  const movies = data.results
  maxPage = data.total_pages

  createMovies(movies, genericSection, { lazyLoad: true, clean: true })
}

function getPaginatedMoviesBySearch(query) {
  return async () => {
    const {
      scrollTop,
      scrollHeight, 
      clientHeight
    } = document.documentElement
  
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
  
    const pageIsNotMax = page < maxPage

    if (scrollIsBottom && pageIsNotMax) {
      page++
      const { data } = await api('/search/movie', {
        params: {
          query,
          page
        }
      }) 
      const movies = data.results
  
      createMovies(movies, genericSection, { lazyLoad: true, clean: false })
    }
  }
}

async function getMovieById(movieId) {
const { data: movie } = await api(`/movie/${movieId}`)

const movieImgUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`

headerSection.style.backgroundImage = `
  linear-gradient(180deg, 
    rgba(0, 0, 0, 0.35) 19.27%, 
    rgba(0, 0, 0, 0) 29.17%), 
    url(${movieImgUrl})` 

movieDetailTitle.textContent = movie.title
movieDetailDescription.textContent = movie.overview
movieDetailScore.textContent = movie.vote_average

createCategories(movie.genres, movieDetailCategoriesList)
getRelatedMoviesId(movieId)
}

async function getRelatedMoviesId(movieId) {
  const { data } = await api(`/movie/${movieId}/similar`)
  const relatedMovies = data.results

  createMovies(relatedMovies, relatedMoviesContainer)
  relatedMoviesContainer.scrollTo(0, 0)
}

function getLikedMovies() {
  const likedMovies = likedMovieList()
  const moviesArray = Object.values(likedMovies)

  createMovies(moviesArray, likedMovieListArticle, { lazyload: true, clean: true })
}
