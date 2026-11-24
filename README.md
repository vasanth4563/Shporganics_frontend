# SHP Organics – Frontend Web Application

Modern, responsive organic e-commerce web application built with React, TypeScript, Material UI, and Vite.

---

## 🛠 Tech Stack

- **React 18**
- **TypeScript**
- **Vite**
- **Material UI (MUI v6)**
- **Emotion**
- **React Router DOM v6**
- **Axios**
- **Lucide React** Icons

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration (Optional)

Create `.env` in the `frontend` folder if connecting to a custom backend URL:
```env
VITE_API_URL=http://localhost:8000
```
*(If left unset, it defaults to `http://localhost:8000` via proxy/mock).*

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production

```bash
npm run build
```

---

## 📦 Pushing to Separate GitHub Repository

To push this frontend into its own repository:

```bash
# Navigate to the frontend directory
cd frontend

# Initialize Git repository
git init

# Stage all frontend files
git add .

# Create initial commit
git commit -m "Initial commit - SHP Organics Frontend"

# Set default branch to main
git branch -M main

# Add your GitHub remote URL
git remote add origin https://github.com/<your-username>/<your-frontend-repo-name>.git

## 🌐 Deploying Frontend to Vercel

1. Push this frontend repository to GitHub (see above).
2. Go to [vercel.com](https://vercel.com) and click **Add New...** -> **Project**.
3. Import your `shp-organics-frontend` repository.
4. Set the Framework Preset to **Vite**.
5. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://<your-render-app-name>.onrender.com` (Your deployed Render backend URL)
6. Click **Deploy**!
7. Your live store will be ready at `https://<project-name>.vercel.app`.
