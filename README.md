# FormForge

FormForge is a modern, no-code form builder that enables individuals and teams to create, customize, publish, and analyze forms without writing code. Built with a production-ready monorepo architecture, it supports collaborative organizations, visual form building using React Flow, dynamic conditional logic, and subscription-based premium features.

---

## ✨ Features

* Organization switching
* Role-based access control
* Protected routes

### Form Builder

* Visual drag-and-drop builder powered by React Flow
* Multiple field types

  * Text
  * Textarea
  * Email
  * Number
  * Phone
  * Date
  * Dropdown
  * Checkbox
  * Radio
  * Rating
  * File Upload
* Real-time form preview
* Field properties editor
* Form versioning
* Draft & Published states

### Conditional Logic

* Show/Hide fields
* Branching workflows
* Validation rules
* Required fields
* Dynamic field behavior

### Response Management

* Public shareable forms
* Response dashboard
* Response filtering
* Search submissions
* CSV export
* Basic analytics

### Organization Features

* Multiple organizations
* Team collaboration
* Organization dashboard
* Members management
* Usage tracking

### Premium Features

* Custom branding
* Higher response limits
* Advanced analytics
* Integrations
* Priority support
* Razorpay subscription billing

---

# 🏗 Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* React Flow
* React Hook Form
* TanStack Query
* tRPC Client

## Backend

* Node.js
* Express
* tRPC
* Drizzle ORM
* PostgreSQL

## Authentication

* Clerk
* Clerk Organizations

## Database

* PostgreSQL
* Drizzle ORM

## Payments

* Razorpay

## Monorepo

* Turborepo
* pnpm Workspaces

---

# 📂 Project Structure

```text
formforge/
│
├── apps/
│   ├── web/
│   └── api/
│
├── packages/
│   ├── ui/
│   ├── db/
│   ├── validators/
│   ├── types/
│   ├── utils/
│   └── config/
│
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

# 🗄 Database Design

Core tables:

* users
* organization_metadata
* forms
* form_versions
* submissions
* answers
* templates
* subscriptions
* payments
* audit_logs

---

# 🚀 User Flow

```text
Landing Page
        │
        ▼
Sign In / Sign Up
        │
        ▼
Organization Hub
        │
        ▼
Create / Select Organization
        │
        ▼
Organization Dashboard
        │
        ▼
Create Form
        │
        ▼
Visual Form Builder
        │
        ▼
Publish Form
        │
        ▼
Public Form URL
        │
        ▼
Collect Responses
        │
        ▼
Analytics Dashboard
```

---

# 🎨 Form Builder Architecture

The form builder uses React Flow.

Each form is stored as:

* Nodes
* Edges
* Settings

Every published version is immutable.

```text
Form
      │
      ▼
Form Version
      │
      ├── Nodes (JSON)
      ├── Edges (JSON)
      └── Settings (JSON)
```

---

# 📊 Response Storage

Each submission creates:

One Submission

↓

Multiple Answers

```text
Submission
      │
      ├── Name
      ├── Email
      ├── DOB
      ├── Gender
      └── Driving License
```

Each answer is stored as an individual row.

---

# 🧩 Planned Features

* AI Form Generator
* AI Question Suggestions
* Custom Domains
* Webhooks
* Zapier Integration
* Google Sheets Integration
* Slack Integration
* Email Notifications
* Form Templates Marketplace
* Dark Mode
* Multi-page Forms
* CAPTCHA Protection
* File Storage
* PDF Export
* Team Permissions
* Audit Logs
* Public API

---

# ⚙️ Getting Started

## Install dependencies

```bash
pnpm install
```

## Run development

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

---

# 📌 Project Status

🚧 Currently under active development.

Upcoming milestones:

* Project setup
* Authentication
* Organization dashboard
* Database schema
* Form builder
* Conditional logic
* Response dashboard
* Payments
* Production deployment

---

# 📄 License

This project is intended for educational and portfolio purposes. A production license can be added later if the project is open-sourced.
