# Hospital Management System - Angular

A practical Angular Hospital Management System demonstrating:

- Standalone Angular components
- Angular routing and child/nested routes
- Lazy loading with `loadComponent()` and `loadChildren()` patterns
- Route guard authentication
- Shared/reusable list and details components
- Reactive Forms with `FormGroup`, `FormControl`, and `FormArray`
- Cross-field validation
- Regex validation
- Async MRN uniqueness validation
- Dynamic emergency-contact fields
- Custom directive for US phone formatting
- Custom status pipe
- CryptoJS-encrypted route tokens
- Jasmine/Karma unit tests
- Normal HTML, CSS and TypeScript files

## Demo login

Username: `admin`

Password: `Admin@123`

## Run

```bash
npm install
npm start
```

Open `http://localhost:4200`.

## Test

```bash
npm test
```

Coverage:

```bash
npm run test:coverage
```

## Main routes

- `/login`
- `/dashboard/patient`
- `/dashboard/staff`
- `/dashboard/provider`
- `/dashboard/biller`
- `/dashboard/patient/add`
- `/dashboard/details/:token`

Patient/entity IDs are not placed directly in the details URL. The token contains encrypted route information using CryptoJS.

### Security note

Client-side encryption is useful for avoiding readable identifiers in the browser URL, but it is NOT a replacement for server-side healthcare security. A production system should use HTTPS, server-side authorization, short-lived access tokens, audit logging, secure secret management, input/output encoding, and a backend API that enforces access to records.

## Architecture

```text
src/app
├── core
│   ├── guards
│   ├── services
│   └── validators
├── features
│   ├── auth
│   ├── dashboard
│   ├── entities
│   └── patients
└── shared
    ├── components
    ├── directives
    ├── models
    └── pipes
```
