import { useEffect, useState } from 'react'

const API_URL = 'https://picsum.photos/v2/list?limit=30'

export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadPhotos() {
      try {
        const response = await fetch(API_URL, { signal: controller.signal })
        if (!response.ok) throw new Error(`The server returned ${response.status}.`)

        const data = await response.json()
        if (!Array.isArray(data)) throw new Error('The photo service returned an invalid response.')

        setPhotos(data.filter((photo) => photo?.id && photo?.author && photo?.download_url))
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Unable to load photos. Please try again.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadPhotos()
    return () => controller.abort()
  }, [])

  return { photos, loading, error }
}
