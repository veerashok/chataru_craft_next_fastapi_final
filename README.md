
# Chataru Craft – Next.js + FastAPI (Railway-ready)

This project is split into:

- `backend/` – FastAPI (enquiries, products, admin login, image uploads)
- `frontend/` – Next.js App Router frontend (home, catalog, contact, admin)

## Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt

export DATABASE_URL=postgres://...
export ADMIN_PASSWORD=your-secret-password
export FRONTEND_ORIGIN=http://localhost:3000

uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend (Next.js)

```bash
cd frontend
npm install
# create .env.local with:
# NEXT_PUBLIC_API_BASE=http://localhost:8000
npm run dev
```

Then open http://localhost:3000

## Deploy to Railway

1. Push this folder to GitHub.

2. Create **Service 1: backend (Python)**

   - Root directory: `/backend`
   - Install command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port 8000`
   - Variables:
     - `DATABASE_URL` (from a Railway Postgres plugin)
     - `ADMIN_PASSWORD`
     - `FRONTEND_ORIGIN` = `https://<your-frontend-domain>`
   - Add a volume and mount it at `/app/uploads` if you want product images to persist.

3. Create **Service 2: frontend (Node / Next.js)**

   - Root directory: `/frontend`
   - Install command: `npm install`
   - Build command: `npm run build`
   - Start command: `npm start`
   - Variables:
     - `NEXT_PUBLIC_API_BASE` = URL of your backend service, e.g. `https://chataru-backend.up.railway.app`

4. Point your custom domain (e.g. `chatarucraft.com`) to the frontend service.

Admin panel is at `/admin` on the frontend, and it talks to FastAPI using cookie-based sessions.
