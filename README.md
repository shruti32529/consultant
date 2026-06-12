# Consultation  Manager

A candidate challenge solution for managing consultation recording metadata and notes.

## Stack

- Backend: Node.js + Express
- Frontend: React + Vite

## Features

- Add, edit, delete, and view consultation recordings
- Simple backend JSON storage
- Responsive frontend UI

## Run locally

### Backend

1. Open `backend`
2. Install dependencies: `npm install`
3. Start server: `npm start`
4. API will run at `http://localhost:4000`

### Frontend

1. Open `frontend`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. App will run at `http://localhost:5173`

## Notes

- This is a minimal sample implementation for evaluation.
- The backend stores recordings in `backend/data/recordings.json`.
- The frontend uses fetch requests against the backend API.

## Future improvements

- Add real file upload for recordings
- Add user authentication
- Replace JSON file storage with a database
- Add search, filters, and pagination
- Add automated tests
