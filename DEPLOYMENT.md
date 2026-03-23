# Todo App - Part B Deployment Guide

## Overview
This is a full-stack Todo Application with automated CI/CD deployment to Render using Docker.

## Project Structure
```
todo-app/
├── frontend/                 # Next.js React frontend
│   ├── Dockerfile           # Multi-stage build for Next.js
│   ├── .env.production      # Production environment variables
│   ├── package.json
│   ├── next.config.js
│   ├── app/                 # Next.js app directory
│   └── components/          # React components
├── backend/                 # Express.js API backend
│   ├── Dockerfile           # Node.js production image
│   ├── .env.production      # Production environment variables
│   ├── server.js            # Express application
│   ├── db.js                # PostgreSQL connection
│   └── package.json
├── render.yaml              # Render Blueprint Configuration
└── docker-compose.yml       # Local development setup
```

## Deployment Architecture

### Services
1. **be-todo** (Backend)
   - Express.js server (Port 5000)
   - PostgreSQL database integration
   - REST API for todo operations

2. **fe-todo** (Frontend)
   - Next.js application (Port 3000)
   - Connected to backend via `https://be-todo.onrender.com`

3. **todo-db** (Database)
   - PostgreSQL database
   - Automatically provisioned by Render

## Deployment Steps

### 1. Push to GitHub
First, initialize and push your repository to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: Todo App with Docker setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/todo-app.git
git push -u origin main
```

### 2. Connect to Render

1. Go to https://render.com
2. Sign up or log in with your GitHub account
3. Click **"New +"** → **"Blueprint"**
4. Select your GitHub repository
5. Authorize Render to access your GitHub account
6. Render will automatically detect `render.yaml` and display the configuration

### 3. Review Configuration

The `render.yaml` file configures:

**Databases:**
- `todo-db`: PostgreSQL with automatic environment variable mapping

**Services:**

**Backend (be-todo):**
```yaml
- type: web
  name: be-todo
  env: docker
  dockerContext: ./backend
  dockerfilePath: ./backend/Dockerfile
  envVars:
    - DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME (from database)
    - DATABASE_URL (connection string)
    - DB_SSL: true
    - PORT: 5000
```

**Frontend (fe-todo):**
```yaml
- type: web
  name: fe-todo
  env: docker
  dockerContext: ./frontend
  dockerfilePath: ./frontend/Dockerfile
  envVars:
    - NEXT_PUBLIC_API_URL: https://be-todo.onrender.com
    - NODE_ENV: production
```

### 4. Deploy

1. Click **"Create Blueprint"**
2. Render will:
   - Build Docker images for both services
   - Create the PostgreSQL database
   - Deploy both services
   - Assign unique URLs

3. Deployment will be complete when you see green checkmarks for all services

## Automatic Deployments

Every time you push code to your GitHub repository:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render will automatically:
1. Detect the new commit
2. Build new Docker images
3. Run migrations/setup
4. Deploy the updated services
5. Zero downtime updates

## Environment Variables

### Backend (.env.production)
```
NODE_ENV=production
DB_SSL=true
PORT=5000
# DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DATABASE_URL
# are injected by Render from the database service
```

### Frontend (.env.production)
```
NEXT_PUBLIC_API_URL=https://be-todo.onrender.com
```

## Local Development

For local development with Docker Compose:

```bash
docker-compose up -d
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:5000
- PostgreSQL database on localhost:5432

## Accessing Your Deployment

After successful deployment, you'll get URLs like:
- **Frontend**: https://fe-todo.onrender.com
- **Backend**: https://be-todo.onrender.com
- **Health Check**: https://be-todo.onrender.com/health

## Troubleshooting

### Build Failures
Check the build logs in Render dashboard:
1. Go to your Blueprint details
2. Click on the failing service
3. View the "Build" tab for detailed logs

### Database Connection Issues
- Verify `DB_SSL=true` is set
- Check that database credentials are correctly injected
- Ensure backend is waiting for database to be ready

### Frontend Can't Reach Backend
- Confirm `NEXT_PUBLIC_API_URL` points to correct backend service
- Check backend service status is "Live"
- Review browser console for CORS errors

### Redeploy Manually
Without code changes, redeploy by:
1. Clicking **"Manual Deploy"** in the service settings
2. Or pushing an empty commit: `git commit --allow-empty -m "Redeploy"`

## Dockerfile Details

### Backend Dockerfile
- Uses `node:18-alpine` for small image size
- Installs dependencies from `package.json`
- Exposes port 5000
- Runs `node server.js`

### Frontend Dockerfile
- **Multi-stage build** for optimized production image
- Stage 1 (deps): Install dependencies
- Stage 2 (builder): Build Next.js application
- Stage 3 (runner): Production runtime with only necessary files
- Exposes port 3000
- Runs `npm run start`

## API Endpoints

### Health Check
```
GET /health
```

### Get All Tasks
```
GET /api/tasks
```

### Create Task
```
POST /api/tasks
Body: { title: string, description?: string }
```

### Update Task
```
PUT /api/tasks/:id
Body: { title?: string, description?: string, completed?: boolean }
```

### Delete Task
```
DELETE /api/tasks/:id
```

## Security Notes

- Database credentials are automatically managed by Render
- SSL connections are enforced (`DB_SSL=true`)
- Environment variables are encrypted by Render
- Never commit `.env.production` with real credentials
- Frontend uses `NEXT_PUBLIC_` prefix (safe to expose client-side)

## Support

For Render documentation: https://render.com/docs/blueprint-spec
For Next.js docs: https://nextjs.org/docs
For Express docs: https://expressjs.com
