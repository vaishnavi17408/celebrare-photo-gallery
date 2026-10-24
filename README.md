# Celebrare Photo Gallery

A React + Vite photo gallery built for the Celebrare Frontend React Internship assignment. It uses Tailwind CSS and the Picsum Photos API.

## Install and run

In **Windows Command Prompt**, open this project folder and run:

```cmd
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). Create a production build with:

```cmd
npm run build
```

## Features

- Fetches 30 photos from the required Picsum endpoint when the gallery loads.
- Shows loading, error, empty-gallery, and no-search-results states.
- Filters the already-fetched photos by author name, case-insensitively.
- Uses a one-column mobile grid, two-column tablet grid, and four-column desktop grid.
- Adds and removes favourites, preserving favourite IDs in browser localStorage.
- Uses image alt text, labelled favourite buttons, and keyboard focus styles.

## Important files

- `src/hooks/useFetchPhotos.js`: custom hook that fetches the API data.
- `src/components/Gallery.jsx`: gallery UI, reducer, search, and memoized results.
- `src/App.jsx`: renders the Gallery component.
