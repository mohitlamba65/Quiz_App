# 🎓 Quiz App - Interview Preparation Platform

A full-stack interactive web application designed to help users prepare for technical interviews. This platform offers categorized quizzes in **Aptitude**, **Coding**, and **HR/Interview** domains, featuring real-time timers and performance analytics.

## 🚀 Features

-   **Categorized Quizzes**: Choose from Aptitude, Coding, or HR specific questions.
-   **Interactive Interface**: Smooth, responsive UI built with React and Tailwind CSS.
-   **Real-time Timer**: Countdown timer for each quiz session to simulate exam conditions.
-   **Instant Feedback**: immediate scoring logic on submission.
-   **Performance Analytics**: Visual breakdown of results using **Recharts** (Pie charts for correct/incorrect ratio).
-   **User Tracking**: Tracks attempts, scores, and pass/fail status.

## 🛠️ Tech Stack

This project uses the **MERN** stack:

### Frontend
-   **React.js** (Vite): Component-based UI library.
-   **Tailwind CSS**: Utility-first CSS framework for styling.
-   **React Router DOM**: Client-side routing.
-   **Recharts**: For data visualization (Result analysis).
-   **Axios**: HTTP client for API requests.

### Backend
-   **Node.js & Express.js**: RESTful API server.
-   **MongoDB & Mongoose**: NoSQL database for storing questions and results.
-   **Nodemon**: For development server hot-reloading.

## 📂 Project Structure

```bash
Quiz_App/
├── backend/            # Express Server & DB Models
│   ├── modules/
│   │   ├── controllers/
│   │   ├── models/     # Mongoose Schemas (Questions, Results)
│   │   └── routes/     # API Routes
│   ├── app.js          # Entry point
│   └── package.json
│
└── frontend/           # React Client
    ├── src/
    │   ├── modules/    # specific feature modules (Quiz, Result, Start)
    │   ├── shared/     # shared components (NavBar, etc.)
    │   └── App.jsx     # Main Routing
    └── package.json
```

## ⚙️ Installation & Setup

### Prerequisites
-   Node.js installed
-   MongoDB installed and running locally (or a MongoDB Atlas connection string)

### 1. Backend Setup

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file (optional, or configure directly in `app.js`):
    ```env
    PORT=4444
    DB_URL=your_mongodb_connection_string
    ```
4.  Start the server:
    ```bash
    npm start
    ```
    *Server should run on http://localhost:4444*

### 2. Frontend Setup

1.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `frontend` root to configure API endpoints:
    ```env
    VITE_QUESTIONS_URL=http://localhost:4444/questions
    VITE_SAVE_URL=http://localhost:4444/result
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    *Client should run on http://localhost:5173*

## 📝 Usage

1.  Open the frontend URL in your browser.
2.  Navigate to the **Start** section or choose a category from the Home page.
3.  Complete the quiz within the time limit.
4.  View your detailed performance report on the **Result** page.

## 👨‍💻 Author

**Janak Luthra**

## 📄 License

This project is licensed under the **ISC License**.