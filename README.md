# KinleyTobgayLhendrup_02230288_DSO101_A1

This submission implements a full to-do app under one repository using:
- Frontend: React with Next.js
- Backend: Express.js
- Database: PostgreSQL
- Deployment: Docker Hub + Render

## Repository Structure

```text
todo-app/
  frontend/
    app/
    components/
    Dockerfile
    .env.local.example
    .env.production
  backend/
    server.js
    db.js
    Dockerfile
    .env.example
    .env.production
  render.yaml
  .gitignore
```

## Part 0: Local Setup (Prerequisite)

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend expected environment variables in `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=todo_app
DB_SSL=false
PORT=5000
```

### 2. Frontend setup

```bash
cd ../frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend expected environment variables in `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
REACT_APP_API_URL=http://localhost:5000
```

Open the frontend at `http://localhost:3000`.

## Run With Docker Desktop (Local Full Stack)

From the `todo-app` folder:

```bash
docker compose up --build
```

This starts 3 containers:
- `todo-db` (PostgreSQL, internal Docker network)
- `todo-backend` (Express API) on `localhost:5001`
- `todo-frontend` (Next.js app) on `localhost:3000`

Open `http://localhost:3000` in your browser.

Run frontend only with Docker Compose:

```bash
cd frontend
docker compose -f docker-compose.yml up --build
```

Useful commands:

```bash
# Start in background
docker compose up --build -d

# See logs
docker compose logs -f

# Stop all containers
docker compose down

# Stop and remove database volume (clean reset)
docker compose down -v
```

## API Endpoints

- `GET /health`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

Sample create payload:

```json
{
  "title": "Do assignment",
  "description": "Part A and B",
  "completed": false
}
```

## Part A: Build and Push Docker Images

Use your student ID as the tag.

### Backend image

```bash
cd backend
docker build -t yourdockerhub/be-todo:02230288 .
docker push yourdockerhub/be-todo:02230288
```

### Frontend image

```bash
cd ../frontend
docker build -t yourdockerhub/fe-todo:02230288 .
docker push yourdockerhub/fe-todo:02230288
```

### Render Manual Deploy (Existing image from Docker Hub)

1. Create Backend Web Service from `yourdockerhub/be-todo:02230288`
2. Add backend env vars on Render:
   - `DB_HOST`
   - `DB_PORT=5432`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `DB_SSL=true`
   - `PORT=5000`
3. Create Frontend Web Service from `yourdockerhub/fe-todo:02230288`
4. Add frontend env vars:
   - `NEXT_PUBLIC_API_URL=https://be-todo.onrender.com`
   - `REACT_APP_API_URL=https://be-todo.onrender.com`

## Part B: Automated Build and Deployment with `render.yaml`

This repository includes a `render.yaml` blueprint that defines both services.

### Deploy steps

1. Push this repo to GitHub.
2. In Render, choose **Blueprint** and connect the GitHub repo.
3. Render reads `render.yaml` and creates both services.
4. Every new commit to GitHub triggers a fresh image build and deploy.

## Evidence for Submission (README Requirement)

Add screenshots under a `screenshots/` folder and reference them here:

1. Local app running (frontend + backend)
2. Docker build and push logs for both services
3. Docker Hub repositories with `02230288` tags
4. Render backend service env vars and successful deploy
5. Render frontend service env vars and successful deploy
6. Render blueprint deployment and auto-redeploy after a new commit

## Notes

- `.env` files are ignored by `.gitignore`.
- Only `.env.example` and `.env.production` templates are committed.
- Backend auto-creates the `tasks` table at startup if it does not exist.
