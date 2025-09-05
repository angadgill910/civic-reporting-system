# Frontend Developer Guide

This guide is specifically for frontend developers who will be working on the `citizen-portal` of the Civic Reporting System. It provides essential information about the backend API, data models, and shared utility functions.

## Backend API & Data Models

The backend is powered by Supabase, which provides a PostgreSQL database with auto-generated REST APIs. Below are the key tables and their schemas that your frontend will interact with.

### Table: `profiles`

This table stores user profile information, linked to the Supabase authentication system.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin', 'staff')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `reports`

This is the main table for storing civic issue reports submitted by users.

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

### Table: `report_updates`

This table stores comments or updates on reports. It differentiates between public comments and internal notes for staff.

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

### Table: `report_categories` (Reference Data)

This table provides predefined categories for reports.

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

## Shared Supabase Client

To simplify interaction with the backend, a shared Supabase client and helper functions are available in `shared/supabase.js`. Frontend components should import and use these functions.

### Importing the Client and Helpers

```javascript
import { supabase, uploadImage, getCurrentUser, signIn, signUp, signOut } from '../shared/supabase.js';
```

### Available Helper Functions

- **`supabase`**: The main Supabase client instance. Use this for direct API calls not covered by the helpers below. Refer to [Supabase JavaScript SDK documentation](https://supabase.com/docs/reference/javascript) for usage.
- **`uploadImage(file)`**: Uploads a file to the `report-images` storage bucket and returns the public URL of the uploaded image.
    - `file`: A JavaScript `File` object (e.g., from an `<input type="file">`).
    - **Returns**: A promise that resolves to the public URL of the uploaded image.
- **`getCurrentUser()`**: Fetches the currently authenticated user's data.
    - **Returns**: A promise that resolves to the user object or `null` if not logged in.
- **`signIn(email, password)`**: Authenticates a user with email and password.
    - `email`: The user's email address.
    - `password`: The user's password.
    - **Returns**: A promise that resolves to the sign-in data or throws an error.
- **`signUp(email, password, name)`**: Creates a new user account.
    - `email`: The user's email address.
    - `password`: The user's chosen password.
    - `name`: The user's full name.
    - **Returns**: A promise that resolves to the sign-up data or throws an error.
- **`signOut()`**: Logs out the currently authenticated user.

## Environment Variables

To connect to the Supabase backend, the frontend requires specific environment variables. These are defined in `.env.example` at the project root. Each developer must create their own `.env` file in the `citizen-portal` directory with the correct values provided by the project owner.

Example `.env` entries:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key