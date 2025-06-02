# Task Tracker Pro

## Project Overview
Task Tracker Pro is a full-stack web application for managing tasks and users, designed to help teams and individuals organize, assign, and track work efficiently. The chosen problem is to provide a simple, collaborative, and secure platform for task management with user authentication and role-based access.

## Technology Stack & Architecture
- **Frontend:** Next.js (React), Tailwind CSS, TypeScript
- **Backend:** NestJS (Node.js, TypeScript), TypeORM, PostgreSQL
- **Authentication:** JWT (Bearer token), bcrypt
- **API Docs:** Swagger (OpenAPI)
- **Containerization:** Docker, Docker Compose
- **Other:** React Hot Toast (notifications)

The architecture is modular, with a clear separation between frontend and backend. The backend exposes a RESTful API, and the frontend consumes it. Both are containerized for easy deployment.

## Setup Instructions

### Local Development
1. **Clone the repository**
2. **Backend:**
    If you're running the backend locally, go to backend/src/app.module.ts, uncomment the line "host: 'localhost'", and comment out the line "host: process.env.DB_HOST". Then you can run the backend.
   - `cd backend`
   - `npm install`
   - Configure `.env` (see `.env.example` if available)
   - `npm run start:dev`
3. **Frontend:**
   - `cd frontend`
   - `npm install`
   - `npm run dev`
4. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:3001](http://localhost:3001)
   - Swagger docs: [http://localhost:3001/api](http://localhost:3001/api)

### Docker (Local or Cloud)
- `docker-compose up --build`
- Access as above. (Configure environment variables as needed.)

## API Documentation
- Swagger UI: [http://localhost:3001/api](http://localhost:3001/api)
- All endpoints are documented and testable via Swagger.

## Key Decisions & Trade-offs
- **NestJS & Next.js:** Chosen for scalability, maintainability, and TypeScript support.
- **JWT Auth:** Simplicity and statelessness, but requires secure storage of tokens on the client.
- **TypeORM & PostgreSQL:** Easy integration with NestJS, but may require tuning for large-scale use.
- **Docker:** Simplifies local/cloud deployment, but adds some complexity for beginners.
- **Minimal UI:** Focused on functionality and clarity over advanced design.

## How to Run & Test
- **Run locally:** See setup instructions above.
- **Run with Docker:** `docker-compose up --build`
- **Linting:**
  - `cd frontend && npm run lint`
  - `cd backend && npm run lint`

## Future Improvements
- Add user roles/permissions management UI
- Add task comments and attachments
- Add notifications and activity logs
- Improve mobile responsiveness
- Add more tests
