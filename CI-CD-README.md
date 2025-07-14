# CI/CD Pipeline Documentation

## Overview

This repository includes a comprehensive CI/CD pipeline using GitHub Actions that covers all aspects of modern software development lifecycle.

## Pipeline Stages

### 1. **Pre-Build Stage** 🔧
- **Purpose**: Setup environment and install dependencies
- **Services**: Both frontend and backend
- **Actions**:
  - Node.js setup (v18)
  - Dependency installation with npm ci
  - Dependency caching for performance

### 2. **Code Quality & Security** 🛡️
- **Purpose**: Ensure code quality and security standards
- **Target**: Backend
- **Checks**:
  - ESLint code linting
  - TypeScript compilation check
  - Security audit with npm audit
  - Code formatting verification with Prettier

### 3. **Testing Suite** 🧪
- **Unit Tests**: Core business logic testing
- **Integration Tests**: API endpoint testing
- **End-to-End Tests**: Full application flow testing
- **Database Tests**: Database connection and operations
- **Coverage**: Code coverage reporting with Codecov

### 4. **Code Review Automation** 🤖
- **Trigger**: Pull Request events
- **Features**:
  - Automated code quality assessment
  - PR comment with review summary
  - Blocking for critical issues

### 5. **Build & Containerization** 🐳
- **Purpose**: Build production-ready artifacts
- **Services**: Both frontend and backend
- **Process**:
  - Application build
  - Docker image creation
  - Multi-stage Docker builds for optimization
  - Image artifact storage

### 6. **Performance Monitoring** ⚡
- **Purpose**: Ensure application performance
- **Target**: Backend
- **Metrics**:
  - Load testing with Artillery
  - Bundle size analysis
  - Response time monitoring

### 7. **Deployment** 🚀
- **Trigger**: Push to main branch
- **Process**:
  - Automated deployment to staging
  - Health checks verification
  - Blue-green deployment ready

## Workflow Files

### Main CI/CD Pipeline
- **File**: `.github/workflows/ci-cd.yml`
- **Triggers**: Push to main/develop, Pull Requests
- **Duration**: ~15-20 minutes

### Security Audit
- **File**: `.github/workflows/security-audit.yml`
- **Schedule**: Weekly (Mondays at 2 AM)
- **Purpose**: Regular security dependency checks

### Dependabot Configuration
- **File**: `.github/dependabot.yml`
- **Purpose**: Automated dependency updates
- **Schedule**: Weekly updates

## Docker Configuration

### Backend Dockerfile
- **Base Image**: `node:18-alpine`
- **Features**:
  - Multi-stage build
  - Non-root user security
  - Health checks
  - Production optimized

### Frontend Dockerfile
- **Base Image**: `node:18-alpine`
- **Features**:
  - Next.js standalone build
  - Static file optimization
  - Security hardening

### Docker Compose
- **File**: `docker-compose.yml`
- **Services**: Backend, Frontend
- **Features**:
  - Health checks
  - Service dependencies
  - Network isolation

## Scripts

### Load Testing
```bash
./scripts/load-test.sh
```
- Artillery-based load testing
- Configurable concurrent users and duration

### Deployment
```bash
./scripts/deploy.sh [environment]
```
- Automated deployment script
- Health check verification
- Environment-specific configurations

## Environment Variables

### Required for CI/CD
- `NODE_VERSION`: Node.js version (default: 18)
- `BACKEND_PORT`: Backend port (default: 8080)
- `FRONTEND_PORT`: Frontend port (default: 3000)

### Optional
- `CODECOV_TOKEN`: For coverage reporting
- `DOCKER_REGISTRY`: Custom Docker registry

## Health Checks

### Backend
- **Endpoint**: `GET /health`
- **Response**: Status, timestamp, uptime

### Frontend
- **Endpoint**: `GET /api/health`
- **Response**: Status, timestamp, environment

## Performance Thresholds

### Load Testing
- **Concurrent Users**: 10
- **Duration**: 30 seconds
- **Expected Response Time**: < 200ms
- **Success Rate**: > 95%

### Bundle Size
- **Backend**: < 50MB
- **Frontend**: < 10MB (after optimization)

## Monitoring & Alerts

### Code Coverage
- **Minimum**: 80%
- **Tool**: Jest + Codecov
- **Reports**: Automated PR comments

### Security
- **Tool**: npm audit
- **Level**: Moderate and above
- **Frequency**: Every build + weekly

## Local Development

### Running Tests
```bash
# Backend
cd backend
npm test              # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage

# Load testing
./scripts/load-test.sh
```

### Docker Development
```bash
# Build and run locally
docker-compose up --build

# Individual services
docker build -t backend ./backend
docker build -t frontend ./frontend
```

## Troubleshooting

### Common Issues

1. **Cache Issues**
   - Clear npm cache: `npm cache clean --force`
   - Remove node_modules and reinstall

2. **Docker Build Failures**
   - Check Dockerfile syntax
   - Verify base image availability
   - Check .dockerignore patterns

3. **Test Failures**
   - Verify test database setup
   - Check test environment variables
   - Review test dependencies

### Debug Commands
```bash
# Check pipeline status
git log --oneline
git status

# Docker debugging
docker logs <container_id>
docker exec -it <container_id> /bin/sh

# Load test debugging
curl -v http://localhost:8080/health
```

## Best Practices

### Code Quality
- Follow ESLint rules
- Maintain test coverage > 80%
- Use TypeScript strictly
- Regular security audits

### Performance
- Monitor bundle sizes
- Regular load testing
- Optimize Docker images
- Use multi-stage builds

### Security
- Regular dependency updates
- Security audit on every build
- Non-root Docker containers
- Environment variable protection

## Future Enhancements

- [ ] Integration with SonarQube
- [ ] Kubernetes deployment
- [ ] Progressive deployment strategies
- [ ] Advanced monitoring with Prometheus
- [ ] Integration tests with test containers
- [ ] Performance regression testing
