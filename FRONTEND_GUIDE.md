# Frontend Developer Guide

This guide is specifically for frontend developers working on the `citizen-portal` of the Civic Reporting System. Its goal is to provide clear, actionable information to help you build the user interface. Whether you're coding manually or using AI tools for assistance, this document is structured to be your primary reference.

## Project Overview

Your task is to create a user-friendly web application (the "Citizen Portal") where residents can:
1.  Sign up and log in.
2.  Submit reports about civic issues (like potholes or broken streetlights), including a photo and location.
3.  View a list of reports they have submitted.
4.  See the status of their reports as they are processed.

The backend is handled by Supabase, which manages the database, user authentication, and file storage. Your frontend will connect to this backend using a shared JavaScript library (`shared/supabase.js`) and environment variables for configuration.

---

## Backend API & Data Models (The "What")

This section describes the data your frontend will work with. Think of it as the "contract" between your user interface and the backend database.

### Core Data Tables

1.  **`profiles`**: Stores information about each user (you).
2.  **`reports`**: The main table for all submitted civic issue reports.
3.  **`report_updates`**: A log of comments or status changes for each report.
4.  **`report_categories`**: A reference list of issue types (e.g., "Pothole", "Street Light").

### Detailed Table Schemas

These SQL definitions precisely describe each table's structure. An AI tool can use these to understand the data.

#### Table: `profiles`

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin', 'staff')),
 created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table: `reports`

```sql
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('pothole', 'streetlight', 'garbage', 'vandalism', 'other')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  location GEOGRAPHY(POINT, 4326),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  image_url TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table: `report_updates`

```sql
CREATE TABLE public.report_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
 message TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table: `report_categories` (Reference Data)

```sql
CREATE TABLE IF NOT EXISTS report_categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT,
  color TEXT
);

-- Sample Data
INSERT INTO report_categories (id, label, icon, color) VALUES
  ('pothole', 'Pothole', '🕳️', '#EF4444'),
  ('streetlight', 'Street Light', '💡', '#F59E0B'),
  ('garbage', 'Garbage', '🗑️', '#10B981'),
  ('vandalism', 'Vandalism', '🎨', '#8B5CF6'),
  ('other', 'Other', '📝', '#6B7280');
```

---

## Shared Supabase Client (The "How")

To make connecting to the backend easier, we use a shared JavaScript file (`shared/supabase.js`) that contains pre-built functions for common tasks.

### Importing the Client and Helpers

```javascript
import { supabase, uploadImage, getCurrentUser, signIn, signUp, signOut } from '../shared/supabase.js';
```

### Available Helper Functions

Use these functions in your React components to interact with the backend.

- **`signIn(email, password)`**: Log a user in.
- **`signUp(email, password, name)`**: Create a new user account.
- **`signOut()`**: Log the current user out.
- **`getCurrentUser()`**: Get information about the user who is currently logged in.
- **`uploadImage(file)`**: Upload a photo to the server and get a URL to display it.

For more complex database operations (like fetching a list of reports), you will use the main `supabase` client directly. Refer to the [Supabase JavaScript SDK documentation](https://supabase.com/docs/reference/javascript) for detailed instructions.

---

## Environment Variables

Your local development environment needs to know how to connect to the Supabase backend. This information is stored in a file called `.env` inside the `citizen-portal` folder.

Each developer must create their own `.env` file with the credentials provided by the project owner. The `.env.example` file at the project root shows you the format.

Example `.env` entries:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Tips for Working with AI Assistants

If you are using an AI coding assistant, you can copy and paste the prompts below to get started quickly. Just replace the placeholder text with your specific request or component name.

### Prompt 1: General Task Description

```
I am building the frontend for a Civic Issue Reporting System using React, Vite, and Supabase. The backend data models and helper functions are defined in the FRONTEND_GUIDE.md file I've provided. Please help me create a React component that [DESCRIBE THE COMPONENT'S PURPOSE HERE, e.g., 'allows users to submit a new report'].

Key points:
- Use Tailwind CSS for styling.
- Import the Supabase client and helpers from '../shared/supabase.js'.
- Handle loading states and user-friendly error messages.
- The data models are defined in the SQL `CREATE TABLE` statements in FRONTEND_GUIDE.md.
```

### Prompt 2: Specific Data Interaction

```
Using the Supabase JavaScript client, how do I [DESCRIBE THE ACTION, e.g., 'fetch all reports submitted by the current user and display them in a list']? Please provide a complete React component example.

My Supabase helper functions are in `../shared/supabase.js`. The relevant data model is the `reports` table, whose schema is defined as:
```sql
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('pothole', 'streetlight', 'garbage', 'vandalism', 'other')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
 priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  location GEOGRAPHY(POINT, 4326),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  image_url TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```
```

### Prompt 3: Using a Helper Function

```
How can I use the `uploadImage(file)` helper function from `../shared/supabase.js` within a React component to allow a user to upload a photo and get the URL to store in a report? Please show a complete example with state management for the file input and handling the upload process.