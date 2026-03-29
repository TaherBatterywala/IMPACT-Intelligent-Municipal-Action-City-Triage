# IMPACT: Intelligent Municipal Action & City Triage

![IMPACT Banner](https://via.placeholder.com/1200x300?text=IMPACT+Civic+Complaint+Management+System)

## 🌟 Introduction

**IMPACT** (Intelligent Municipal Action & City Triage) represents a paradigm shift in how urban centers manage civic grievances. In an era where rapid urbanization often outpaces the development of administrative infrastructure, the gap between citizen expectations and municipal service delivery has widened. **IMPACT** bridges this gap by deploying a sophisticated, full-stack digital solution designed to streamline the entire lifecycle of a civic complaint—from the moment a citizen spots a pothole or a broken streetlamp, to the final resolution verification by a municipal officer.

Unlike traditional, fragmented systems involving phone calls, paper forms, or disparate web portals, IMPACT offers a unified, real-time ecosystem. It empowers citizens with transparency and accountability while arming municipal authorities with the data-driven tools needed to optimize resource allocation and improve response times.

---

## 🎯 Problem Statement & Solution

### The Challenge
Municipalities face significant challenges in maintaining urban infrastructure due to:
1.  **Lack of Visibility**: Authorities often rely on manual reporting, leading to delayed awareness of critical issues.
2.  **Opaque Processes**: Citizens rarely receive feedback after filing a complaint, leading to frustration and mistrust.
3.  **Inefficient Triage**: Without categorized data, departments struggle to prioritize emergencies over routine maintenance.
4.  **Communication Silos**: There is often no direct channel between the field officer fixing the issue and the citizen who reported it.

### The IMPACT Solution
IMPACT addresses these challenges through a three-pronged approach:
1.  **Digital Inclusivity**: A responsive web application accessible on any device, allowing citizens to file complaints with rich media evidence.
2.  **Automated Workflow**: Smart routing of complaints based on categories (Water, Roads, Sanitation) directly to the relevant departments.
3.  **Closed-Loop Feedback**: A notification system that keeps citizens informed at every step—from "Assigned" to "In Progress" to "Resolved"—with direct messaging capabilities from officers.

---

## 🏛 System Architecture

IMPACT follows a robust **Model-View-Controller (MVC)** architectural pattern, ensuring separation of concerns, scalability, and maintainability.

### 1. Client-Side Architecture (Frontend)
The frontend is built with **React 19** and **Vite**, prioritizing performance and user experience.
*   **Component-Based Design**: The UI is decomposed into reusable, isolated components (e.g., `ComplaintCard`, `OfficerStats`, `NotificationPanel`), promoting consistency and reducing code duplication.
*   **State Management**: Utilizes React's Context API and Hooks (`useState`, `useEffect`) for managing global authentication state and local UI states, ensuring responsive data flow without prop-drilling.
*   **Routing**: **React Router v7** handles client-side navigation, protecting private routes (like User Dashboard and Officer Portal) using Higher-Order Components (HOCs) that check for valid JWT tokens.

### 2. Server-Side Architecture (Backend)
The backend is powered by **Node.js** and **Express.js v5**, designed to handle high concurrency and asynchronous operations.
*   **RESTful API Design**: clear, resource-oriented endpoints supporting standard HTTP methods.
*   **Controller Logic**: Business logic is encapsulated in controllers, keeping routes clean and testable.

---

## 🔐 Middleware & Security Layers

The core of IMPACT's security and role management lies in its robust middleware architecture.

### Authentication Middleware (`authMiddleware.js`)
This middleware protects private routes by verifying the identity of the requester.
1.  **Token Extraction**: It looks for a Bearer token in the `Authorization` header of the incoming request.
2.  **JWT Verification**: The token is cryptographically verified using `jsonwebtoken` and the server's secret key.
3.  **User/Officer Retrieval**:
    *   The payload (user ID) is extracted.
    *   The system first attempts to find a matching ID in the **User** collection.
    *   If not found, it checks the **Officer** collection.
    *   This dual-check mechanism allows a single middleware to authenticate both citizens and officials seamlessly.
4.  **Context Attachment**: The authenticated entity is attached to `req.user`, making it available to subsequent controllers.

### Role-Based Access Control (`roleMiddleware.js`)
For endpoints requiring specific privileges (e.g., resolving a complaint), the `authorize` middleware is used.
*   **Input**: Takes a list of allowed roles (e.g., `authorize('officer', 'admin')`).
*   **Logic**: Checks if `req.user.role` matches any of the allowed roles.
*   **Rejection**: If the role is unauthorized, it immediately returns a `403 Forbidden` response, preventing unauthorized actions.

---

## 🗄 Database & Data Storage

IMPACT uses **MongoDB**, a NoSQL database, for its document-oriented storage capabilities. This choice is pivotal for handling the variable nature of civic data.

### Storage Strategy
*   **Collections**: Data is segregated into three primary collections: `users`, `officers`, and `complaints`.
*   **Documents**: Each entry is stored as a BSON document. Mongoose schemas define the structure but allow for flexibility (e.g., optional image fields).
*   **Relationships**: Instead of expensive JOIN operations, IMPACT uses **References** (`ObjectId`).
    *   A `Complaint` document contains a `userId` field pointing to the `User` collection.
    *   When an officer is assigned, their `_id` is stored in the `assignedTo` field of the complaint.
    *   `populate()` methods are used during data retrieval to seamlessly fetch related data (e.g., getting the name of the user who filed a complaint).

### Mongoose Models
1.  **User Model**: Stores citizen profiles and a strictly typed `notifications` array. The array structure allows efficient appending of updates without creating a separate collection for notifications.
2.  **Officer Model**: Key field `department` acts as a discriminator, ensuring officers only access data relevant to their jurisdiction (e.g., 'Water' officers cannot access 'Road' complaints).
3.  **Complaint Model**: The central hub data. It uses strict Enums for `status` ('Pending', 'Assigned', 'In Progress', 'Resolved') to maintain state machine integrity.

---

## 👥 User & Officer Workflows

### Citizen Lifecycle
1.  **New User Creation**:
    *   A citizen visits the registration page.
    *   They submit details: Name, Email, Password, Phone, and Ward Number.
    *   The backend validates uniqueness (Email/Phone must be unique).
    *   Password is hashed using **Bcrypt** (salt rounds: 10).
    *   A specialized **JWT** is issued immediately, logging them in.
2.  **Complaint Filing**:
    *   Authenticated user submits a form.
    *   The system automatically tags the complaint with the user's ID and sets status to 'Pending'.

### Officer Lifecycle
1.  **Officer Creation**:
    *   *Security Note*: Officers cannot self-register to prevent unauthorized access to sensitive data.
    *   **Seed/Admin Creation**: Officers are typically created via a protected admin route (`/api/auth/officer/register`) or a database seed script.
    *   Each officer is assigned a unique `officerId` (Badge Number) and a specific `department`.
2.  **Assignment & Resolution**:
    *   **View**: An officer logs in and sees a filtered view of complaints matching their department.
    *   **Assign**: They click "Assign", linking their ID to the complaint.
    *   **Resolve**: Upon completion, they mark it "Resolved". This triggers a backend hook that pushes a notification to the Citizen's profile.

---

## 🎨 UI/UX Design & Styling

The user interface is crafted to be intuitive, accessible, and authoritative.

### Visual Identity
*   **Primary Color (`#1e3a8a` - Dark Blue)**: Represents trust, authority, and stability—essential for a civic platform. Used for headers, primary buttons, and navigation.
*   **Secondary Color (`#f59e0b` - Amber)**: Used for calls-to-action (CTAs) and highlighting vital status updates ("Pending"), ensuring they catch the eye without being alarming.
*   **Background (`#f3f4f6` - Light Gray)**: A neutral backdrop that reduces eye strain and allows content cards to stand out.

### Styling Engine: Tailwind CSS v4
IMPACT leverages the latest features of Tailwind CSS for a modern, utility-first approach.
*   **Responsive Design**: All layouts use mobile-first breakpoints (`md:`, `lg:`). The sidebar navigation on desktop transforms into a bottom tab bar or hamburger menu on mobile devices.
*   **Component Abstraction**: Common patterns (like buttons and input fields) are extracted into `@apply` rules in `index.css` or separate React components to maintain design consistency.
*   **Micro-Interactions**: Hover states, focus rings on inputs, and smooth transitions (via `framer-motion`) provide immediate feedback to user actions, making the application feel "alive" and responsive.

---

## 📖 API Reference

### Authentication (`/api/auth`)
*   **POST** `/register`: Register a new citizen user.
*   **POST** `/login`: Login a citizen user.
*   **POST** `/officer/login`: Login an officer.

### Complaints (`/api/complaints`)
*   **POST** `/`: File a new complaint (User).
*   **GET** `/my`: Get all complaints connected to the logged-in user.
*   **GET** `/officer`: Get complaints matching the logged-in officer's department.
*   **PUT** `/:id`: Update status (Assign/Resolve) - restricted to Officers.

### Officer Actions (`/api/officer`)
*   **GET** `/stats`: Get performance statistics.
*   **PUT** `/assign/:id`: Self-assign a complaint.
*   **PUT** `/resolve/:id`: Mark resolved and notify user.
*   **POST** `/message/:id`: Send direct message to complainant.

---

## 🔮 Future Roadmap & Scalability

*   **Geo-Spatial Integration**: Future versions will implement MongoDB's geospatial queries (`$near`, `$geoWithin`) to automatically assign complaints to the nearest available field officer.
*   **AI-Powered Triaging**: Integration of a Python/Flask microservice to analyze complaint descriptions using Natural Language Processing (NLP) to auto-detect severity and categorization.
*   **Public Transparency Portal**: A read-only dashboard for the general public.
*   **Two-Factor Authentication (2FA)**: Adding an SMS-based OTP layer for officer login.

---

## 📞 Support & Contact

**IMPACT Team** - support@impact-city.com
Project Repository: [https://github.com/your-username/impact-project](https://github.com/your-username/impact-project)

---
*Created with ❤️ for a Better, Smarter City*
