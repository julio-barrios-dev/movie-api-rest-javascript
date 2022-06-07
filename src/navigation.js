let maxPage
let page = 1
let infinityScroll

searchFormBtn.addEventListener('click', () => {
  location.hash = `#search=${searchFormInput.value}`
})
trendingBtn.addEventListener('click', () => {
  location.hash = '#trends'
})
const historyArr = []
arrowBtn.addEventListener('click', () => {
  if (historyArr.length > 1) {
    location.hash = historyArr[historyArr.length - 2]
    historyArr.splice(-2,2)
  } else {
    historyArr.pop()
    location.hash = '#home'
  }
})

window.addEventListener('load', navigator, false)
window.addEventListener('hashchange', navigator, false)

function navigator() {
  if (infinityScroll) {
    window.removeEventListener('scroll', infinityScroll, {
      passive: false
    })
    infinityScroll = undefined
  }


  if (location.hash.startsWith('#trends')) {
    trendsPage()
    historyArr.push(location.hash)
  } else if (location.hash.startsWith('#search=')) {
    searchPage()
    historyArr.push(location.hash)
  } else if (location.hash.startsWith('#movie=')) {
    movieDetailPage()
    historyArr.push(location.hash)
  } else if (location.hash.startsWith('#category=')) {
    categoryPage()
    historyArr.push(location.hash)
  } else {
    homePage()
  }

  window.scrollTo(0, 0)

  if (infinityScroll) {
    window.addEventListener('scroll', infinityScroll)
  }
}

function homePage() {

  headerSection.classList.remove('header-container--long')
  headerSection.style.background = ''
  arrowBtn.classList.add('inactive')
  headerTitle.classList.remove('inactive')
  headerCategoryTitle.classList.add('inactive')
  searchForm.classList.remove('inactive')

  trendingPreviewSection.classList.remove('inactive')
  categoriesPreviewSection.classList.remove('inactive')
  likedMovieSection.classList.remove('inactive')
  genericSection.classList.add('inactive')
  movieDetailSection.classList.add('inactive')

  getTrendingMoviesPreview()
  getCategoriesPreview()
  getLikedMovies()
}
function searchPage() {
  
  headerSection.classList.remove('header-container--long')
  headerSection.style.background = ''
  arrowBtn.classList.remove('inactive')
  arrowBtn.classList.remove('header-arrow--white')
  headerTitle.classList.add('inactive')
  headerCategoryTitle.classList.add('inactive')
  searchForm.classList.remove('inactive')
  
  trendingPreviewSection.classList.add('inactive')
  categoriesPreviewSection.classList.add('inactive')
  likedMovieSection.classList.add('inactive')
  genericSection.classList.remove('inactive')
  movieDetailSection.classList.add('inactive')

  const [_, query] = location.hash.split('=')
  getMoviesBySearch(query)
  infinityScroll = getPaginatedMoviesBySearch(query)
}
function movieDetailPage() {
  headerSection.classList.add('header-container--long')
  // headerSection.style.background = ''
  arrowBtn.classList.remove('inactive')
  arrowBtn.classList.add('header-arrow--white')
  headerTitle.classList.add('inactive')
  headerCategoryTitle.classList.add('inactive')
  searchForm.classList.add('inactive')

  trendingPreviewSection.classList.add('inactive')
  categoriesPreviewSection.classList.add('inactive')
  likedMovieSection.classList.add('inactive')
  genericSection.classList.add('inactive')
  movieDetailSection.classList.remove('inactive')

  const [_, movieId] = location.hash.split('=')
  getMovieById(movieId)
}
function categoryPage() {

  headerSection.classList.remove('header-container--long')
  headerSection.style.background = ''
  arrowBtn.classList.remove('inactive')
  arrowBtn.classList.remove('header-arrow--white')
  headerTitle.classList.add('inactive')
  headerCategoryTitle.classList.remove('inactive')
  searchForm.classList.add('inactive')

  trendingPreviewSection.classList.add('inactive')
  categoriesPreviewSection.classList.add('inactive')
  likedMovieSection.classList.add('inactive')
  genericSection.classList.remove('inactive')
  movieDetailSection.classList.add('inactive')

  const [_, categoryData] = location.hash.split('=')
  const [categoryId, categoryName] = categoryData.split('-') 

  headerCategoryTitle.innerHTML = categoryName

  getMoviesByCategory(categoryId)
  infinityScroll = getPaginatedMoviesById(categoryId)
}
function trendsPage() {
  headerSection.classList.remove('header-container--long')
  headerSection.style.background = ''
  arrowBtn.classList.remove('inactive')
  arrowBtn.classList.remove('header-arrow--white')
  headerTitle.classList.add('inactive')
  headerCategoryTitle.classList.remove('inactive')
  headerCategoryTitle.innerHTML = 'Tendencias'
  searchForm.classList.add('inactive')
  
  trendingPreviewSection.classList.add('inactive')
  categoriesPreviewSection.classList.add('inactive')
  likedMovieSection.classList.add('inactive')
  genericSection.classList.remove('inactive')
  movieDetailSection.classList.add('inactive')

  getTrendingMovies()

  infinityScroll = getPaginatedTrendingMovies
}
