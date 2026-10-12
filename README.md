# 🎓 Campus Lost & Found Portal
> **A Full-Stack College Web Application built with Java, Spring Boot, Spring Data JPA, Hibernate, MySQL, and Modern Responsive Frontend.**

---

## 📌 1. Project Overview & Problem Statement

### The Problem
On every college campus, students and faculty routinely misplace personal belongings—such as student ID cards, earphones, laptop chargers, calculators, wallets, lab records, and textbooks. 
In traditional campuses, the recovery process is fragmented:
- Unorganized WhatsApp groups or college notice boards.
- No central place to track if someone picked up an item.
- No verification to ensure found items are given back to the rightful owner.
- Lack of audit trail or privacy safeguards.

### The Solution: Campus Lost & Found Portal
The **Campus Lost & Found Portal** is an end-to-end digital web platform designed specifically for college campuses:
- **Instant Reporting**: File lost or found reports within 60 seconds with photos, locations, and identifying marks.
- **Smart Matching Radar**: An automated algorithm that correlates lost reports with found records based on category, title keywords, campus location, color, brand, and date proximity.
- **Secure Claims**: Students file structured claims with proof/ownership secrets. The finder or campus security verifies the claim before handing over the item.
- **Privacy Protection**: Contact details are protected, allowing verified students to reach each other safely.
- **Administrative Oversight**: Full admin control to manage reports, approve/reject claims, monitor campus safety metrics, and view real-time graphical analytics.

---

## 🏗️ 2. System Architecture

```text
+---------------------------------------------------------------------------------+
|                                 CLIENT TIER                                     |
|    HTML5 • CSS3 (Modern Design System) • Bootstrap 5.3 • JavaScript (ES6)      |
|         Chart.js (Admin Visualizations) • Responsive (Mobile / Desktop)         |
+---------------------------------------------------------------------------------+
                                       │
                                       │ REST APIs (JSON / Multipart HTTP)
                                       ▼
+---------------------------------------------------------------------------------+
|                                APPLICATION TIER                                 |
|                       Spring Boot 3.3.4 (Embedded Tomcat 8080)                  |
|                                                                                 |
|  ┌──────────────────┐    ┌──────────────────┐    ┌───────────────────────────┐  |
|  │   Controllers    │───►│     Services     │───►│   Spring Data Repositories│  |
|  │  - AuthController│    │  - AuthService   │    │  - UserRepository         │  |
|  │  - ItemController│    │  - ItemService   │    │  - ItemRepository         │  |
|  │  - ClaimController    │  - ClaimService  │    │  - ClaimRepository        │  |
|  │  - AdminController    │  - MatchingService    └─────────────┬─────────────┘  |
|  │  - FileUploadCtrl│    │  - AdminService  │                  │                |
|  └──────────────────┘    └──────────────────┘                  │                |
|                                                                ▼                |
|                                                         Hibernate / JPA         |
+----------------------------------------------------------------┼----------------+
                                                                 │
                                                                 ▼
+---------------------------------------------------------------------------------+
|                                 DATABASE TIER                                   |
|       MySQL 8.0 (Production)  /  H2 Persistent File Storage (Demo/Standalone)  |
|       Tables: users  •  items  •  claims                                       |
+---------------------------------------------------------------------------------+
```

---

## 💻 3. Technology Stack

| Layer | Technology | Rationale / Purpose |
| :--- | :--- | :--- |
| **Backend Framework** | Java 17+ (JDK 21/26), Spring Boot 3.3.4 | Industry-standard enterprise framework for RESTful APIs and rapid development. |
| **Persistence / ORM** | Spring Data JPA, Hibernate | Automates SQL query generation, schema synchronization, and relationship mapping. |
| **Security & Hashing** | Spring Security Crypto (`BCryptPasswordEncoder`) | One-way salted cryptographic hashing for student and admin passwords. |
| **Database** | MySQL 8.0 & H2 Database | MySQL for enterprise production; H2 file-backed storage for zero-config portable viva demos. |
| **Frontend UI** | HTML5, CSS3, Bootstrap 5.3, FontAwesome 6 | Clean navy/slate styling, cards, status pills, and responsive layout without heavy NPM toolchains. |
| **Frontend Logic** | Vanilla ES6 JavaScript (Fetch API) | Native browser execution, decoupled client-side rendering, and instant responsiveness. |
| **Visualizations** | Chart.js | Interactive charts for campus report categories and status breakdown. |

---

## 🗄️ 4. Database Schema & ER Design

### Table: `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| `name` | VARCHAR(100) | NOT NULL | Full student/staff name |
| `email` | VARCHAR(150) | NOT NULL, UNIQUE | College email address |
| `student_id` | VARCHAR(50) | NOT NULL, UNIQUE | College Roll / ID (e.g., `CS2024-042`) |
| `phone` | VARCHAR(20) | NOT NULL | Contact telephone number |
| `password` | VARCHAR(255) | NOT NULL | BCrypt encrypted password hash |
| `role` | VARCHAR(30) | NOT NULL, DEFAULT `'ROLE_STUDENT'` | `'ROLE_STUDENT'` or `'ROLE_ADMIN'` |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |

### Table: `items`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique report identifier |
| `item_name` | VARCHAR(150) | NOT NULL | Name/title of item |
| `type` | VARCHAR(10) | NOT NULL | `'LOST'` or `'FOUND'` |
| `category` | VARCHAR(50) | NOT NULL | Electronics, ID Cards, Books, Bags, etc. |
| `description` | TEXT | | Detailed narrative |
| `item_date` | DATE | | Date misplaced or discovered |
| `item_time` | VARCHAR(50) | | Time of incident |
| `location` | VARCHAR(200) | NOT NULL | Specific campus spot (e.g., Library 2nd Floor) |
| `color` | VARCHAR(50) | | Primary color |
| `brand` | VARCHAR(100) | | Brand / Make (e.g., Boat, HP, Casio) |
| `identifying_details` | TEXT | | Unique marks, scratches, stickers |
| `current_location` | VARCHAR(200) | | Safe storage spot (Security Desk, Admin Office) |
| `contact_info` | VARCHAR(100) | | Phone or email to reach finder/owner |
| `image_url` | VARCHAR(500) | | Path or URL to uploaded photo |
| `status` | VARCHAR(30) | NOT NULL, DEFAULT `'ACTIVE'` | `'ACTIVE'`, `'CLAIMED'`, `'MATCHED'`, `'RETURNED'`, `'CLOSED'` |
| `user_id` | BIGINT | FOREIGN KEY (`users.id`) | Student who reported the item |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Report submission timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last modification timestamp |

### Table: `claims`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique claim identifier |
| `item_id` | BIGINT | FOREIGN KEY (`items.id`) | Found item being claimed |
| `claimant_id` | BIGINT | FOREIGN KEY (`users.id`) | Student claiming ownership |
| `claimant_name` | VARCHAR(100) | NOT NULL | Claimant full name |
| `claimant_student_id`| VARCHAR(50) | NOT NULL | Claimant College ID |
| `claimant_phone` | VARCHAR(20) | NOT NULL | Claimant contact phone |
| `reason` | TEXT | NOT NULL | Explanation of ownership |
| `additional_details`| TEXT | | Private proof (lock screen, serial number) |
| `status` | VARCHAR(30) | NOT NULL, DEFAULT `'PENDING'` | `'PENDING'`, `'APPROVED'`, `'REJECTED'` |
| `admin_notes` | TEXT | | Remarks by reviewer |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Submission timestamp |

---

## ⚡ 5. Smart Matching Algorithm Explained

The system implements a transparent, multi-attribute scoring model in `MatchingService.java`. When evaluating any item against active records of the opposite type (`LOST` vs `FOUND`), points are awarded based on:

$$\text{Score} = S_{\text{category}} + S_{\text{keywords}} + S_{\text{location}} + S_{\text{color}} + S_{\text{brand}} + S_{\text{date}}$$

1. **Category Match (+35 points)**: If categories are identical (e.g., both are `Electronics`).
2. **Item Name Match (+25 points)**: If title substrings match, or +15 points if key words match.
3. **Location Match (+20 points)**: Substring match on campus spot (e.g., `Library` matches `Central Library 2nd Floor`).
4. **Color Match (+10 points)**: Matching color descriptor.
5. **Brand Match (+10 points)**: Matching brand name (e.g., `Boat`, `Apple`).
6. **Date Proximity (+10 points)**: Lost date and found date within 3 days of each other.

If total score $\ge 40$, the item is flagged as a **"Possible Match Found"**, displaying the confidence score and matching reasons directly on the item's details page.

---

## 🔌 6. REST API Endpoints

### Authentication & Users
- `POST /api/auth/register` : Create new student/admin account
- `POST /api/auth/login` : Authenticate user & return session details
- `GET /api/users` : List registered users
- `GET /api/users/{id}` : Fetch specific user profile

### Items (Lost & Found)
- `GET /api/items` : List all item reports (optional `?type=LOST` or `?type=FOUND`)
- `GET /api/items/{id}` : Get single item record
- `GET /api/items/recent-found` : Get recent found items for landing page
- `GET /api/items/search` : Multi-filter search (`keyword`, `category`, `status`, `location`, `type`)
- `GET /api/items/user/{userId}` : Get reports created by a user
- `GET /api/items/{id}/matches` : Execute smart matching algorithm for an item
- `POST /api/items/lost` : File a lost item report
- `POST /api/items/found` : File a found item report
- `PUT /api/items/{id}` : Update item report
- `PUT /api/items/{id}/status` : Change item status (e.g., `RETURNED`)
- `DELETE /api/items/{id}?userId={userId}` : Delete item report

### Claims
- `POST /api/claims` : Submit a claim on a found item
- `GET /api/claims` : List all claims
- `GET /api/claims/user/{userId}` : List claims submitted by a user
- `GET /api/claims/owner/{ownerId}` : List claims filed on items found by user
- `PUT /api/claims/{id}` : Approve or Reject claim (updates item status to `CLAIMED`)

### Admin & Utilities
- `GET /api/admin/dashboard` : Retrieve system-wide & user-specific statistics
- `GET /api/admin/users` : Admin view of all users
- `GET /api/admin/items` : Admin view of all items
- `DELETE /api/admin/users/{id}` : Admin user deletion
- `POST /api/upload` : Multipart file upload returning static photo URL

---

## 🚀 7. How to Run the Project

### Prerequisites
1. **Java Development Kit (JDK 17 or higher)** (Java 21 or 26 recommended)
   - Verify in terminal: `java -version`
2. **Maven 3.9+** (Included via `mvn.cmd` in scratch directory or Maven Wrapper)

### Quick Start (Standalone Demo Mode - Zero Setup)
The application is pre-configured with a file-persisted database that requires **zero setup or database installation**.

1. Navigate to the backend folder:
   ```powershell
   cd campus-lost-found/backend
   ```
2. Run the application:
   ```powershell
   # Using the included Maven wrapper:
   .\mvnw.cmd spring-boot:run

   # OR running the pre-compiled JAR:
   java -jar target/campus-lost-found-1.0.0.jar
   ```
3. Open your browser:
   ```text
   http://localhost:8080
   ```

---

### Running with MySQL 8.0 (Production Mode)

1. Open **MySQL Workbench** or the MySQL CLI:
   ```sql
   -- Create database and tables using the provided script
   SOURCE campus-lost-found/database/schema.sql;
   SOURCE campus-lost-found/database/sample_data.sql;
   ```
2. Configure your MySQL credentials in `backend/src/main/resources/application.properties`:
   ```properties
   # Switch active profile to mysql:
   spring.profiles.active=mysql
   ```
   Or edit `backend/src/main/resources/application-mysql.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/campus_lost_found?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
3. Run the project:
   ```powershell
   java -jar target/campus-lost-found-1.0.0.jar
   ```

---

## 🔑 8. Pre-Seeded Viva Demo Accounts

The project includes realistic pre-populated campus data on first startup:

| Account Type | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@campus.edu` | `admin123` | Full access to Admin Panel, user management, and claim decisions |
| **Student 1** | `rahul@campus.edu` | `password123` | Rahul Sharma (CS2024-042) - Lost Boat Earphones, ID Card report |
| **Student 2** | `priya@campus.edu` | `password123` | Priya Patel (EE2023-018) - Found Boat Rockerz, pending claim |
| **Student 3** | `arjun@campus.edu` | `password123` | Arjun Verma (ME2024-089) - Found Casio Watch, Fossil Wallet |

> **Tip for Viva**: On the login page (`login.html`), there are **"Student"** and **"Administrator"** quick-fill buttons that automatically populate credentials with 1 click!

---

## 🎤 9. College Viva Questions & Answers Guide

### Q1: What is the architecture of your project?
**Answer**: It follows a 3-tier Layered Architecture:
1. **Presentation Layer**: HTML5, CSS3, Bootstrap 5, and JavaScript communicating via asynchronous Fetch API requests.
2. **Business / Service Layer**: Spring Boot Controllers handle HTTP endpoints and delegate business logic to dedicated Services (`AuthService`, `ItemService`, `ClaimService`, `MatchingService`, `AdminService`).
3. **Data Access Layer**: Spring Data JPA repositories interface with Hibernate ORM to query the MySQL/relational database.

### Q2: Why did you use Spring Data JPA instead of plain JDBC?
**Answer**: 
- Plain JDBC requires writing repetitive boilerplate code (creating connections, prepared statements, handling `ResultSet` mapping, and manual exception catching).
- Spring Data JPA provides pre-built CRUD methods (`save`, `findById`, `findAll`, `delete`) out of the box.
- It also supports automatic query generation via method naming conventions (e.g. `findByUserIdAndType`) and JPQL queries.

### Q3: How are passwords stored securely?
**Answer**: We use Spring Security's `BCryptPasswordEncoder`. Passwords are never stored as plain text. BCrypt uses a one-way mathematical hashing algorithm combined with a random 128-bit salt and adaptive work factor, protecting against rainbow table and brute-force attacks.

### Q4: Explain your lost & found matching logic.
**Answer**: The matching engine evaluates 6 key criteria between a lost report and existing found items:
- Category equality (+35 points)
- Title keyword similarity (+25 points)
- Campus location proximity (+20 points)
- Color match (+10 points)
- Brand match (+10 points)
- Date proximity within 3 days (+10 points)
If the combined score is 40% or higher, the system highlights it as a "Possible Match" with explanation tags.

### Q5: How does the claim verification process work?
**Answer**: When a student spots an item in the "Found" category, they submit a claim specifying their Student ID, phone number, reason, and private identifying details (such as engravings or phone lock screen wallpaper). The student who found the item or the campus administrator can review these details and either **Approve** or **Reject** the claim. Upon approval, the item's status automatically transitions to `CLAIMED` or `RETURNED`.

---

## 📁 10. Project Directory Structure

```text
campus-lost-found/
├── backend/
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd
│   ├── uploads/                               # Uploaded item photos
│   └── src/main/
│       ├── java/com/campus/lostfound/
│       │   ├── CampusLostFoundApplication.java # Spring Boot entry point
│       │   ├── config/                        # SecurityConfig, WebConfig, DataInitializer
│       │   ├── controller/                    # Auth, Item, Claim, Admin, Upload
│       │   ├── dto/                           # Request & Response Data Transfer Objects
│       │   ├── entity/                        # User, Item, Claim (JPA Entities)
│       │   ├── exception/                     # GlobalExceptionHandler, Custom Exceptions
│       │   ├── repository/                    # UserRepository, ItemRepository, ClaimRepository
│       │   └── service/                       # Business & matching logic services
│       └── resources/
│           ├── application.properties         # Main configuration
│           ├── application-h2.properties      # Zero-config embedded profile
│           ├── application-mysql.properties   # Production MySQL profile
│           └── static/                        # Complete mirrored frontend assets
├── frontend/
│   ├── index.html                             # Landing page with live metrics
│   ├── browse.html                            # Search & multi-filter catalog
│   ├── report-lost.html                       # Report lost item form
│   ├── report-found.html                      # Report found item form
│   ├── item-details.html                      # Details view, matching radar, claim form
│   ├── dashboard.html                         # Personal user dashboard
│   ├── my-reports.html                        # Tabbed management (Lost, Found, Claims)
│   ├── admin.html                             # Admin metrics, charts, & approvals
│   ├── login.html                             # Auth page with quick viva buttons
│   ├── css/style.css                          # Modern campus design system
│   └── js/                                    # api.js, auth.js, browse.js, etc.
├── database/
│   ├── schema.sql                             # MySQL DDL script with foreign keys & indexes
│   └── sample_data.sql                        # Seed data for MySQL Workbench
└── README.md                                  # Complete project documentation
```
