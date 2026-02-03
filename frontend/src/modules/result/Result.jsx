import { useUser } from "../user/User";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Trophy, Award, Target, Clock, CheckCircle, XCircle, Home } from "lucide-react";

const COLORS = ["#10b981", "#ef4444"];

export const Result = () => {
  const { userData } = useUser();
  const { user } = useAuth();

  const totalQuestions = userData.totalQuestions || 0;
  const correctAnswers = userData.correctAnswers || 0;
  const incorrectAnswers = userData.incorrectAnswers || 0;
  const score = userData.score || 0;
  const attempts = userData.attempts || 0;
  const status = userData.status || "Unknown";
  const category = userData.category || "General";

  const chartData = [
    { name: "Correct", value: correctAnswers, color: COLORS[0] },
    { name: "Incorrect", value: incorrectAnswers, color: COLORS[1] },
  ];

  const correctPercentage = totalQuestions > 0
    ? ((correctAnswers / totalQuestions) * 100).toFixed(1)
    : "0.0";

  const isPassed = status === "Passed";

  // Handle case where no data is available
  if (!userData || Object.keys(userData).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-strong rounded-3xl p-8 md:p-12 max-w-md w-full text-center animate-fade-in">
          <Trophy className="w-20 h-20 text-gray-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">No Result Data</h1>
          <p className="text-gray-400 mb-6">Please take a quiz first to see your results.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 animate-glow ${isPassed
              ? 'bg-gradient-to-br from-green-500 to-emerald-500'
              : 'bg-gradient-to-br from-red-500 to-orange-500'
            }`}>
            {isPassed ? (
              <Trophy className="w-12 h-12 text-white" />
            ) : (
              <Award className="w-12 h-12 text-white" />
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
            Quiz Results
          </h1>
          <p className="text-xl text-gray-400">{category}</p>
          {user && (
            <p className="text-lg text-gray-500 mt-2">
              {user.username || "Anonymous"}
            </p>
          )}
        </div>

        {/* Score Card */}
        <div className="glass-strong rounded-3xl p-8 md:p-12 mb-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className={`text-6xl md:text-7xl font-bold mb-4 ${isPassed ? 'text-green-400' : 'text-red-400'
              }`}>
              {score}
            </div>
            <div className="text-gray-400 text-lg mb-4">
              out of {totalQuestions * 10} points
            </div>
            <div className={`inline-block px-6 py-3 rounded-full text-xl font-semibold ${isPassed
                ? 'bg-green-500/20 text-green-300 border-2 border-green-500/50'
                : 'bg-red-500/20 text-red-300 border-2 border-red-500/50'
              }`}>
              {status}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="glass rounded-xl p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Target className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{attempts}</div>
              <div className="text-sm text-gray-400">Questions Attempted</div>
            </div>

            <div className="glass rounded-xl p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{correctAnswers}</div>
              <div className="text-sm text-gray-400">Correct Answers</div>
            </div>

            <div className="glass rounded-xl p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{incorrectAnswers}</div>
              <div className="text-sm text-gray-400">Incorrect Answers</div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="glass-strong rounded-3xl p-8 md:p-12 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Performance Breakdown</h2>

          {totalQuestions > 0 ? (
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="w-64 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <div>
                    <div className="text-white font-semibold">Correct: {correctPercentage}%</div>
                    <div className="text-gray-400 text-sm">{correctAnswers} questions</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <div>
                    <div className="text-white font-semibold">Incorrect: {(100 - parseFloat(correctPercentage)).toFixed(1)}%</div>
                    <div className="text-gray-400 text-sm">{incorrectAnswers} questions</div>
                  </div>
                </div>
                {totalQuestions - attempts > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                    <div>
                      <div className="text-white font-semibold">Unanswered</div>
                      <div className="text-gray-400 text-sm">{totalQuestions - attempts} questions</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p>No performance data available</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02]"
          >
            <Home className="w-5 h-5" />
            Take Another Quiz
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Result;