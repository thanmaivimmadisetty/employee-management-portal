# Employee Management Portal

A complete corporate Workforce Suite built with React, Vite, Tailwind CSS, Node.js, Express, and MySQL.

## Project Structure
```text
employee-management-portal/
├── database/
│   ├── schema.sql      # Database tables definition
│   └── seed.sql        # Prepopulated sample accounts, holidays, and history logs
├── backend/
│   ├── config/db.js    # MySQL connection configuration
│   ├── controllers/    # API controllers
│   ├── middleware/     # JWT authentication & authorization
│   ├── routes/api.js   # Unified backend routes
│   ├── .env.example    # Configuration template
│   ├── .env            # Configured environment keys
│   ├── package.json    # Backend project metadata & script runners
│   └── server.js       # Main server entrypoint
├── frontend/
│   ├── src/
│   │   ├── components/ # Common UI Layout, Sidebar, Navbar, Tables, Modals
│   │   ├── context/    # Auth context provider & hooks
│   │   ├── pages/      # Sub-module screens (Login, Leaves, Payroll, etc.)
│   │   ├── utils/      # Axios wrapper config
│   │   ├── App.jsx     # Route router declarations
│   │   ├── index.css   # Stylesheets & gradients definitions
│   │   └── main.jsx    # React mount point
│   ├── index.html      # Root DOM loader
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json    # Frontend dependency list
└── README.md           # Instructions handbook
```

---

## Features

1. **Dashboard & KPIs**: Visual Recharts bar graphs & area charts mapping department headcounts & monthly expenditure trends.
2. **Dynamic Authentication**: Role-gated workflows supporting **Admin, HR, Manager, and Employee** roles.
3. **Employee Management**: Full CRUD operations for creating, editing, and deleting workforce records.
4. **Departments**: Assign department managers and structure organizational business units.
5. **Attendance Trackers**: Single-click check-in and check-out tracking shift timestamps and attendance reports.
6. **Leave Management**: Standard forms for employees to submit days off and managers to approve/reject them.
7. **Payroll Center**: Receipt-style statement printer modals and HR releases for pay slips.
8. **Recruitment Board**: Create jobs, manage candidates pipeline, and advance hiring stages.
9. **Performance Reviews**: Give stars and comments to grade employee accomplishments.
10. **Holidays**: Shared corporate holiday calendar dashboards.
11. **Notifications**: Instantly receive alerts for leave actions, performance feedback, and payroll drafts.
12. **CSV Reports Export**: Select a report category and download spreadsheet audits directly from the browser.

---

## Prerequisites
- **Node.js** (v18 or higher recommended)
- **MySQL Server** (v8.x recommended)
- **VS Code** (for code exploration)

---

## Installation & Setup

### 1. Database Configuration
1. Open your MySQL client (e.g., MySQL Workbench, Command Line, or phpMyAdmin).
2. Run the DDL statements in [database/schema.sql](file:///C:/Users/thanm/.gemini/antigravity/scratch/employee-management-portal/database/schema.sql) to define the `employee_db` schema and create all matching tables.
3. Run the statements in [database/seed.sql](file:///C:/Users/thanm/.gemini/antigravity/scratch/employee-management-portal/database/seed.sql) to populate sample roles, default accounts, and logs.

### 2. Backend API Setup
1. Open your terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Open `backend/.env` and update your MySQL credentials if they differ from the defaults:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=employee_db
   JWT_SECRET=super_secret_jwt_token_for_employee_management_portal
   ```
4. Start the backend Node service:
   ```bash
   npm run dev
   ```
   *The backend will boot up at `http://localhost:5000` and confirm your database status.*

### 3. Frontend UI Setup
1. Open a new terminal session and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot up the Vite local dev server:
   ```bash
   npm run dev
   ```
   *The frontend dashboard will load at `http://localhost:3000`.*

---

## Credentials Checklist

To test the system under different roles, use the following preloaded accounts (all share the password `password123`):

| Role | Email | Password | Allowed Navigation Modules |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@portal.com` | `password123` | Dashboard, Employees, Departments, Attendance, Leaves, Payroll, Recruitment, Performance, Holidays, Reports |
| **HR** | `hr@portal.com` | `password123` | Dashboard, Employees, Departments, Attendance, Leaves, Payroll, Recruitment, Performance, Holidays, Reports |
| **Manager** | `manager@portal.com` | `password123` | Dashboard, Employees, Attendance, Leaves, Performance, Holidays |
| **Employee** | `employee@portal.com` | `password123` | Dashboard, Attendance, Leaves, Payroll, Performance, Holidays |

> [!TIP]
> **Mock Mode Fallback**: If you load the frontend without starting MySQL, the portal will automatically fall back to **Demo Mock Mode** so you can click around, simulate check-ins, apply for leaves, post jobs, and run reports without database errors.
