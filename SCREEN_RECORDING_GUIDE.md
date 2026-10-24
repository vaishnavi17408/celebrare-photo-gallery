# Five-minute screen-recording guide

## 0:00–0:40 — Overview

Open the gallery. Explain that it is a React, Vite, and Tailwind application that loads 30 images from the required Picsum endpoint. Point out the responsive cards, search field, and favourite button.

## 0:40–1:30 — `useFetchPhotos`

Open `src/hooks/useFetchPhotos.js`. Explain that `useFetchPhotos` owns API work and returns `photos`, `loading`, and `error`. Its effect runs once on mount, checks the HTTP response, validates the data, and aborts an unfinished request. The Gallery component uses this hook instead of calling fetch directly.

## 1:30–2:20 — Search, `useCallback`, and `useMemo`

Open `src/components/Gallery.jsx`. `handleSearch` uses `useCallback` and updates the search text. `filteredPhotos` uses `useMemo` with `[photos, searchQuery]`, lowercasing both values for case-insensitive filtering without another API request.

## 2:20–3:20 — `useReducer` and localStorage

Show `favoritesReducer`. A `toggle` action adds a photo ID or removes it if it already exists. `useReducer` initializes via `readFavorites`, which safely handles invalid localStorage JSON and invalid values. A separate effect saves favourite IDs after every reducer change.

## 3:20–4:10 — Layout and feedback states

Point out the Tailwind grid classes: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`, which map to mobile, tablet, and desktop. Resize the browser. Then search for a name that has no matches to show the feedback message. Mention the loading, API-error, empty-data, and image-error handling.

## 4:10–5:00 — Finish

Favourite a photo and refresh to demonstrate localStorage persistence. Show `README.md` for installation and build commands, then summarize the required React hooks and API integration.
