export const Question = ({ question, onAnswerChange, selectedAnswer }) => {
  console.log("Question data:", question);

  // Make sure we have the question object
  if (!question) {
    return <div className="text-white">Loading question...</div>;
  }

  const options = [
    question.option1,
    question.option2,
    question.option3,
    question.option4,
  ];

  return (
    <div className="p-8 bg-gray-800 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">
        {question.quest}
      </h2>
      <ul className="space-y-4">
        {options.map((option, ind) => (
          <li key={ind} className="flex items-center">
            <input
              type="radio"
              value={option}
              name={`question-${question.questId || question._id}`}
              id={`option${ind}`}
              onChange={onAnswerChange}
              checked={selectedAnswer === option}
              className="mr-3 h-5 w-5"
            />
            <label
              htmlFor={`option${ind}`}
              className="flex items-center cursor-pointer w-full p-4 rounded-md bg-gray-700 hover:bg-violet-700 transition-colors"
            >
              <span className="text-white text-lg">{option}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};