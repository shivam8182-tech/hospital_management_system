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

## Demo accounts

| Role | Username | Password |
| --- | --- | --- |
| Administrator | `admin` | `Admin@123` |
| Staff | `staff` | `Staff@123` |
| Provider | `provider` | `Provider@123` |
| Patient | `patient` | `Patient@123` |

The staff portal includes clock-in/clock-out and a locally saved time sheet. The provider portal includes a clinical overview, appointment list, sample patient list, and schedule. Patients can browse a monthly calendar, book appointments, and view or cancel their appointments. Demo time entries and appointments are stored in browser local storage; they are not shared with a server.

The administrator manages patient, staff, provider, and billing records. Those record-management routes are restricted to the administrator demo account. This is client-side demo access control only and must not be treated as production authorization.

The admin add-patient, add-staff, add-provider, and add-biller forms validate required fields, names, contact information, identifiers, dates, and applicable numeric/address fields. Validation and save failures appear inline and in toast notifications. Successful records are saved in browser local storage, included in their admin list, and logged to the browser console. This local storage is for demonstration only; do not use it for real patient or personnel data.

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
- `/dashboard` (role-specific portal)
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
