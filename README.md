# Oxyera Technical Challenge - Submission

## Live Demo
**Repository**: https://github.com/Abdelkarim17B/interview-challenge
**Live Demo**: https://9c00c0b6e663.ngrok-free.app

## Challenge Requirements

### NestJS Backend with CRUD Endpoints
- **Patients**: Full CRUD operations (`/patients`)
- **Medications**: Full CRUD operations (`/medications`) 
- **Assignments**: Full CRUD operations (`/assignments`)
- RESTful API design with proper HTTP status codes
- Input validation with DTOs and class-validator
- Global error handling and response formatting

### Calculation Endpoint for Remaining Days
- **Endpoint**: `GET /assignments/:id/remaining-days`
- **Logic**: Calculates remaining treatment days based on start date and duration
- Handles edge cases (completed treatments, future treatments)
- Returns negative values for overdue treatments

### Next.js Frontend
- **Tech Stack**: Next.js with TypeScript and Tailwind CSS
- **Features**:
  - Patient management interface
  - Medication management interface  
  - Assignment management with remaining days calculation
  - Responsive design with modern UI components
  - Real-time data fetching and updates

### Unit Tests for Calculation Logic
- **Coverage**: 83 comprehensive unit tests across all services and controllers
- **Test Types**: Unit tests, Integration tests, E2E tests, Database tests
- **Framework**: Jest with TypeScript
- **Coverage**: 100% coverage on calculation logic and core business functions

## Architecture & Implementation

### Backend (NestJS)
```
src/
├── modules/
│   ├── patients/          # Patient management
│   ├── medications/       # Medication management
│   └── assignments/       # Assignment management & calculations
├── common/
│   ├── filters/          # Global exception handling
│   └── interceptors/     # Response formatting
└── database/             # SQLite configuration
```

**Key Features**:
- TypeORM with SQLite database
- Swagger API documentation
- Global validation pipes
- Custom exception filters
- Response interceptors for consistent API responses
- CORS configuration for frontend integration

### Frontend (Next.js)
```
src/
├── components/
│   ├── pages/            # Page-specific components
│   ├── ui/              # Reusable UI components
│   └── layout/          # Layout components
├── hooks/               # Custom React hooks
├── lib/                 # API client and utilities
└── types/               # TypeScript interfaces
```

**Key Features**:
- TypeScript for type safety
- Custom hooks for data fetching
- Responsive design with Tailwind CSS
- Form validation and error handling
- Real-time data updates

## Technical Enhancements

### Beyond Requirements
I implemented several additional features to demonstrate production ready development practices:

#### CI/CD Pipeline (GitHub Actions)
- **Pre-Build Stage**: Dependency installation and caching
- **Code Quality**: ESLint, TypeScript checking, Prettier formatting
- **Security**: npm audit, Dependabot automation
- **Testing**: Unit, Integration, E2E, and Database tests
- **Containerization**: Docker multi-stage builds
- **Performance Monitoring**: Artillery load testing
- **Deployment**: Automated staging deployment

#### Docker Containerization
- Multi-stage builds for optimized production images
- Security hardening with non-root users
- Health checks for container monitoring
- Alpine Linux base for minimal image size

#### Comprehensive Testing
- **83 tests** covering all endpoints and business logic
- Unit tests for services and controllers
- Integration tests for API endpoints
- E2E tests for complete user flows
- Database connection tests

#### Security & Best Practices
- Input validation and sanitization
- Global exception handling
- CORS configuration
- TypeScript strict mode
- ESLint and Prettier for code quality

## Database Schema

### Entities
- **Patient**: `id`, `name`, `dateOfBirth`, `createdAt`, `updatedAt`
- **Medication**: `id`, `name`, `dosage`, `frequency`, `createdAt`, `updatedAt`
- **Assignment**: `id`, `patientId`, `medicationId`, `startDate`, `days`, `createdAt`, `updatedAt`

### Relationships
- One-to-Many: Patient → Assignments
- One-to-Many: Medication → Assignments
- Many-to-One: Assignment → Patient, Medication

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Local Development
```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend  
cd frontend
npm install
npm run dev
```

### Docker Deployment
```bash
# Build and run with Docker
docker build -t backend -f backend/Dockerfile backend/
docker build -t frontend -f frontend/Dockerfile frontend/

docker run -p 8080:8080 backend
docker run -p 3000:3000 frontend
```

### Running Tests
```bash
cd backend
npm test              # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage report
```

## Development Timeline
**Duration**: 8 hours (1:00 AM - 9:00 PM GMT+1)
**Date**: July 14, 2025
**Ai Usage**: Mainly for repetitive tasks like writing boilerplate code, setting up configurations, and generating test cases.

## Technologies Used

### Backend
- NestJS with TypeScript
- TypeORM with SQLite
- Class Validator for DTOs
- Swagger for API documentation
- Jest for testing

### Frontend
- Next.js with TypeScript
- Tailwind CSS for styling
- Custom hooks for state management
- Responsive design principles

### DevOps
- GitHub Actions for CI/CD
- Docker for containerization
- Artillery for performance testing
- ESLint + Prettier for code quality

## Key Metrics
- **83 tests** with full coverage
- **0 ESLint errors** (strict TypeScript)
- **Docker optimized** builds
- **CI/CD pipeline** with 7 stages
- **Production-ready** architecture

## Business Logic Highlight

The core calculation logic handles various scenarios:
```typescript
// Remaining days calculation
const daysSinceStart = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
const remainingDays = assignment.days - daysSinceStart;
```

**Edge Cases Handled**:
- Future treatments (shows total days)
- Ongoing treatments (shows remaining days)
- Completed treatments (shows negative/overdue days)
- Invalid dates and data validation

---

**Repository**: https://github.com/Abdelkarim17B/interview-challenge
**Live Demo**: https://9c00c0b6e663.ngrok-free.app/

**Author**: Abdelkarim Bengherbia
