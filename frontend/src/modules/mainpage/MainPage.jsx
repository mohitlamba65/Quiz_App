import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AptitudeImg from '../../assets/aptitude_img.jpeg';
import codingImage from '../../assets/coding_image.jpeg';
import interviewImage from '../../assets/interview_img.jpeg';
import { PlayCircle, Clock, Award, Loader } from 'lucide-react';

const categoryImages = {
  'Aptitude': AptitudeImg,
  'Coding': codingImage,
  'Interview': interviewImage,
  'HR': interviewImage,
  'Programming': codingImage
};

const MainPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4444';

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`${API_URL}/quiz/all`);
      setQuizzes(response.data.quizzes);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-2xl flex items-center gap-3">
          <Loader className="w-6 h-6 animate-spin text-purple-400" />
          <div className="text-xl">Loading quizzes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 gradient-text">
          Choose Your Quiz
        </h1>
        <p className="text-gray-400 text-lg">
          Test your knowledge with our curated quizzes
        </p>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-20">
          <div className="glass-strong rounded-2xl p-12 max-w-md mx-auto">
            <PlayCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Quizzes Available</h3>
            <p className="text-gray-400">
              Check back later for new quizzes!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="glass-strong rounded-2xl overflow-hidden hover-lift transition-all animate-fade-in"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={categoryImages[quiz.category] || AptitudeImg}
                  alt={quiz.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-purple-500/80 text-white text-sm font-medium">
                    {quiz.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{quiz.title}</h3>
                <p className="text-gray-400 mb-4 text-sm line-clamp-2">
                  {quiz.description || 'Test your knowledge and skills'}
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <PlayCircle className="w-4 h-4" />
                    <span>{quiz.questions?.length || 0} Questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(quiz.timeLimit / 60)} mins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>{quiz.passingScore}%</span>
                  </div>
                </div>

                <Link
                  to={`/quiz/access/${quiz.shareableLink}`}
                  className="block w-full text-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02]"
                >
                  Start Quiz
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainPage;
