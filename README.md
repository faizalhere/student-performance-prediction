# Student Performance Prediction System (EduPredict AI)

A complete full-stack machine learning web application that predicts students' expected final examination marks based on continuous academic indicators:
* Class Attendance Percentage (0–100%)
* Assignment Average Scores (0–100)
* Internal Assessment Marks (0–30)
* Daily Study Hours (0–24)
* Previous Semester Examination Marks (0–100%)

---

## 🚀 Live Application URLs

* **Frontend Dashboard (React + Vite):** [http://localhost:5173](http://localhost:5173)
* **Backend REST API (Flask):** [http://127.0.0.1:5000](http://127.0.0.1:5000)
* **API Health Status:** [http://127.0.0.1:5000/api/health](http://127.0.0.1:5000/api/health)

---

## 🛠️ Technology Stack

* **Frontend:** React 18, Vite 5, Recharts (Interactive charts & evaluation graphs), Lucide React (Icons), Modern SaaS CSS
* **Backend:** Python 3.13, Flask 3.1, Flask-CORS, REST API
* **Machine Learning:** Scikit-learn, Pandas, NumPy, Linear Regression, Random Forest Regressor, Joblib
* **Database:** SQLite (embedded `predictions.db`)
* **Testing:** Pytest

---

## 📁 Project Architecture & Folder Structure

```
intership_project_3rd/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Dashboard with live stats & charts
│   │   │   ├── Predict.jsx        # Academic indicator input form + presets
│   │   │   ├── Result.jsx         # Circular score gauge & targeted advice
│   │   │   ├── History.jsx        # SQLite history with search & delete
│   │   │   ├── Evaluation.jsx     # Empirical MAE/RMSE/R² & feature importance
│   │   │   └── About.jsx          # Pipeline architecture & documentation
│   │   ├── services/
│   │   │   └── api.js             # Centralized API service
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css              # Custom modern SaaS styling
│   ├── package.json
│   ├── vite.config.js
│   ├── .env
│   └── index.html
├── backend/
│   ├── app.py                     # Flask REST API endpoints
│   ├── train_model.py             # ML pipeline, 80:20 split, model selector
│   ├── generate_dataset.py        # Generates realistic 600-student dataset
│   ├── predict.py                 # Predictor class wrapper
│   ├── utils.py                   # SQLite database & recommendation rules
│   ├── data/
│   │   └── students.csv           # 600-sample academic dataset
│   ├── models/
│   │   ├── best_model.joblib      # Champion regression model
│   │   ├── LinearRegression.joblib
│   │   ├── RandomForestRegressor.joblib
│   │   └── metrics.json           # Real evaluation metrics & feature importances
│   ├── tests/
│   │   └── test_api.py            # Automated pytest test suite
│   ├── predictions.db             # Persistent SQLite database
│   └── requirements.txt
├── .gitignore
└── README.md
```

---

## ⚡ Running the Project on Windows

### Step 1: Backend Setup & Model Training
Open PowerShell terminal 1:
```powershell
cd D:\intership_project_3rd\backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python train_model.py
python app.py
```
*Backend runs on `http://127.0.0.1:5000`*

### Step 2: Frontend Dev Server
Open PowerShell terminal 2:
```powershell
cd D:\intership_project_3rd\frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 📊 Model Evaluation Results (Held-Out 20% Test Split)

| Regression Model | Test MAE | Test RMSE | Test R² | Status |
| :--- | :---: | :---: | :---: | :---: |
| **Linear Regression** | **1.787** | **2.151** | **0.9147** | 🏆 Champion Model Selected |
| **Random Forest Regressor** | 2.522 | 3.070 | 0.8263 | Benchmark Baseline |

### Feature Importances (Random Forest Gini Contribution):
1. **Previous Marks:** 40.40%
2. **Internal Assessment (0-30):** 34.45%
3. **Assignment Score (0-100):** 12.04%
4. **Daily Study Hours (0-24):** 9.56%
5. **Class Attendance (%):** 3.54%

---

## 🧪 Testing

Run automated tests on the backend API:
```powershell
cd D:\intership_project_3rd\backend
.\.venv\Scripts\pytest
```
*Tests verify /api/health, valid predictions, input range validation (0-100, 0-30), missing field detection, SQLite persistence, and history deletion.*

---

## 📦 How to Create a Distribution ZIP
Run in PowerShell:
```powershell
cd D:\intership_project_3rd
Get-ChildItem -Exclude "node_modules", ".venv", "dist", "*.zip" | Compress-Archive -DestinationPath "Student_Performance_Prediction_System.zip"
```
