# Job Portal Application

Full-stack job portal with React frontend and Node.js/Express backend.

## Features

### User (Job Seeker)
- Register and login
- Browse and search jobs
- View job details
- Apply for jobs
- Track application status

### Recruiter
- Register and login
- Create, edit, and delete job postings
- View applicants for each job
- Accept or reject applications

## Tech Stack

- Frontend: React, React Router
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT

## Setup Instructions

### Backend Setup

1. Navigate to backend folder:
```
cd backend
```

2. Install dependencies:
```
npm install
```

3. Create .env file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job-portal
JWT_SECRET=your_secret_key_here
```

4. Start MongoDB (make sure MongoDB is installed and running)

5. Start the server:
```
npm run dev
```

### Frontend Setup

1. Navigate to frontend folder:
```
cd frontend
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

The application will open at http://localhost:3000

Deployment URL : https://job-portal-app-taupe.vercel.app/

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Jobs
- GET /api/jobs - Get all jobs (with optional search)
- GET /api/jobs/:id - Get job by ID
- POST /api/jobs - Create job (recruiter only)
- PUT /api/jobs/:id - Update job (recruiter only)
- DELETE /api/jobs/:id - Delete job (recruiter only)
- GET /api/jobs/recruiter/my-jobs - Get recruiter's jobs

### Applications
- POST /api/applications - Apply for job (user only)
- GET /api/applications/my-applications - Get user's applications
- GET /api/applications/job/:jobId - Get applicants for job (recruiter only)
- PATCH /api/applications/:id/status - Update application status (recruiter only)

## Project Structure

```
backend/
├── models/          # MongoDB schemas
├── routes/          # API routes
├── middleware/      # JWT authentication
└── server.js        # Entry point

frontend/
├── src/
│   ├── api/         # Axios configuration
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── App.js       # Main app component
│   └── index.js     # Entry point
└── public/
```
