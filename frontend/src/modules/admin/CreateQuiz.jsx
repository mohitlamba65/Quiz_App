import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import axios from 'axios';
import { Plus, Trash2, Save, ArrowLeft, Copy, Check } from 'lucide-react';

export const CreateQuiz = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [quizData, setQuizData] = useState({
        title: '',
        description: '',
        category: '',
        timeLimit: 3600,
        passingScore: 50,
        questions: [
            {
                questId: 1,
                quest: '',
                option1: '',
                option2: '',
                option3: '',
                option4: '',
                answer: ''
            }
        ]
    });
    const [loading, setLoading] = useState(false);
    const [createdQuiz, setCreatedQuiz] = useState(null);
    const [copied, setCopied] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4444';

    const handleQuizChange = (field, value) => {
        setQuizData({ ...quizData, [field]: value });
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...quizData.questions];
        newQuestions[index][field] = value;
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const addQuestion = () => {
        setQuizData({
            ...quizData,
            questions: [
                ...quizData.questions,
                {
                    questId: quizData.questions.length + 1,
                    quest: '',
                    option1: '',
                    option2: '',
                    option3: '',
                    option4: '',
                    answer: ''
                }
            ]
        });
    };

    const removeQuestion = (index) => {
        if (quizData.questions.length === 1) {
            alert('Quiz must have at least one question');
            return;
        }
        const newQuestions = quizData.questions.filter((_, i) => i !== index);
        // Renumber questions
        newQuestions.forEach((q, i) => q.questId = i + 1);
        setQuizData({ ...quizData, questions: newQuestions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/quiz/create`, quizData);
            setCreatedQuiz(response.data.quiz);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create quiz');
        } finally {
            setLoading(false);
        }
    };

    const copyLink = () => {
        const link = `${window.location.origin}/quiz/access/${createdQuiz.shareableLink}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (createdQuiz) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass-strong rounded-3xl p-8 md:p-12 max-w-2xl w-full animate-fade-in">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-6 animate-glow">
                            <Check className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold gradient-text mb-4">Quiz Created Successfully!</h1>
                        <p className="text-gray-400">Share this link with your students</p>
                    </div>

                    <div className="glass rounded-xl p-6 mb-6">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm text-gray-400 mb-2">Shareable Link:</p>
                                <p className="text-white font-mono text-sm truncate">
                                    {window.location.origin}/quiz/access/{createdQuiz.shareableLink}
                                </p>
                            </div>
                            <button
                                onClick={copyLink}
                                className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors flex items-center gap-2"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/admin')}
                            className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                        >
                            Go to Dashboard
                        </button>
                        <button
                            onClick={() => {
                                setCreatedQuiz(null);
                                setQuizData({
                                    title: '',
                                    description: '',
                                    category: '',
                                    timeLimit: 3600,
                                    passingScore: 50,
                                    questions: [{ questId: 1, quest: '', option1: '', option2: '', option3: '', option4: '', answer: '' }]
                                });
                            }}
                            className="flex-1 py-3 px-6 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                        >
                            Create Another
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>

                <div className="glass-strong rounded-3xl p-8 md:p-12 animate-fade-in">
                    <h1 className="text-4xl font-bold gradient-text mb-8">Create New Quiz</h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Quiz Details */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-white">Quiz Details</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Quiz Title *</label>
                                <input
                                    type="text"
                                    value={quizData.title}
                                    onChange={(e) => handleQuizChange('title', e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., JavaScript Fundamentals"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={quizData.description}
                                    onChange={(e) => handleQuizChange('description', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Brief description of the quiz"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                                    <input
                                        type="text"
                                        value={quizData.category}
                                        onChange={(e) => handleQuizChange('category', e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="e.g., Programming"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Time Limit (minutes)</label>
                                    <input
                                        type="number"
                                        value={Math.floor(quizData.timeLimit / 60)}
                                        onChange={(e) => handleQuizChange('timeLimit', parseInt(e.target.value) * 60)}
                                        min={1}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Passing Score (%)</label>
                                    <input
                                        type="number"
                                        value={quizData.passingScore}
                                        onChange={(e) => handleQuizChange('passingScore', parseInt(e.target.value))}
                                        min={0}
                                        max={100}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Access Code (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={quizData.accessCode || ''}
                                    onChange={(e) => handleQuizChange('accessCode', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Leave empty for public quiz"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Set an access code to restrict quiz access to specific students
                                </p>
                            </div>
                        </div>

                        {/* Questions */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-semibold text-white">Questions</h2>
                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Question
                                </button>
                            </div>

                            {quizData.questions.map((question, index) => (
                                <div key={index} className="glass rounded-xl p-6 space-y-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-white">Question {index + 1}</h3>
                                        {quizData.questions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(index)}
                                                className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Question Text *</label>
                                        <input
                                            type="text"
                                            value={question.quest}
                                            onChange={(e) => handleQuestionChange(index, 'quest', e.target.value)}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter your question"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {['option1', 'option2', 'option3', 'option4'].map((opt, i) => (
                                            <div key={opt}>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Option {i + 1} *</label>
                                                <input
                                                    type="text"
                                                    value={question[opt]}
                                                    onChange={(e) => handleQuestionChange(index, opt, e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    placeholder={`Option ${i + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Correct Answer *</label>
                                        <select
                                            value={question.answer}
                                            onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="">Select correct answer</option>
                                            <option value={question.option1}>{question.option1 || 'Option 1'}</option>
                                            <option value={question.option2}>{question.option2 || 'Option 2'}</option>
                                            <option value={question.option3}>{question.option3 || 'Option 3'}</option>
                                            <option value={question.option4}>{question.option4 || 'Option 4'}</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Creating Quiz...' : 'Create Quiz'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateQuiz;
