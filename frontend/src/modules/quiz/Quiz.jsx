import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Question } from "./Question";
import { useUser } from "../user/User";
import { useAuth } from "../auth/AuthContext";
import { Timer } from "lucide-react";
import axios from "axios";

export const Quiz = () => {
  const { category, link } = useParams();
  const [currInd, setInd] = useState(0);
  const [quizData, setQuizData] = useState([]);
  const [quizInfo, setQuizInfo] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();
  const { userAnswers, updateUserAnswers, userData, updateUserData } = useUser();
  const { user } = useAuth(); // Get authenticated user

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4444';

  useEffect(() => {
    async function fetchData() {
      try {
        // New link-based quiz access
        if (link) {
          const response = await axios.get(`${API_URL}/quiz/link/${link}`);
          const quiz = response.data.quiz;
          setQuizInfo(quiz);
          setQuizData(quiz.questions);
          setTimeLeft(quiz.timeLimit);
        }
        // Legacy category-based access
        else if (category) {
          const response = await fetch(import.meta.env.VITE_QUESTIONS_URL);
          const result = await response.json();

          const categoryData = result.filter((item) =>
            item.category?.toLowerCase() === category?.toLowerCase()
          );

          setQuizData(categoryData);
          setTimeLeft(categoryData.length * 60);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [category, link]);

  useEffect(() => {
    if (quizData.length === 0) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quizData]);

  const onNext = () => {
    if (currInd < quizData.length - 1) setInd(currInd + 1);
  };

  const onPrev = () => {
    if (currInd > 0) setInd(currInd - 1);
  };

  const onAnswerChange = (e) => {
    updateUserAnswers(currInd, e.target.value);
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    let attemptedCount = 0;

    Object.keys(userAnswers).forEach((index) => {
      const i = parseInt(index);
      if (userAnswers[i] && quizData[i]) {
        attemptedCount++;
        if (quizData[i].answer === userAnswers[i]) correctCount++;
      }
    });

    const score = correctCount * 10 - (attemptedCount - correctCount) * 5;
    const passingScore = Math.ceil(quizData.length * 0.5) * 10;

    const userResultData = {
      ...userData,
      category: quizInfo?.category || category || 'General',
      attempts: attemptedCount,
      score: Math.max(0, score),
      totalQuestions: quizData.length,
      correctAnswers: correctCount,
      incorrectAnswers: attemptedCount - correctCount,
      status: score >= passingScore ? "Passed" : "Failed",
    };

    updateUserData(userResultData);

    try {
      const resultPayload = {
        username: user?.username || userData.username || "Anonymous",
        score: userResultData.score,
        attempts: userResultData.attempts,
        status: userResultData.status,
        category: userResultData.category,
        correctAnswers: correctCount,
        incorrectAnswers: attemptedCount - correctCount,
        totalQuestions: quizData.length,
        quizId: quizInfo?._id || null,
        userId: user?._id || null // Use authenticated user ID
      };

      console.log('Saving result:', resultPayload); // Debug log

      const response = await axios.post(`${API_URL}/result`, resultPayload);
      console.log('Result saved successfully:', response.data);
    } catch (error) {
      console.error("Error saving result:", error.message);
      console.error("Error details:", error.response?.data);
    }

    navigate("/result");
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

  if (quizData.length === 0) {
    return (
      <div className="mx-auto my-10 p-6 bg-gray-900 text-white text-center rounded-xl shadow-lg max-w-3xl">
        <h1 className="text-3xl font-bold mb-4 animate-pulse">Loading {category} Quiz...</h1>
        <p className="text-gray-400">Please ensure the backend is running and this category has questions.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto my-10 p-6 sm:p-10 bg-gray-900 rounded-2xl shadow-2xl max-w-4xl">
      <h1 className="text-3xl sm:text-4xl text-center font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-transparent bg-clip-text mb-8">
        {quizInfo?.title || `${category} Quiz`}
      </h1>

      <div className="flex items-center justify-center text-white text-lg mb-6">
        <Timer className="w-6 h-6 text-yellow-300 mr-2 animate-pulse" />
        <span className="font-semibold">Time Left: {formattedTime}</span>
      </div>

      <div className="max-w-2xl mx-auto">
        <Question question={quizData[currInd]} onAnswerChange={onAnswerChange} />
      </div>

      <div className="mt-10">
        <div className="flex justify-center items-center mb-6">
          <div className="w-4/5 bg-gray-700 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-300"
              style={{ width: `${((currInd + 1) / quizData.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 space-x-4">
          {currInd > 0 && (
            <button
              onClick={onPrev}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-full font-medium transition-transform duration-200 hover:scale-105"
            >
              Prev
            </button>
          )}

          {currInd === quizData.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full font-medium transition-transform duration-200 hover:scale-105"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={onNext}
              className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-6 rounded-full font-medium transition-transform duration-200 hover:scale-105"
            >
              Next
            </button>
          )}
        </div>

        <p className="text-white text-center mt-4">
          Question <span className="font-semibold">{currInd + 1}</span> of{" "}
          <span className="font-semibold">{quizData.length}</span>
        </p>
      </div>
    </div>
  );
};

export default Quiz;
