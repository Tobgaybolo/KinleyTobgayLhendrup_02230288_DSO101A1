# Assignment I: To-Do App Deployment with CI/CD

## Objective
This report demonstrates practical implementation of DevOps workflows, including:

- Building a full-stack To-Do application
- Containerizing the application using Docker
- Deploying services to Render.com
- Automating image builds and deployments via GitHub CI/CD pipelines

## Step 0: Basic Full-Stack Web App

### Tech Stack
- Frontend: React
- Backend: Node.js with Express
- Database: PostgreSQL

### Environment Configuration

**Backend `.env`**

```bash
DATABASE_URL=postgresql://kinley_bolo:@localhost:5432/todo_db
```

**Frontend `.env`**

```bash
REACT_APP_API_URL=http://localhost:5000
```

### Local Testing
Run `npm i` and `npm start` in both backend and todo-frontend directories.

Data flows from frontend to backend and is stored in the PostgreSQL database.

`.env` files are listed in `.gitignore`.

## Part A: Dockerizing and Pushing to Docker Hub

### Docker Build
Dockerfiles were created for both frontend and backend.

Images were tagged using the student ID.

**Sample Backend Dockerfile**

![alt text](<image ass1/Screenshot 2026-05-10 at 11.26.13 PM.png>)

**Sample Frontend Dockerfile**
![alt text](<image ass1/Screenshot 2026-05-10 at 11.27.57 PM.png>)
### Docker Push

```bash
docker build -t tobgaybolo/be-todo-02230288:02230288.
docker push tobgaybolo/be-todo-02230288:02230288

docker build -t tobgaybolo/fe-todo-02230288:02230288.
docker push tobgaybolo/fe-todo-02230288:02230288.
```

## Part A: Deploying to Render

### Backend Web Service
Create a Web Service and then select **Existing image from Docker Hub**.

- Image: `tobgaybolo/be-todo-02230288:02230288`
![alt text](<image ass1/Screenshot 2026-05-24 at 8.15.49 PM.png>)
- Create a Postgres database on render.com
![alt text](<image ass1/Screenshot 2026-05-24 at 8.18.10 PM.png>)
![alt text](<image ass1/Screenshot 2026-05-24 at 8.24.51 PM.png>)
### Environment Variables on Render.com

```env
DB_HOST=dpg-d8105u0sfn5c73batm60-a.singapore-postgres.render.com
DB_USER=kinley_bolo
DB_PASSWORD=wyQL9714OgJe78Dsun3eRnxSIYBQL30q
DB_NAME=todo_app
DB_PORT=5432
PORT=5000
```

### Frontend Web Service
Create a Web Service and then select **Existing image from Docker Hub**.

- Image: `tobgaybolo/fe-todo-02230288:02230288`
![alt text](<image ass1/Screenshot 2026-05-24 at 8.28.38 PM.png>)
### Frontend Environment Variable

```env
REACT_APP_API_URL=https://be-todo-ydis.onrender.com
```

## Part B: CI/CD with GitHub + Render

### Updated Structure

```text
todo-app/
  ├── frontend/
  │   └── Dockerfile
  ├── backend/
  │   └── Dockerfile
  └── render.yaml
```

### render.yaml

```yaml
services:
  - type: web
    name: backend-todo
    env: docker
    dockerfilePath: ./backend/Dockerfile
    envVars:
      - key: DATABASE_URL
        value: https://be-todo-ydis.onrender.com
      - key: PORT
        value: 5000

  - type: web
    name: frontend-todo
    env: docker
    dockerfilePath: ./frontend/Dockerfile
    envVars:
      - key: REACT_APP_API_URL
        value: https://fe-todo-scue.onrender.com
```

### Challenges Faced
Part B of this assignment, which is to deploy directly from a Git repository with a multi-service Docker setup, was not completed because Render blueprints require a subscription.

## Conclusion
This assignment demonstrated how to:

- Build a full-stack app using modern frameworks
- Use Docker for packaging applications
- Deploy and manage services using Render
- Automate deployments using CI/CD from GitHub

These practices are foundational for modern DevOps and cloud-native workflows.

# Assignment II: CI/CD Pipeline with Jenkins

## Objective
This assignment involved configuring a Jenkins pipeline to automate the build, test, and deployment of a Node.js-based to-do list application. The CI/CD workflow ensures seamless code integration, testing, and deployment using Jenkins, GitHub, Node.js, and optionally Docker.

## Pipeline Stages Implemented
The Jenkins pipeline includes the following stages:

1. Checkout – Clones the GitHub repository.
2. Install – Installs all Node.js dependencies using npm install.
3. Build – Builds the project (optional for basic Node.js apps).
4. Test – Runs unit tests using Jest with JUnit report generation.
5. Deploy – Builds and pushes a Docker image to Docker Hub.

## Setup Instructions
### Jenkins Configuration
- Installed Jenkins locally and accessed it via

- Installed required plugins:

  - NodeJS Plugin

  - Pipeline

  - GitHub Integration

  - Docker Pipeline

- Configured Node.js under Manage Jenkins > Tools > NodeJS

- Added GitHub credentials using a Personal Access Token.

### GitHub
- Repository: [KinleyTobgayLhendrup_02230288_DSO101](https://github.com/Tobgaybolo/KinleyTobgayLhendrup_02230288_DSO101)

- Added Jenkinsfile in the root directory.

### Testing
- Installed Jest and Jest JUnit Reporter:
```npm install --save-dev jest jest-junit```
- Added the following scripts to package.json:```
"scripts": {
"test": "jest --ci --reporters=default --reporters=jest-junit"
}```
## Screenshots
Created a GitHub Personal Access Token (PAT) with repo and admin:repo_hook permissions  
![alt text](<image ass2/Screenshot 2026-05-06 at 12.17.17 PM.png>)![alt text](<image ass2/Screenshot 2026-05-06 at 12.17.36 PM.png>) 

Added GitHub credentials in Jenkins (Manage Jenkins > Credentials > Node > Add) 
![alt text](<image ass2/Screenshot 2026-05-11 at 12.50.02 AM.png>)

Create a Jenkinsfile in your root directory
![alt text](<image ass2/Screenshot 2026-05-13 at 9.09.31 AM.png>)

Ran the following commands for both frontend and backend
```
npm install --save-dev jest-junit
```
Created a new Jenkins Pipeline item

- Pipeline script from SCM (Git)
- Provided the repository URL and credentials
- Set the script path to "jenkinsfile"
- Built and monitored the pipeline execution  
![alt text](<image ass2/Screenshot 2026-05-06 at 3.00.45 PM.png>)
![alt text](<image ass2/Screenshot 2026-05-06 at 3.03.02 PM.png>)
![alt text](<image ass2/Screenshot 2026-05-11 at 12.49.31 AM.png>)

Images were then created in DockerHub 
![alt text](<image ass2/Screenshot 2026-05-19 at 2.33.16 PM.png>)

## Challenges Faced

1. Test Report Not Showing in Jenkins The test results weren’t showing under Jenkins initially. Fixed it by ensuring the jest-junit reporter was configured correctly and naming the result file as junit.xml.

2. Docker Authentication Jenkins failed to push the Docker image due to missing credentials. Solved by adding Docker Hub credentials in Jenkins and referencing the correct ID in the Jenkinsfile. 
![alt text](<image ass2/Screenshot 2026-05-24 at 6.54.53 PM.png>)

3. Jenkins pipeline failed at the Install stage due to a missing package.json file (ENOENT error). The file was not found in the expected workspace directory. Verified the correct repository path and ensured package.json was committed and located properly.  
![alt text](<image ass2/Screenshot 2026-05-24 at 6.59.13 PM.png>)

Build #8 succeeded, confirming the issue was fixed. 
![alt text](<image ass2/Screenshot 2026-05-24 at 7.00.39 PM.png>)

## Conculsion
- Set up CI/CD pipeline using Jenkins.
- Automated code checkout, install, test, and deploy.
- Faced multiple build failures initially.
- Fixed issues by updating package.json and test scripts.
- Final build succeeded with passing tests.

# Assignment III: TODO App CI/CD Deployment with GitHub Actions

## Objective
This project is a CI/CD assignment that demonstrates building and deploying a full-stack TODO application using Docker, GitHub Actions, DockerHub, and Render.com.

The application is split into:

- backend/ – Node.js (Express) server
- frontend/ – React application

The pipeline builds Docker images for both services and pushes them to DockerHub. Deployments are then triggered on Render.com using deploy webhooks, all automated via GitHub Actions.

## Steps Followed

### 1. Project Structure Verification
- Ensured both backend/ and frontend/ directories contained a valid package.json with necessary scripts
- Verified the repository was set to public
- Confirmed Dockerfiles were correctly placed and structured for both services

### 2. Set Up GitHub Actions Workflow
Created `.github/workflows/main.yml` to automate:

- Docker login
- Build and push for backend and frontend
- Webhook deployment to Render
![alt text](<image ass3/Screenshot 2026-05-11 at 9.49.09 PM.png>)
### 3. Configured GitHub Secrets
Added the following secrets under Settings → Secrets and Variables → Actions, not Codespaces:

- DOCKERHUB_USERNAME: Dockerhub Username
- DOCKERHUB_TOKEN: Personal Access Token from Dockerhub
- RENDER_BACKEND_WEBHOOK_URL
- RENDER_FRONTEND_WEBHOOK_URL
![alt text](<image ass3/Screenshot 2026-05-11 at 10.18.46 PM.png>)
![alt text](<image ass3/Screenshot 2026-05-11 at 9.53.27 PM.png>)

### 4. Configured Render Deploy Hooks
- Created two services on Render, backend and frontend
- Enabled deploy webhooks
- Used those URLs in GitHub secrets
![alt text](<image ass3/Screenshot 2026-05-11 at 10.30.52 PM.png>)
![alt text](<image ass3/Screenshot 2026-05-11 at 10.30.30 PM.png>)
### 5. Triggered Deployment
Final push to the main branch ran the full CI/CD pipeline successfully:

- Images built and pushed
- Render deployment triggered
![alt text](<image ass3/Screenshot 2026-05-11 at 11.02.42 PM.png>)
- Verified that it deployed via Deploy Hook
![alt text](<image ass3/Screenshot 2026-05-11 at 11.05.22 PM.png>)
## Challenges Faced
### DockerHub login failure in GitHub Actions
I encountered an error during the DockerHub login step in GitHub Actions:

```text
Error: Username and password required
```

The issue occurred because I accidentally added the secrets under Secrets and variables → Codespaces instead of Actions. After moving the secrets to Actions scope, the login worked as expected.

## Conclusion
This part of the assignment helped reinforce practical understanding of CI/CD workflows using Docker, GitHub Actions, and Render. It covered:

- Dockerizing both frontend and backend
- Setting up automated builds and deployment pipelines

Everything now works as expected with every push to the main branch automatically building and deploying the app.