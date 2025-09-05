#!/bin/bash

echo "🚀 Setting up Civic Reporting System..."

# Install dependencies for citizen portal
echo "📦 Installing Citizen Portal dependencies..."
cd citizen-portal
npm install @supabase/supabase-js \
  react-router-dom \
  leaflet react-leaflet \
  tailwindcss autoprefixer postcss \
  vite-plugin-pwa \
  lucide-react

# Setup Tailwind CSS
npx tailwindcss init -p
echo "module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: []
}" > tailwind.config.js

# Add Tailwind directives to index.css
echo "@tailwind base;
@tailwind components;
@tailwind utilities;" > src/index.css

# Copy env file
cp ../.env.example .env

cd ..

# Install dependencies for admin dashboard
echo "📦 Installing Admin Dashboard dependencies..."
cd admin-dashboard
npm install @supabase/supabase-js \
  react-router-dom \
  leaflet react-leaflet \
  tailwindcss autoprefixer postcss \
  recharts \
  lucide-react

# Setup Tailwind CSS
npx tailwindcss init -p
echo "module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: []
}" > tailwind.config.js

# Add Tailwind directives to index.css
echo "@tailwind base;
@tailwind components;
@tailwind utilities;" > src/index.css

# Copy env file
cp ../.env.example .env

cd ..

# Create package.json in root for running both apps
echo '{
  "name": "civic-reporting-system",
  "scripts": {
    "dev": "npm run dev:citizen & npm run dev:admin",
    "dev:citizen": "cd citizen-portal && npm run dev",
    "dev:admin": "cd admin-dashboard && npm run dev -- --port 5174",
    "build": "npm run build:citizen && npm run build:admin",
    "build:citizen": "cd citizen-portal && npm run build",
    "build:admin": "cd admin-dashboard && npm run build"
  },
  "devDependencies": {
    "concurrently": "^7.6.0"
  }
}' > package.json

npm install

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env files in both citizen-portal and admin-dashboard with your Supabase credentials"
echo "2. Run 'npm run dev' to start both applications"
echo "3. Citizen Portal: http://localhost:5173"
echo "4. Admin Dashboard: http://localhost:5174"