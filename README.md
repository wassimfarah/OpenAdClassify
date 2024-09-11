
---

# Classified Ad Web Application

## Table of Contents

1. [About](#about)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Requirements](#requirements)
5. [Setup Instructions](#setup-instructions)
   - [1. Clone the Repository](#1-clone-the-repository)
   - [2. Install Backend Dependencies](#2-install-backend-dependencies)
   - [3. Configure Environment](#3-configure-environment)
     - [Step 1: Copy Environment Variables](#step-1-copy-environment-variables)
     - [Step 2: Create Media Folders](#step-2-create-media-folders)
     - [Step 3: Set Up PostgreSQL Database](#step-3-set-up-postgresql-database)
     - [Step 4: Edit Environment Variables](#step-4-edit-environment-variables)
   - [4. Prisma Setup](#4-prisma-setup)
     - [Step 1: Generate Prisma Client](#step-1-generate-prisma-client)
     - [Step 2: Apply Database Migrations](#step-2-apply-database-migrations)
     - [Step 3: Seed the Database (Recommended)](#step-3-seed-the-database-recommended)
   - [5. Run the Backend Server](#5-run-the-backend-server)
   - [6. Set Up Redis](#6-set-up-redis)
   - [7. Frontend Setup](#7-frontend-setup)
     - [Step 1: Navigate to the Frontend Directory](#step-1-navigate-to-the-frontend-directory)
     - [Step 2: Install Frontend Dependencies](#step-2-install-frontend-dependencies)
     - [Step 3: Copy Environment Variables](#step-3-copy-environment-variables)
     - [Step 4: Run the Frontend Server](#step-4-run-the-frontend-server)
6. [License](#license)

## About

**OpenAdClassify** is a straightforward classified ads app built with the latest versions of **Next.js** (14.2.6) and **NestJS** (10.4.4). It allows users to post and manage ads, chat in real-time, and offers secure access with strong authentication.

## Key Features

- **CRUD Operations for Ads**: Users can create, read, update, and delete ads.
- **Real-Time Messaging**: Integrated real-time messaging using Socket.IO for instant communication and message status updates.
- **Ad History Page**: Dedicated page to view, edit, and delete previous ads.
- **Media Management**: Upload and manage media associated with ads.
- **Authentication and Authorization**: JWT-based authentication with role-based access control, using HTTP-only cookies and token refresh mechanisms.
- **Notifications**: Real-time notifications for new messages.
- **Responsive UI**: Enhanced user experience with a minimalist footer, loading spinners, and various UX/UI improvements.
- **Protected Routes**: Route redirection for protected and restricted areas.
- **Error Handling**: Improved error handling and configurable token expiration.

## Tech Stack

### Backend

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Prisma**: A modern database toolkit to query and manage data in PostgreSQL.
- **PostgreSQL**: Database system used for storing application data.
- **Redis**: Used for managing JWT token refresh and revocation.
- **Socket.IO**: For real-time communication and messaging.
- **JWT**: For secure token-based authentication.
- **ioredis**: Redis client for Node.js.
- **Bcrypt**: For hashing passwords.

### Frontend

- **Next.js**: A React framework for server-side rendering and static site generation.
- **React**: A JavaScript library for building user interfaces.
- **Redux Toolkit**: For state management.
- **Axios**: For making HTTP requests.
- **Bootstrap**: CSS framework for responsive design.
- **Tailwind CSS**: Utility-first CSS framework.
- **React Toastify**: For adding notifications.

## Requirements

- **Node.js**: 
  - **Frontend**: 18.17.1 or higher.
  - **Backend**: 20.6.0 or higher.
- **PostgreSQL**: For database management.
- **Redis**: For caching and token management. Can be easily installed via Docker Desktop by pulling the Redis image and starting it.

## Setup Instructions

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/wassimfarah/OpenAdClassify.git
```

```bash
cd OpenAdClassify
```

### 2. Install Backend Dependencies

Navigate to the `backend` directory and install the dependencies:

```bash
cd backend
pnpm install  # or use `npm install` or `yarn install`
```

### 3. Configure Environment

#### Step 1: Copy Environment Variables

Copy the example environment file to `.env` and update it with your specific configuration:

```bash
cp .env.example .env
```

#### Step 2: Create Media Folders

Create folders for storing media with the specified structure. You can create these directories manually or run the following commands.

**Media Structure:**

```
uploads
├── ads
│   ├── images
│   └── videos
└── profiles
    └── avatars
```

**For Linux and macOS (Unix-like systems):**

```bash
mkdir -p uploads/{ads/{images,videos},profiles/avatars}
```

**For Windows PowerShell:**

```powershell
New-Item -ItemType Directory -Path "uploads", "uploads/ads/images", "uploads/ads/videos", "uploads/profiles/avatars" -Force
```

**Alternatively, create folders one at a time for Unix-like systems:**

```bash
mkdir -p uploads
mkdir -p uploads/ads/images
mkdir -p uploads/ads/videos
mkdir -p uploads/profiles/avatars
```

**Or for Windows Command Prompt (cmd.exe):**

```cmd
mkdir uploads
mkdir uploads\ads
mkdir uploads\ads\images
mkdir uploads\ads\videos
mkdir uploads\profiles
mkdir uploads\profiles\avatars
```

#### Step 3: Set Up PostgreSQL Database

Create a new empty database in PostgreSQL and note down the database name, user, and password.

#### Step 4: Edit Environment Variables

Update the `.env` file with your specific PostgreSQL configuration (`DB_NAME`, `DATABASE_URL`, etc.).

### 4. Prisma Setup

#### Step 1: Generate Prisma Client

Run the following command to generate the Prisma client:

```bash
npx prisma generate
```

#### Step 2: Apply Database Migrations

Run the following command to apply the Prisma schema to your database:

```bash
npx prisma migrate dev
```

#### Step 3: Seed the Database (Recommended)

Seed the database with categories and subcategories by executing the `seed.ts` script:

```bash
ts-node prisma/seed.ts
```

### 5. Run the Backend Server

Start the backend server using your preferred package manager:

```bash
pnpm run dev  # or use `npm run dev` or `yarn run dev`
```

You should see a message indicating the server is running on a specific port.

### 6. Set Up Redis (if not installed)

#### Step 1: Install Redis

**Using Docker (recommended):**

1. **Pull the Redis Image:**

   ```bash
   docker pull redis
   ```

2. **Start a Redis Container:**

   ```bash
   docker run --name redis -p 6379:6379 -d redis
   ```

**Without Docker (alternative):**

1. **Install Redis:**

   Follow the installation instructions for your Linux distribution from the [official Redis documentation](https://redis.io/download).

2. **Start Redis:**

   ```bash
   redis-server
   ```

### 7. Frontend Setup

#### Step 1: Navigate to the Frontend Directory

Navigate to the `next_app` folder:

```bash
cd nextjs-app
```

#### Step 2: Install Frontend Dependencies

Install the dependencies for the frontend:

```bash
pnpm install  # or use `npm install` or `yarn install`
```

#### Step 3: Copy Environment Variables

Copy the example environment file to `.env.local`:

```bash
cp .env.example .env.local
```

**Note:** If you adjusted the port or origin in the backend `.env` file, make sure to make corresponding adjustments in the `env.local` file of the frontend. The `ORIGIN` in the backend `.env` must match the origin of the frontend.

#### Step 4: Run the Frontend Server

Start the frontend server:

```bash
pnpm run dev  # or use `npm run dev` or `yarn run dev`
```

## License

This project is licensed under the MIT License 

---

Thank you for checking out the Classified Ad Web Application! If you have any questions or need further assistance, feel free to contact me. Contributions are welcome, and I appreciate any feedback or suggestions. Enjoy building and exploring the application! 😊