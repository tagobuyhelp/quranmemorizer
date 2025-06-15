# Hifz Tracking System

## Overview

This is a Quran memorization (Hifz) tracking system built with a modern full-stack architecture. The application helps teachers and administrators track student progress in memorizing the Quran, managing different types of tasks (Sabaq, Ammapara, Amukta), and recording daily entries with accuracy scores and remarks.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query (React Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for client-side routing

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations
- **Development**: tsx for TypeScript execution

### Database Design
- **students**: Core student information (ID, name, section, teacher, current para)
- **hifz_entries**: Daily task entries with accuracy scores and remarks
- **para_data**: Reference data for Quran chapters (page ranges, total pages)

## Key Components

### Data Models
1. **Students**: Track student information and current memorization progress
2. **Hifz Entries**: Record daily activities with task-specific data
3. **Para Data**: Static reference data for Quran chapter page mappings

### Task Types
- **Sabaq**: New memorization with page-specific tracking
- **Ammapara**: Full chapter review (auto-calculated pages)
- **Amukta**: Revision of previously memorized chapters with multi-select

### UI Components
- **StudentSelector**: Searchable dropdown with student information display
- **TaskFields**: Dynamic form fields based on selected task type
- **StarRating**: Interactive 5-star accuracy rating system

## Data Flow

1. **Student Selection**: User searches and selects student, auto-populates section and teacher info
2. **Task Configuration**: Based on task type, appropriate fields are displayed with validation
3. **Data Validation**: Zod schemas ensure data integrity before submission
4. **API Interaction**: TanStack Query manages server state and caching
5. **Database Storage**: Drizzle ORM handles PostgreSQL operations

## External Dependencies

### Database & Hosting
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit**: Development and deployment platform

### UI & Styling
- **Radix UI**: Headless component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Development Tools
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast JavaScript bundling for production
- **PostCSS**: CSS processing with Autoprefixer

## Deployment Strategy

### Development
- Replit provides integrated development environment
- Hot reload with Vite for frontend changes
- tsx for backend TypeScript execution
- PostgreSQL module for database connectivity

### Production Build
- Frontend: Vite builds optimized static assets
- Backend: ESBuild bundles server code with external packages
- Database: Drizzle migrations ensure schema consistency

### Environment Configuration
- `NODE_ENV` controls development/production behavior
- `DATABASE_URL` connects to Neon PostgreSQL instance
- Port 5000 for local development, port 80 for production

## Changelog
- June 15, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.