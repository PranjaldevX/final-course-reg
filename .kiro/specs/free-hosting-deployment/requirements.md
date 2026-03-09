# Requirements Document: Free Hosting Deployment for AMU Course Registration System

## Introduction

This document defines the requirements for deploying the AMU Course Registration System on free hosting platforms. The system consists of a React frontend, Node.js/Express backend with TypeScript, PostgreSQL database managed via Prisma ORM, and includes authentication, file uploads, and complex relational data management. The deployment must be cost-free while maintaining functionality, security, and reasonable performance for an academic institution's course registration needs.

## Glossary

- **Frontend_Application**: The React + Vite + TypeScript + Tailwind CSS user interface
- **Backend_API**: The Node.js/Express + TypeScript REST API server with Prisma ORM
- **Database_Instance**: The PostgreSQL relational database storing all system data
- **Deployment_Pipeline**: The automated CI/CD process for building and deploying code changes
- **Hosting_Provider**: The platform service providing free infrastructure resources
- **Environment_Configuration**: The collection of environment variables and secrets required for runtime
- **Build_Artifact**: The compiled production-ready code output from the build process
- **Static_Assets**: The compiled frontend files (HTML, CSS, JavaScript) served to browsers
- **Health_Monitor**: The system for tracking application uptime and performance metrics
- **Cold_Start**: The delay when a dormant application instance restarts after inactivity
- **Resource_Limit**: The maximum CPU, memory, storage, or bandwidth allowed by free tier
- **Migration_Script**: The Prisma database schema synchronization command
- **File_Storage**: The persistent storage system for uploaded CSV files

## Requirements

### Requirement 1: Frontend Hosting

**User Story:** As a system administrator, I want to deploy the React frontend on a free hosting platform, so that students and faculty can access the user interface without hosting costs.

#### Acceptance Criteria

1. THE Frontend_Application SHALL be deployed on a free static hosting platform that supports single-page applications
2. WHEN a user navigates to any route, THE Hosting_Provider SHALL serve the index.html file to enable client-side routing
3. THE Frontend_Application SHALL be accessible via HTTPS with a valid SSL certificate
4. THE Hosting_Provider SHALL support custom domain configuration for institutional branding
5. THE Static_Assets SHALL be served with CDN caching for optimal load times
6. THE Hosting_Provider SHALL provide at least 100GB monthly bandwidth on the free tier
7. WHEN the build process completes, THE Deployment_Pipeline SHALL automatically deploy the dist folder contents
8. THE Frontend_Application SHALL correctly reference the Backend_API URL via environment variables

### Requirement 2: Backend API Hosting

**User Story:** As a system administrator, I want to deploy the Node.js backend on a free hosting platform, so that the API endpoints are accessible without infrastructure costs.

#### Acceptance Criteria

1. THE Backend_API SHALL be deployed on a free platform that supports Node.js runtime version 18 or higher
2. THE Hosting_Provider SHALL provide at least 512MB RAM for the Backend_API process
3. WHEN the Backend_API receives no requests for 30 minutes, THE Hosting_Provider MAY suspend the instance to conserve resources
4. WHEN a suspended instance receives a request, THE Backend_API SHALL restart within 60 seconds (cold start)
5. THE Backend_API SHALL be accessible via HTTPS with a valid SSL certificate
6. THE Hosting_Provider SHALL support environment variable configuration for sensitive credentials
7. THE Backend_API SHALL execute the Prisma generate command during the build process
8. THE Hosting_Provider SHALL provide at least 750 hours of monthly runtime on the free tier

### Requirement 3: Database Hosting

**User Story:** As a system administrator, I want to host the PostgreSQL database on a free platform, so that student and course data persists without database costs.

#### Acceptance Criteria

1. THE Database_Instance SHALL be hosted on a free PostgreSQL provider supporting version 14 or higher
2. THE Hosting_Provider SHALL provide at least 1GB of database storage capacity
3. THE Database_Instance SHALL support at least 20 concurrent connections
4. THE Database_Instance SHALL be accessible via SSL/TLS encrypted connections
5. THE Hosting_Provider SHALL provide automated daily backups with at least 7-day retention
6. WHEN the database storage exceeds 80% capacity, THE Health_Monitor SHALL alert administrators
7. THE Database_Instance SHALL support Prisma ORM connection pooling configuration
8. THE Hosting_Provider SHALL maintain 99% uptime availability on the free tier

### Requirement 4: Environment Configuration Management

**User Story:** As a developer, I want to securely configure environment variables across all deployment platforms, so that sensitive credentials are protected and the application functions correctly.

#### Acceptance Criteria

1. THE Deployment_Pipeline SHALL inject environment variables during the build and runtime phases
2. THE Environment_Configuration SHALL include DATABASE_URL, JWT_SECRET, PORT, and CORS origin settings
3. THE Frontend_Application SHALL use VITE_API_URL environment variable to reference the Backend_API endpoint
4. THE Backend_API SHALL validate that all required environment variables are present at startup
5. IF any required environment variable is missing, THEN THE Backend_API SHALL log an error and refuse to start
6. THE Environment_Configuration SHALL NOT include sensitive values in version control or build logs
7. THE Hosting_Provider SHALL support encrypted storage of environment variables
8. WHEN environment variables change, THE Deployment_Pipeline SHALL trigger a redeployment

### Requirement 5: Database Migration and Seeding

**User Story:** As a developer, I want to run Prisma migrations during deployment, so that the database schema stays synchronized with the application code.

#### Acceptance Criteria

1. WHEN the Backend_API deploys, THE Deployment_Pipeline SHALL execute "prisma migrate deploy" before starting the server
2. THE Migration_Script SHALL apply all pending migrations to the Database_Instance
3. IF a migration fails, THEN THE Deployment_Pipeline SHALL halt deployment and report the error
4. THE Backend_API SHALL execute "prisma generate" to create the Prisma Client during the build phase
5. THE Deployment_Pipeline SHALL support manual execution of seed scripts for initial data population
6. THE Migration_Script SHALL complete within 5 minutes to avoid deployment timeouts
7. THE Database_Instance SHALL maintain migration history in the _prisma_migrations table

### Requirement 6: File Upload Storage

**User Story:** As a faculty member, I want uploaded CSV files to persist across deployments, so that bulk operations continue to function reliably.

#### Acceptance Criteria

1. THE Backend_API SHALL store uploaded files in a persistent File_Storage system separate from the application instance
2. THE Hosting_Provider SHALL provide at least 500MB of free persistent storage
3. WHEN the Backend_API restarts or redeploys, THE File_Storage SHALL retain all uploaded files
4. THE Backend_API SHALL validate CSV file size does not exceed 10MB before accepting uploads
5. THE File_Storage SHALL be accessible via the Backend_API with appropriate authentication
6. IF File_Storage capacity exceeds 90%, THEN THE Backend_API SHALL reject new uploads with a descriptive error
7. THE Backend_API SHALL implement file cleanup for temporary uploads older than 7 days

### Requirement 7: Continuous Deployment Pipeline

**User Story:** As a developer, I want automated deployments when code is pushed to the main branch, so that updates reach production without manual intervention.

#### Acceptance Criteria

1. WHEN code is pushed to the main branch, THE Deployment_Pipeline SHALL automatically trigger builds for Frontend_Application and Backend_API
2. THE Deployment_Pipeline SHALL execute "npm run build" for the Frontend_Application
3. THE Deployment_Pipeline SHALL execute "npm run build" followed by "prisma generate" for the Backend_API
4. IF the build process fails, THEN THE Deployment_Pipeline SHALL prevent deployment and notify developers
5. THE Deployment_Pipeline SHALL run in parallel for Frontend_Application and Backend_API to minimize deployment time
6. THE Deployment_Pipeline SHALL complete within 10 minutes for both components
7. WHEN deployment succeeds, THE Deployment_Pipeline SHALL verify application health via HTTP health check endpoints
8. THE Deployment_Pipeline SHALL support manual rollback to previous deployment versions

### Requirement 8: CORS and API Security Configuration

**User Story:** As a security administrator, I want proper CORS configuration between frontend and backend, so that only authorized origins can access the API.

#### Acceptance Criteria

1. THE Backend_API SHALL configure CORS middleware to accept requests only from the Frontend_Application domain
2. THE Backend_API SHALL reject requests from unauthorized origins with HTTP 403 status
3. THE Environment_Configuration SHALL specify allowed CORS origins via environment variable
4. THE Backend_API SHALL include security headers (Helmet.js) in all HTTP responses
5. THE Backend_API SHALL enforce HTTPS-only connections in production environment
6. THE Backend_API SHALL implement rate limiting to prevent abuse on free tier resources
7. WHEN the Frontend_Application domain changes, THE Backend_API SHALL update CORS configuration without code changes

### Requirement 9: Application Health Monitoring

**User Story:** As a system administrator, I want to monitor application uptime and performance, so that I can detect and respond to issues proactively.

#### Acceptance Criteria

1. THE Backend_API SHALL expose a /health endpoint returning HTTP 200 when operational
2. THE Health_Monitor SHALL ping the /health endpoint every 5 minutes to prevent cold starts
3. THE Health_Monitor SHALL send alerts when the Backend_API returns non-200 status codes
4. THE Health_Monitor SHALL track response time metrics for performance degradation detection
5. THE Health_Monitor SHALL monitor Database_Instance connection status
6. THE Health_Monitor SHALL provide a dashboard showing uptime percentage over 30-day periods
7. THE Health_Monitor SHALL be free to use with at least 50 monitors on the free tier
8. WHEN the Backend_API experiences 3 consecutive failed health checks, THE Health_Monitor SHALL send email notifications

### Requirement 10: Resource Limit Management

**User Story:** As a system administrator, I want to understand and manage free tier resource limits, so that the application remains operational within constraints.

#### Acceptance Criteria

1. THE Deployment_Pipeline SHALL document all Resource_Limit constraints for each Hosting_Provider
2. THE Backend_API SHALL implement connection pooling with maximum 10 concurrent Database_Instance connections
3. THE Backend_API SHALL limit API request payload size to 10MB to conserve bandwidth
4. THE Frontend_Application SHALL implement lazy loading for routes to reduce initial bundle size below 1MB
5. THE Backend_API SHALL log resource usage metrics (memory, CPU, database connections) hourly
6. WHEN Resource_Limit thresholds reach 80%, THE Health_Monitor SHALL alert administrators
7. THE Backend_API SHALL implement request queuing when concurrent connection limits are reached
8. THE Deployment_Pipeline SHALL provide monthly usage reports for bandwidth, storage, and compute hours

### Requirement 11: Cold Start Optimization

**User Story:** As a student, I want the application to respond quickly even after periods of inactivity, so that my registration experience is not degraded by cold starts.

#### Acceptance Criteria

1. THE Backend_API SHALL initialize database connections lazily to reduce cold start time
2. THE Backend_API SHALL defer non-critical initialization tasks until after the first request
3. THE Health_Monitor SHALL ping the Backend_API every 25 minutes to keep the instance warm
4. THE Backend_API SHALL respond to health check requests within 2 seconds during warm state
5. THE Backend_API SHALL complete cold start initialization within 30 seconds
6. THE Frontend_Application SHALL display a loading indicator when Backend_API cold start is detected
7. THE Backend_API SHALL cache Prisma Client generation to avoid regeneration on every cold start

### Requirement 12: Backup and Disaster Recovery

**User Story:** As a system administrator, I want automated backups and recovery procedures, so that data loss is prevented in case of failures.

#### Acceptance Criteria

1. THE Database_Instance SHALL be backed up automatically every 24 hours
2. THE Hosting_Provider SHALL retain at least 7 daily backups on the free tier
3. THE Deployment_Pipeline SHALL document the database restoration procedure
4. THE Backend_API SHALL support exporting all data to JSON format for manual backups
5. THE Deployment_Pipeline SHALL maintain the previous 5 deployment versions for rollback capability
6. WHEN a backup is created, THE Health_Monitor SHALL verify backup integrity
7. THE Deployment_Pipeline SHALL provide a restoration script that can rebuild the Database_Instance from backup

### Requirement 13: Scaling Path Documentation

**User Story:** As a system administrator, I want documented migration paths to paid tiers, so that scaling is possible when free tier limits are exceeded.

#### Acceptance Criteria

1. THE Deployment_Pipeline SHALL document the upgrade path for each Hosting_Provider component
2. THE Deployment_Pipeline SHALL specify the cost and resource improvements of paid tiers
3. THE Deployment_Pipeline SHALL identify which Resource_Limit constraints are eliminated by upgrading
4. THE Deployment_Pipeline SHALL provide migration scripts for moving to alternative hosting providers
5. THE Deployment_Pipeline SHALL document the estimated monthly cost at different usage levels
6. THE Deployment_Pipeline SHALL specify the trigger points when upgrading becomes necessary
7. THE Deployment_Pipeline SHALL maintain compatibility with both free and paid tier configurations

### Requirement 14: Development and Production Environment Separation

**User Story:** As a developer, I want separate development and production deployments, so that testing does not affect live users.

#### Acceptance Criteria

1. THE Deployment_Pipeline SHALL support deploying to separate development and production environments
2. THE Frontend_Application SHALL use different API URLs for development and production via environment variables
3. THE Backend_API SHALL use separate Database_Instance connections for development and production
4. THE Deployment_Pipeline SHALL deploy to development environment on pushes to develop branch
5. THE Deployment_Pipeline SHALL deploy to production environment on pushes to main branch
6. THE Environment_Configuration SHALL clearly distinguish between development and production secrets
7. THE Hosting_Provider SHALL support multiple free-tier projects for environment separation

### Requirement 15: Authentication Token Management

**User Story:** As a security administrator, I want secure JWT token generation and validation, so that user sessions are protected across free hosting platforms.

#### Acceptance Criteria

1. THE Backend_API SHALL generate JWT tokens using a cryptographically secure JWT_SECRET from Environment_Configuration
2. THE JWT_SECRET SHALL be at least 32 characters long and randomly generated
3. THE Backend_API SHALL set JWT token expiration to 24 hours for security
4. THE Backend_API SHALL validate JWT signatures on all protected endpoints
5. IF a JWT token is invalid or expired, THEN THE Backend_API SHALL return HTTP 401 Unauthorized
6. THE Backend_API SHALL include user role information in JWT payload for authorization checks
7. THE Frontend_Application SHALL store JWT tokens in httpOnly cookies or secure localStorage
8. WHEN JWT_SECRET changes, THE Backend_API SHALL invalidate all existing tokens

### Requirement 16: Database Connection Pooling

**User Story:** As a developer, I want optimized database connection pooling, so that the limited free tier connections are used efficiently.

#### Acceptance Criteria

1. THE Backend_API SHALL configure Prisma connection pool with maximum 5 connections
2. THE Backend_API SHALL set connection timeout to 10 seconds to prevent hanging connections
3. THE Backend_API SHALL implement connection retry logic with exponential backoff
4. WHEN all connections are in use, THE Backend_API SHALL queue requests for up to 30 seconds
5. IF connection pool is exhausted for 30 seconds, THEN THE Backend_API SHALL return HTTP 503 Service Unavailable
6. THE Backend_API SHALL close idle database connections after 60 seconds
7. THE Backend_API SHALL log connection pool metrics for monitoring and optimization

### Requirement 17: Build Optimization

**User Story:** As a developer, I want optimized build processes, so that deployments complete within free tier time limits.

#### Acceptance Criteria

1. THE Frontend_Application SHALL use Vite's production build with code splitting and tree shaking
2. THE Frontend_Application SHALL generate source maps only in development environment
3. THE Backend_API SHALL exclude devDependencies from production deployment
4. THE Deployment_Pipeline SHALL cache node_modules between builds to reduce build time
5. THE Frontend_Application SHALL compress assets using gzip or brotli compression
6. THE Build_Artifact SHALL be smaller than 5MB for Frontend_Application
7. THE Build_Artifact SHALL be smaller than 50MB for Backend_API including dependencies
8. THE Deployment_Pipeline SHALL complete the build phase within 5 minutes

### Requirement 18: Error Logging and Debugging

**User Story:** As a developer, I want centralized error logging, so that I can diagnose issues in the production environment.

#### Acceptance Criteria

1. THE Backend_API SHALL log all errors with timestamp, error message, and stack trace
2. THE Backend_API SHALL log all HTTP requests with method, path, status code, and response time
3. THE Hosting_Provider SHALL retain logs for at least 7 days on the free tier
4. THE Backend_API SHALL implement log levels (ERROR, WARN, INFO, DEBUG) with production using ERROR and WARN only
5. THE Frontend_Application SHALL send critical errors to the Backend_API for centralized logging
6. THE Backend_API SHALL sanitize logs to remove sensitive information (passwords, tokens)
7. THE Deployment_Pipeline SHALL provide log viewing interface or CLI access

### Requirement 19: API Rate Limiting

**User Story:** As a system administrator, I want API rate limiting, so that free tier bandwidth and compute resources are not exhausted by abuse.

#### Acceptance Criteria

1. THE Backend_API SHALL limit unauthenticated requests to 20 requests per minute per IP address
2. THE Backend_API SHALL limit authenticated requests to 100 requests per minute per user
3. WHEN rate limit is exceeded, THE Backend_API SHALL return HTTP 429 Too Many Requests
4. THE Backend_API SHALL include Retry-After header in rate limit responses
5. THE Backend_API SHALL exempt health check endpoints from rate limiting
6. THE Backend_API SHALL implement sliding window rate limiting algorithm
7. THE Backend_API SHALL store rate limit counters in memory to avoid database overhead

### Requirement 20: Documentation and Deployment Guide

**User Story:** As a new developer, I want comprehensive deployment documentation, so that I can set up the hosting infrastructure independently.

#### Acceptance Criteria

1. THE Deployment_Pipeline SHALL include a DEPLOYMENT.md file with step-by-step setup instructions
2. THE Deployment_Pipeline SHALL document all required accounts and sign-up links for Hosting_Provider services
3. THE Deployment_Pipeline SHALL provide example Environment_Configuration files for each component
4. THE Deployment_Pipeline SHALL include troubleshooting guides for common deployment issues
5. THE Deployment_Pipeline SHALL document the estimated setup time (under 2 hours for complete deployment)
6. THE Deployment_Pipeline SHALL include screenshots or CLI command examples for each setup step
7. THE Deployment_Pipeline SHALL maintain a FAQ section addressing free tier limitations and workarounds
8. THE Deployment_Pipeline SHALL document the monitoring and maintenance procedures for ongoing operations
