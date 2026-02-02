import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import api from '../../api';
import { Plus, BarChart3, Users, FileText, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
    const { user } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const [stats, setStats] = useState({
        totalQuizzes: 0,
        totalAttempts: 0,
        averageScore: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const response = await api.get('/quiz/my-quizzes');
            setQuizzes(response.data.quizzes);
            setStats({
                totalQuizzes: response.data.quizzes.length,
                totalAttempts: 0, // You can calculate this from results
                averageScore: 0
            });
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (quizId) => {
        if (!confirm('Are you sure you want to delete this quiz?')) return;

        try {
            await api.delete(`/quiz/${quizId}`);
            alert('Quiz deleted successfully');
            fetchQuizzes();
        } catch (error) {
            console.error('Failed to delete quiz:', error);
            alert(error.response?.data?.message || 'Failed to delete quiz');
        }
    };

    const copyLink = (link) => {
        const fullLink = `${window.location.origin}/quiz/access/${link}`;
        navigator.clipboard.writeText(fullLink);
        alert('Link copied to clipboard!');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass p-8 rounded-2xl">
                    <div className="animate-pulse text-xl">Loading dashboard...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-400">Welcome back, {user?.username}!</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="glass-strong rounded-2xl p-6 hover-lift animate-fade-in">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-purple-500/20">
                                <FileText className="w-6 h-6 text-purple-400" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stats.totalQuizzes}</div>
                        <div className="text-sm text-gray-400">Total Quizzes</div>
                    </div>

                    <div className="glass-strong rounded-2xl p-6 hover-lift animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-pink-500/20">
                                <Users className="w-6 h-6 text-pink-400" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stats.totalAttempts}</div>
                        <div className="text-sm text-gray-400">Total Attempts</div>
                    </div>

                    <div className="glass-strong rounded-2xl p-6 hover-lift animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-blue-500/20">
                                <BarChart3 className="w-6 h-6 text-blue-400" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stats.averageScore}%</div>
                        <div className="text-sm text-gray-400">Average Score</div>
                    </div>
                </div>

                {/* Create Quiz Button */}
                <div className="mb-8">
                    <Link
                        to="/admin/create-quiz"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02]"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Quiz
                    </Link>
                </div>

                {/* Quizzes List */}
                <div className="glass-strong rounded-2xl p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Your Quizzes</h2>

                    {quizzes.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 mb-4">No quizzes created yet</p>
                            <Link
                                to="/admin/create-quiz"
                                className="text-purple-400 hover:text-purple-300 font-semibold"
                            >
                                Create your first quiz →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {quizzes.map((quiz) => (
                                <div
                                    key={quiz._id}
                                    className="glass rounded-xl p-6 hover-lift transition-all"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-white mb-2">{quiz.title}</h3>
                                            <p className="text-gray-400 text-sm mb-3">{quiz.description}</p>
                                            <div className="flex flex-wrap gap-3 text-sm">
                                                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300">
                                                    {quiz.category}
                                                </span>
                                                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300">
                                                    {quiz.questions?.length || 0} Questions
                                                </span>
                                                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300">
                                                    {Math.floor(quiz.timeLimit / 60)} mins
                                                </span>
                                                {quiz.accessCode && (
                                                    <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 flex items-center gap-1">
                                                        🔒 Code: {quiz.accessCode}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => copyLink(quiz.shareableLink)}
                                                className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors text-sm font-medium"
                                            >
                                                Copy Link
                                            </button>
                                            <Link
                                                to={`/admin/leaderboard/${quiz._id}`}
                                                className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors text-sm font-medium text-center"
                                            >
                                                Leaderboard
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(quiz._id)}
                                                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
