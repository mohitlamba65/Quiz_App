import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import axios from 'axios';
import { PlayCircle, Clock, Award, FileText, Lock } from 'lucide-react';

export const QuizAccess = () => {
    const { link } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [requiresCode, setRequiresCode] = useState(false);
    const [accessCode, setAccessCode] = useState('');
    const [codeError, setCodeError] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4444';

    useEffect(() => {
        fetchQuiz();
    }, [link]);

    const fetchQuiz = async (code = '') => {
        try {
            const url = code
                ? `${API_URL}/quiz/link/${link}?accessCode=${code}`
                : `${API_URL}/quiz/link/${link}`;

            const response = await axios.get(url);
            setQuiz(response.data.quiz);
            setRequiresCode(false);
            setCodeError('');
        } catch (error) {
            if (error.response?.data?.requiresCode) {
                setRequiresCode(true);
                setCodeError(error.response.data.message);
            } else {
                setError(error.response?.data?.message || 'Quiz not found');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAccessCodeSubmit = (e) => {
        e.preventDefault();
        if (!accessCode.trim()) {
            setCodeError('Please enter access code');
            return;
        }
        setLoading(true);
        fetchQuiz(accessCode);
    };

    const startQuiz = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/quiz/access/${link}` } });
            return;
        }
        navigate(`/quiz/take/${link}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass p-8 rounded-2xl">
                    <div className="animate-pulse text-xl">Loading quiz...</div>
                </div>
            </div>
        );
    }

    // Show access code form if required
    if (requiresCode) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass-strong rounded-3xl p-8 md:p-12 max-w-md w-full animate-fade-in">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 mb-6">
                            <Lock className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Access Code Required</h1>
                        <p className="text-gray-400">This quiz requires an access code to continue</p>
                    </div>

                    {codeError && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {codeError}
                        </div>
                    )}

                    <form onSubmit={handleAccessCodeSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="accessCode" className="block text-sm font-medium text-gray-300 mb-2">
                                Access Code
                            </label>
                            <input
                                type="text"
                                id="accessCode"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="Enter access code"
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Verifying...' : 'Submit'}
                        </button>
                    </form>

                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 w-full text-center text-gray-400 hover:text-white transition-colors"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass-strong rounded-3xl p-8 md:p-12 max-w-md w-full text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold text-white mb-2">Quiz Not Found</h1>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-strong rounded-3xl p-8 md:p-12 max-w-2xl w-full animate-fade-in">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-6 animate-glow">
                        <FileText className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold gradient-text mb-2">{quiz.title}</h1>
                    {quiz.description && (
                        <p className="text-gray-400 text-lg">{quiz.description}</p>
                    )}
                </div>

                <div className="glass rounded-xl p-6 mb-8 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-500/20">
                            <FileText className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-400">Questions</div>
                            <div className="text-xl font-semibold text-white">{quiz.questions?.length || 0}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/20">
                            <Clock className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-400">Time Limit</div>
                            <div className="text-xl font-semibold text-white">{Math.floor(quiz.timeLimit / 60)} minutes</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-green-500/20">
                            <Award className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-400">Passing Score</div>
                            <div className="text-xl font-semibold text-white">{quiz.passingScore}%</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={startQuiz}
                        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                        <PlayCircle className="w-5 h-5" />
                        {isAuthenticated ? 'Start Quiz' : 'Login to Start'}
                    </button>

                    {!isAuthenticated && (
                        <p className="text-center text-sm text-gray-400">
                            You need to login or continue as guest to take this quiz
                        </p>
                    )}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    <p className="text-yellow-300 text-sm">
                        <strong>Note:</strong> Make sure you have a stable internet connection. The quiz will auto-submit when time runs out.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QuizAccess;
