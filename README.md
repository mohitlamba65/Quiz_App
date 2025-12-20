# 🎯 Quiz App - Full-Stack MERN Platform

A comprehensive quiz management platform with role-based authentication, admin panel, shareable quiz links, leaderboard system, and premium glassmorphic UI.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-2.0-orange)

## 🌟 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Role-based access control** (Admin, Student, Guest)
- **Protected routes** on frontend and backend
- **Password hashing** with bcrypt
- **Guest mode** for quick quiz access

### 👨‍💼 Admin Panel
- **Quiz Creation**: Multi-step form with dynamic question management
- **Shareable Links**: Auto-generated UUID links for each quiz
- **Quiz Management**: Create, edit, delete, and view quizzes
- **Leaderboard**: View all quiz attempts ranked by score
- **Dashboard**: Real-time statistics and analytics

### 🎓 Student Experience
- **Quiz Access**: Take quizzes via shareable links
- **Real-time Timer**: Auto-submit when time expires
- **Instant Results**: Score calculation with pass/fail status
- **Performance Analytics**: Visual charts with Recharts

### 🎨 Premium UI
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Smooth Animations**: Fade-in, slide-in, glow effects
- **Dark Theme**: Purple/pink gradients
- **Fully Responsive**: Mobile-first design
- **Modern Typography**: Inter & Outfit fonts

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/Quiz_App.git
cd Quiz_App
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
echo "PORT=4444
JWT_SECRET=your_super_secret_jwt_key_here
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/quizapp" > .env

# Start backend server
npm start
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Create .env file (optional)
echo "VITE_API_URL=http://localhost:4444" > .env

# Start frontend dev server
npm run dev
```

4. **Access the Application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4444`

## 📁 Project Structure

```
Quiz_App/
├── backend/
│   ├── modules/
│   │   ├── controllers/      # Business logic
│   │   │   ├── auth-controller.js
│   │   │   ├── quiz-controller.js
│   │   │   └── result-controller.js
│   │   ├── middleware/       # Auth & RBAC middleware
│   │   │   └── auth-middleware.js
│   │   ├── models/           # Mongoose schemas
│   │   │   ├── user-schema.js
│   │   │   ├── quiz-schema.js
│   │   │   └── result-schema.js
│   │   └── routes/           # API routes
│   │       ├── auth-routes.js
│   │       ├── quiz-routes.js
│   │       └── result-routes.js
│   ├── shared/
│   │   └── db/
│   │       └── connection.js # MongoDB connection
│   ├── app.js                # Express app setup
│   └── .env                  # Environment variables
│
└── frontend/
    ├── src/
    │   ├── modules/
    │   │   ├── auth/         # Authentication components
    │   │   │   ├── AuthContext.jsx
    │   │   │   ├── Login.jsx
    │   │   │   └── Signup.jsx
    │   │   ├── admin/        # Admin panel components
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── CreateQuiz.jsx
    │   │   │   └── QuizLeaderboard.jsx
    │   │   ├── quiz/         # Quiz components
    │   │   │   ├── Quiz.jsx
    │   │   │   ├── QuizAccess.jsx
    │   │   │   └── Question.jsx
    │   │   └── mainpage/     # Homepage
    │   │       └── MainPage.jsx
    │   ├── shared/
    │   │   └── components/   # Shared components
    │   │       ├── NavBar.jsx
    │   │       └── ProtectedRoute.jsx
    │   ├── styles/
    │   │   └── design-tokens.css  # Design system
    │   ├── App.jsx           # Main app component
    │   └── index.css         # Global styles
    └── .env                  # Environment variables
```

## 🔧 Tech Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **UUID** - Unique ID generation

## 📊 Database Schema

### Users
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'student' | 'guest',
  isGuest: Boolean,
  createdAt: Date
}
```

### Quizzes
```javascript
{
  title: String,
  description: String,
  category: String,
  questions: [{ questId, quest, option1-4, answer }],
  createdBy: ObjectId (ref: User),
  shareableLink: String (UUID),
  isActive: Boolean,
  timeLimit: Number,
  passingScore: Number,
  createdAt: Date
}
```

### Results
```javascript
{
  userId: ObjectId (ref: User),
  quizId: ObjectId (ref: Quiz),
  username: String,
  score: Number,
  correctAnswers: Number,
  incorrectAnswers: Number,
  status: 'Passed' | 'Failed',
  timestamp: Date
}
```

## 🔑 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login
- `POST /auth/guest` - Guest login
- `GET /auth/me` - Get current user

### Quiz Management (Admin)
- `POST /quiz/create` - Create quiz
- `GET /quiz/my-quizzes` - Get admin's quizzes
- `PUT /quiz/:id` - Update quiz
- `DELETE /quiz/:id` - Delete quiz
- `GET /quiz/stats/:id` - Get quiz statistics
- `GET /quiz/leaderboard/:id` - Get quiz leaderboard

### Quiz Access (Public/Student)
- `GET /quiz/link/:link` - Get quiz by shareable link
- `GET /quiz/all` - Get all active quizzes

### Results
- `POST /result` - Save quiz result
- `GET /results/:userId` - Get user's results

## 🎮 Usage Guide

### For Admins

1. **Sign Up** as admin
2. **Create Quiz** from admin dashboard
3. **Copy shareable link** generated for the quiz
4. **Share link** with students
5. **View leaderboard** to track performance

### For Students

1. **Sign Up** or use **Guest Mode**
2. **Access quiz** via shared link
3. **Complete quiz** within time limit
4. **View results** with performance analytics

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt (10 salt rounds)
- Role-based access control (RBAC)
- Protected API routes
- CORS configuration
- Input validation
- Secure HTTP headers

## 🎨 UI/UX Highlights

- **Glassmorphism** design with backdrop blur
- **Gradient backgrounds** with vibrant colors
- **Smooth animations** (fade, slide, glow)
- **Responsive design** for all devices
- **Dark theme** with purple/pink accents
- **Interactive hover effects**
- **Loading states** and error handling

## 🚧 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Advanced analytics dashboard
- [ ] Image/video support in questions
- [ ] Quiz categories filter
- [ ] Export leaderboard to CSV
- [ ] Quiz timer pause/resume
- [ ] Dark/light theme toggle

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Vercel for frontend deployment
- Tailwind CSS for styling utilities
- Recharts for data visualization

---

⭐ **Star this repo** if you found it helpful!

**Made with ❤️ using MERN Stack**