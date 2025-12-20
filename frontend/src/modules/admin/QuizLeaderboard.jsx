import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import axios from 'axios';
import { Trophy, Medal, Award, ArrowLeft, Users } from 'lucide-react';

export const QuizLeaderboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState([]);
    const [quizInfo, setQuizInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4444';

    useEffect(() => {
        fetchLeaderboard();
    }, [id]);

    const fetchLeaderboard = async () => {
        try {
            const response = await axios.get(`${API_URL}/quiz/leaderboard/${id}`);
            setLeaderboard(response.data.leaderboard);
            setQuizInfo(response.data.quiz);
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
        if (rank === 3) return <Award className="w-6 h-6 text-orange-400" />;
        return <span className="text-gray-400 font-semibold">#{rank}</span>;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass p-8 rounded-2xl">
                    <div className="animate-pulse text-xl">Loading leaderboard...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>

                <div className="glass-strong rounded-3xl p-8 md:p-12 animate-fade-in">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 mb-6 animate-glow">
                            <Trophy className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold gradient-text mb-2">Leaderboard</h1>
                        <p className="text-2xl text-white mb-2">{quizInfo?.title}</p>
                        <div className="flex items-center justify-center gap-4 text-gray-400">
                            <span className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                {leaderboard.length} Attempts
                            </span>
                            <span>•</span>
                            <span>{quizInfo?.category}</span>
                            <span>•</span>
                            <span>{quizInfo?.totalQuestions} Questions</span>
                        </div>
                    </div>

                    {/* Leaderboard Table */}
                    {leaderboard.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No attempts yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-4 px-4 text-gray-400 font-semibold">Rank</th>
                                        <th className="text-left py-4 px-4 text-gray-400 font-semibold">User</th>
                                        <th className="text-center py-4 px-4 text-gray-400 font-semibold">Score</th>
                                        <th className="text-center py-4 px-4 text-gray-400 font-semibold">Correct</th>
                                        <th className="text-center py-4 px-4 text-gray-400 font-semibold">Status</th>
                                        <th className="text-right py-4 px-4 text-gray-400 font-semibold">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((entry, index) => (
                                        <tr
                                            key={index}
                                            className={`border-b border-white/5 hover:bg-white/5 transition-colors ${entry.rank <= 3 ? 'bg-white/5' : ''
                                                }`}
                                        >
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    {getRankIcon(entry.rank)}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="text-white font-medium">{entry.username}</div>
                                                <div className="text-sm text-gray-400">{entry.email}</div>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <div className="text-xl font-bold text-white">
                                                    {entry.score}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    / {entry.totalQuestions * 10}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <div className="text-white">
                                                    {entry.correctAnswers}/{entry.totalQuestions}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {((entry.correctAnswers / entry.totalQuestions) * 100).toFixed(0)}%
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${entry.status === 'Passed'
                                                            ? 'bg-green-500/20 text-green-300'
                                                            : 'bg-red-500/20 text-red-300'
                                                        }`}
                                                >
                                                    {entry.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-right text-gray-400 text-sm">
                                                {new Date(entry.attemptedAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizLeaderboard;
