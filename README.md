# Aditya Spice CRM
by Ag Solution

![Version](https://img.shields.io/badge/version-1.2.7-blue)
![React](https://img.shields.io/badge/react-18.3.1-61DAFB)
![Vite](https://img.shields.io/badge/vite-5.4.8-646CFF)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-3.4.14-38B2AC)

A comprehensive Customer Relationship Management system built specifically for Aditya Spice's business operations. This modern web application streamlines customer interactions, product management, and business processes.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [System Requirements](#system-requirements)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Component Architecture](#component-architecture)
- [Core Modules](#core-modules)
- [UI Components](#ui-components)
- [State Management](#state-management)
- [Authentication](#authentication)
- [Performance Optimizations](#performance-optimizations)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

Aditya Spice CRM is a feature-rich platform designed to manage customer relationships, product inventory, and business operations efficiently. Built with modern web technologies, it offers a seamless experience for managing spice-related business operations.

## Features

### Customer Management
- **Customer Profiles**
  - Detailed customer information management
  - Contact history tracking
  - Customer categorization
  - Custom fields for business-specific data
  - Bulk import/export capabilities

### Product Management
- **Product Catalog**
  - Comprehensive spice product listings
  - Category management
  - Pricing history
  - Stock level tracking
  - Product variants support
  - Image management

### Enquiry System
- **Advanced Enquiry Handling**
  - Multi-stage enquiry workflow
  - Automated response system
  - Timeline visualization
  - Priority management
  - Assignment and escalation
  - Sample request handling

### Reporting & Analytics
- **Business Intelligence**
  - Custom report generator
  - Sales analytics
  - Customer insights
  - Product performance metrics
  - Export functionality (CSV, PDF)
  - Scheduled reports

### System Features
- **Security & Performance**
  - Role-based access control
  - Data encryption
  - Audit logging
  - Performance monitoring
  - Automated backups
  - Error tracking

## System Requirements

- Node.js 16.x or higher
- NPM 7.x or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Minimum 4GB RAM for development
- 2GB free disk space

## Technology Stack

### Core Technologies
- **Frontend Framework:** React 18.3.1
- **Build Tool:** Vite 5.4.8
- **CSS Framework:** Tailwind CSS 3.4.14
- **State Management:** TanStack Query 5.60.6
- **Routing:** React Router DOM 6.27.0

### UI Libraries
- **Component Libraries:**
  - Material Tailwind 2.1.9
  - Radix UI (multiple components)
  - Shadcn/UI
  - Framer Motion 11.11.11

### Form Management
- React Hook Form 7.53.2
- Zod Validation 3.23.8
- React Select 5.9.0

### Data & Utils
- Axios 1.7.5
- Date-fns 4.1.0
- Moment.js 2.30.1
- Crypto-js 4.2.0

### Development Tools
- ESLint
- PostCSS
- Autoprefixer
- Tailwind Merge

## Getting Started

### Prerequisites Installation
```bash
# Install Node.js and npm
curl -fsSL https://nodejs.org/setup | bash -
```

### Project Setup
```bash
# Clone the repository
git clone https://github.com/AG-Solutions-Bangalore/aditya-crm
cd aditya-spice

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Configuration
```env
VITE_API_BASE_URL=your_api_url
VITE_APP_ENV=development
VITE_ENCRYPTION_KEY=your_encryption_key
```

### Available Scripts
```bash
# Development
npm run dev         # Start development server
npm run lint        # Run ESLint checks
npm run lint:fix    # Fix ESLint issues

# Production
npm run build       # Create production build
npm run preview     # Preview production build
```

## Project Structure

```
sajid-tech-aditya-crm/
├── src/
│   ├── app/                    # Application modules
│   │   ├── auth/              # Authentication
│   │   ├── customer/          # Customer management
│   │   ├── enquiry/           # Enquiry system
│   │   ├── product/          # Product management
│   │   └── report/           # Reporting
│   ├── components/           # Shared components
│   │   ├── base/             # Base components
│   │   ├── ui/               # UI components
│   │   └── spinner/          # Loading indicators
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   ├── utils/              # Helper functions
│   ├── config/             # Configuration
│   └── assets/            # Static assets
├── public/               # Public assets
└── [Configuration Files] # Project config files
```

## Core Modules

### Customer Module
- CreateCustomer.jsx: Customer creation form
- CustomerList.jsx: Customer listing and management
- EditCustomer.jsx: Customer information editing

### Enquiry Module
- EnquiryCreate.jsx: New enquiry creation
- EnquiryList.jsx: Enquiry management
- EnquiryTimeline.jsx: Visual timeline tracking
- SampleEnquiryCreate.jsx: Sample request handling

### Product Module
- CreateProduct.jsx: Product creation interface
- ProductList.jsx: Product catalog management
- EditProduct.jsx: Product information editing

## UI Components

### Base Components
- Buttons
- Forms
- Tables
- Cards
- Modals
- Navigation

### Advanced Components
- Date pickers
- Rich text editors
- File uploaders
- Charts
- Timeline visualizations

## State Management

### TanStack Query Implementation
- Custom hooks for data fetching
- Cache management
- Optimistic updates
- Error handling
- Infinite loading

## Authentication

### Security Implementation
- JWT token management
- Role-based access control
- Session management
- Encryption for sensitive data
- API security

## Performance Optimizations

### Implemented Optimizations
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- Bundle size optimization
- Performance monitoring

## Development Guidelines

### Coding Standards
- ESLint configuration
- Naming conventions
- File structure
- Component organization
- Testing requirements

### Best Practices
- Component composition
- State management
- Error handling
- Security considerations
- Performance optimization

## Deployment

### Build Process
```bash
# Production build
npm run build

# Preview build
npm run preview
```

### Deployment Checklist
- Environment configuration
- Build optimization
- Security checks
- Performance testing
- Backup procedures

## Troubleshooting

### Common Issues
- Installation problems
- Build errors
- Runtime errors
- Performance issues
- API connectivity

### Solutions
- Clear npm cache
- Check node version
- Verify environment variables
- Review console errors
- Check network requests

## License

© 2024 Ag Solution. All Rights Reserved.
Project: Aditya Spice CRM

---

For technical support or business inquiries:
- Technical Support: info@ag-solutions.in
- Business Inquiries: info@ag-solutions.in