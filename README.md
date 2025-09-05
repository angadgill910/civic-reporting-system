# Civic Reporting System

A web-based platform for citizens to report civic issues (like potholes, broken streetlights) and for municipal staff to manage and resolve them.

## Tech Stack

- **Frontend:** React + Vite, Tailwind CSS, Leaflet (for maps)
- **Backend:** Supabase (PostgreSQL, Authentication, Storage, Realtime)
- **Deployment:** Vercel (Frontend), Supabase (Backend)

## Project Structure

- `citizen-portal/`: The main application for citizens to submit reports.
- `admin-dashboard/`: The application for municipal staff to manage reports.
- `shared/`: Common code, including the Supabase client.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/angadgill910/civic-reporting-system.git
    cd civic-reporting-system
    ```

2.  **Install Dependencies:**
    You can either run the provided setup script or install dependencies manually.
    ```bash
    # Using the setup script (recommended)
    chmod +x setup.sh
    ./setup.sh

    # Or install manually
    cd citizen-portal && npm install && cd ..
    cd admin-dashboard && npm install && cd ..
    npm install # For root concurrently dependency
    ```

3.  **Configure Environment Variables:**
    - Copy `.env.example` to `.env` in both `citizen-portal/` and `admin-dashboard/`.
    - Update the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with your Supabase project's credentials.

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    - Citizen Portal will be available at `http://localhost:5173`
    - Admin Dashboard will be available at `http://localhost:5174`

## Applications

This project includes three applications:

1. **Landing Page** (`http://localhost:3000`): Entry point that routes to citizen portal or admin dashboard
2. **Citizen Portal** (`http://localhost:5173`): Main application for citizens to submit reports
3. **Admin Dashboard** (`http://localhost:5174`): Application for municipal staff to manage reports

## Development URLs

- Landing Page: http://localhost:3000
- Citizen Portal: http://localhost:5173  
- Admin Dashboard: http://localhost:5174

## Single Vercel Deployment

This project is configured for single Vercel deployment with these production URLs:
- Landing Page: `https://your-app.vercel.app/`
- Citizen Portal: `https://your-app.vercel.app/citizen/`
- Admin Dashboard: `https://your-app.vercel.app/admin/`

### Deployment Setup

1. Push code to GitHub
2. In Vercel dashboard:
   - Import your GitHub repository
   - Build Command: `npm run vercel-build`
   - Output Directory: (leave empty)
   - Install Command: `npm run install:all`
3. Add environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

## Deployment

- **Frontend (Vercel):**
  1. Push code to this GitHub repository.
  2. Connect the repository to Vercel.
  3. Set the environment variables in Vercel.
  4. Configure build settings:
     - **Citizen Portal:**
       - Build Command: `cd citizen-portal && npm run build`
       - Output Directory: `citizen-portal/dist`
     - **Admin Dashboard:**
       - Build Command: `cd admin-dashboard && npm run build`
       - Output Directory: `admin-dashboard/dist`

- **Backend (Supabase):**
  - The Supabase project is already set up. Ensure your environment variables in Vercel match your Supabase project settings.

## Supabase Setup (Initial Configuration)

If setting up Supabase from scratch, run the SQL script provided in `instructions.md` in your Supabase SQL Editor to create tables, policies, and functions.

## Contributing

We welcome contributions to improve the Civic Reporting System!

### Workflow for Collaborators

1.  **Get Access:** An existing project owner needs to add you as a collaborator on the GitHub repository. You will receive an email invitation to accept.
2.  **Clone the Repository:** Once you have access, clone the project to your local machine:
    ```bash
    git clone https://github.com/angadgill910/civic-reporting-system.git
    cd civic-reporting-system
    ```
3.  **Create a New Branch:** Before making any changes, create a new branch for your work. This keeps the `main` branch stable. Use a descriptive name for your branch (e.g., `feature/new-ui-component`, `fix/login-bug`).
    ```bash
    git checkout -b your-branch-name
    ```
4.  **Make Your Changes:** Implement your feature or fix the bug in your branch.
5.  **Commit Your Changes:** Add and commit your changes with a clear and concise commit message.
    ```bash
    git add .
    git commit -m "Brief description of your changes"
    ```
6.  **Push Your Branch:** Push your branch to the remote repository on GitHub.
    ```bash
    git push -u origin your-branch-name
    ```
7.  **Open a Pull Request (PR):** Go to the repository on GitHub. You should see a prompt to create a Pull Request from your new branch. Click on it, provide a title and detailed description for your PR, and submit it.
8.  **Review and Merge:** Project maintainers will review your PR. They may request changes. Once approved, your PR will be merged into the `main` branch.

### Frontend Design Improvements

If you are tasked with improving the frontend's look and feel:
- Focus on the `citizen-portal/` directory for the main user-facing application.
- Key components to enhance include `src/components/ReportForm.jsx`, `src/components/ReportsList.jsx`, and `src/components/Auth.jsx`.
- Leverage Tailwind CSS for styling. Consider introducing a UI component library like Shadcn/UI or Mantine for more advanced components (discuss with the team first).
- Ensure all changes are mobile-responsive and align with a modern, user-friendly design.

Thank you for contributing!
