import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import useFetchPhotos from '../hooks/useFetchPhotos'

const STORAGE_KEY = 'photo-gallery-favorites'

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(saved) && saved.every((id) => typeof id === 'string') ? saved : []
  } catch {
    return []
  }
}

function favoritesReducer(favorites, action) {
  if (action.type !== 'toggle') return favorites
  return favorites.includes(action.photoId)
    ? favorites.filter((id) => id !== action.photoId)
    : [...favorites, action.photoId]
}

function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.9-8.6a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  )
}

function PhotoCard({ photo, isFavorite, onToggleFavorite }) {
  const [hasImageError, setHasImageError] = useState(false)

  return (
    <article className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
        {hasImageError ? (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-600">This image could not be loaded.</div>
        ) : (
          <img src={photo.download_url} alt={`Photograph by ${photo.author}`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" onError={() => setHasImageError(true)} />
        )}
        <button
          type="button"
          onClick={() => onToggleFavorite(photo.id)}
          aria-label={isFavorite ? `Remove ${photo.author}'s photo from favorites` : `Add ${photo.author}'s photo to favorites`}
          aria-pressed={isFavorite}
          className={`absolute right-3 top-3 rounded-full p-2 shadow-md transition ${isFavorite ? 'bg-rose-500 text-white' : 'bg-white/95 text-slate-700 hover:bg-white'}`}
        >
          <HeartIcon filled={isFavorite} />
        </button>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="truncate text-sm font-semibold text-slate-800">{photo.author}</p>
        <span className="shrink-0 text-xs text-slate-500">Photo #{photo.id}</span>
      </div>
    </article>
  )
}

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos()
  const [favorites, dispatch] = useReducer(favoritesReducer, [], readFavorites)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // The gallery continues to work for this session if storage is unavailable.
    }
  }, [favorites])

  const handleSearch = useCallback((event) => {
    setSearchQuery(event.target.value)
  }, [])

  const filteredPhotos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return query ? photos.filter((photo) => photo.author.toLowerCase().includes(query)) : photos
  }, [photos, searchQuery])

  const toggleFavorite = useCallback((photoId) => {
    dispatch({ type: 'toggle', photoId })
  }, [])

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Celebrare Assignment</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Photo Gallery</h1>
            <p className="mt-2 text-slate-600">A curated collection from the Picsum Photos API.</p>
          </div>
          {!loading && !error && <p className="text-sm text-slate-500">{photos.length} photos / {favorites.length} saved</p>}
        </header>

        {!loading && !error && (
          <label className="mb-8 block max-w-md">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Search by photographer</span>
            <input type="search" value={searchQuery} onChange={handleSearch} placeholder="Enter an author name" className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200" />
          </label>
        )}

        {loading && <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-slate-600" role="status"><span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" aria-hidden="true" /><p>Loading photos...</p></div>}
        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800"><h2 className="font-semibold">We could not load the photo gallery.</h2><p className="mt-1 text-sm">{error}</p></div>}
        {!loading && !error && photos.length === 0 && <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">No photos are available right now. Please refresh the page and try again.</div>}
        {!loading && !error && photos.length > 0 && filteredPhotos.length === 0 && <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">No photos match &quot;{searchQuery}&quot;. Try another author name.</div>}

        {!loading && !error && filteredPhotos.length > 0 && (
          <section aria-label="Photo gallery" className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {filteredPhotos.map((photo) => <PhotoCard key={photo.id} photo={photo} isFavorite={favorites.includes(photo.id)} onToggleFavorite={toggleFavorite} />)}
          </section>
        )}
      </div>
    </main>
  )
}
