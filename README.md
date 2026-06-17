# 🌾 Agro_Intelligence (AgroRisk AI+)

Agro_Intelligence is a state-of-the-art **Smart Farming & Agri-Fintech Ecosystem** designed to empower farmers with modern digital tools. From weather analytics and real-time market rates to AI-powered plant disease diagnosis and loan eligibility simulators, this platform is a complete decision-support system for agricultural success.

🌐 **Live URL**: [https://agro-intelligence-sage.vercel.app/](https://agro-intelligence-sage.vercel.app/)

---

## 🚀 Key Features

- **📊 Farmer Dashboard**: A central hub showing live farm data, active tasks, personal crop logs, and custom recommendations.
- **📈 Marketplace & Rates**: Real-time market rate comparisons, crop pricing indicators, and stock tracking.
- **🌦️ Climate & Weather Advisor**: Live GPS-based weather reports via OpenWeatherMap API integrated with optimal crop schedules.
- **🩺 AI plant Disease Diagnosis**: Instant plant disease identification and health assessment powered by the Plant.id API.
- **💰 Agro Loan Simulator**: Interactive calculator for DLTC Scale of Finance and farm loan eligibility, complete with a structured application form.
- **🎮 Yield Simulator**: Run scenarios on soil quality, water levels, and fertilizers to predict crop yields.
- **💬 Feedback System**: A simple communication tool for farmers to share feedback or ask for support.
- **🔒 Admin Control Center**: View all registered user profiles, status checks, system configurations, and feedbacks.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React.js (v18.2) with Create React App & `@craco/craco`
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Data Visualization**: Recharts (for yield projections & crop market trends)
- **3D Graphics**: Three.js / `@react-three/fiber` / `@react-three/drei` (used for premium homepage visual components)
- **Document Generation**: jsPDF (for downloading loan application summaries)

### **Backend**
- **Framework**: FastAPI (Python 3.10+)
- **Database**: MongoDB (via `motor` AsyncIOMotorClient)
- **Authentication/Security**: Python-jose, Cryptography, Bcrypt
- **Server**: Uvicorn

---

## 💻 Local Development Setup

### **Prerequisites**
- Node.js (v18 or higher)
- Python (v3.10 or higher)
- MongoDB Database

### **1. Frontend Setup**
Navigate to the frontend folder, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm start
```
The React frontend will be available at `http://localhost:3000`.

### **2. Backend Setup**
Navigate to the backend folder, configure environment variables, install dependencies, and start the FastAPI server:
```bash
cd backend
# Create a .env file containing:
# MONGO_URL=your_mongodb_connection_string
# DB_NAME=agro_intelligence

pip install -r requirements.txt
uvicorn server:app --reload --port 8000
```
The backend docs will be available at `http://localhost:8000/docs`.

---

## ☁️ Deployment

### **Frontend Deployment on Vercel**
The project uses a custom Vercel configuration to ensure smooth SPA routing and resilient production builds:
* **Root Vercel Config**: `vercel.json`
* **Sub-folder Vercel Config**: `frontend/vercel.json`

To trigger a manual deploy to Vercel production:
```bash
npx vercel --prod --yes
```

---

## 📄 License
This project is licensed under the MIT License.
