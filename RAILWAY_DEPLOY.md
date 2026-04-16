# Railway Deploy Notes

## Services

- `frontend`: repo root
- `backend`: `server` directory

## Frontend variables

```env
REACT_APP_API_URL=https://your-backend.up.railway.app
```

## Backend variables

```env
PORT=${{PORT}}
FRONTEND_URL=https://your-frontend.up.railway.app
DB_PATH=/data/db.json
```

`FRONTEND_URL` may contain multiple comma-separated domains if needed.

## Backend volume

Mount a Railway Volume to the backend service at:

```text
/data
```

This keeps `db.json` persistent across redeploys.

## Root directories

- frontend service root: `/`
- backend service root: `/server`
