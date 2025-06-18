import { useState } from 'react';
import BrainActionsMatch from './BrainActionsMatch';
import DragDropQuestion from './DragDropQuestion';
import ClickAwayQuestion from './ClickAwayQuestion';

const QuestionDisplay = ({ 
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  submitted,
  onAnswerSelect,
  onNextQuestion,
  onSubmitAnswer,
  copingSkillsCompleted,
  setCopingSkillsCompleted
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswer = (answer) => {
    onAnswerSelect(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setShowFeedback(true);
    setIsCorrect(selectedAnswer === currentQuestion.correct);
    onSubmitAnswer();
  };

  const handleComplete = () => {
    setCopingSkillsCompleted(true);
  };

  const isBrainActionsMatchQuestion = currentQuestion?.type === 'brainActionsMatch';
  const isDragDropQuestion = currentQuestion?.type === 'dragDrop';
  const isClickAwayQuestion = currentQuestion?.type === 'clickAway';

  if (isBrainActionsMatchQuestion) {
    return (
      <>
        <BrainActionsMatch onComplete={handleComplete} />
        <div className="mt-8 flex justify-end">
          <button
            onClick={onNextQuestion}
            disabled={!copingSkillsCompleted}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              copingSkillsCompleted
                ? 'bg-primary hover:bg-primary/90 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </>
    );
  }

  if (isDragDropQuestion) {
    return (
      <>
        <DragDropQuestion question={currentQuestion} onComplete={handleComplete} />
        <div className="mt-8 flex justify-end">
          <button
            onClick={onNextQuestion}
            disabled={!copingSkillsCompleted}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              copingSkillsCompleted
                ? 'bg-primary hover:bg-primary/90 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </>
    );
  }

  if (isClickAwayQuestion) {
    return (
      <>
        <ClickAwayQuestion question={currentQuestion} onComplete={handleComplete} />
        <div className="mt-8 flex justify-end">
          <button
            onClick={onNextQuestion}
            disabled={!copingSkillsCompleted}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              copingSkillsCompleted
                ? 'bg-primary hover:bg-primary/90 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </>
    );
  }

  if (!currentQuestion) {
    return <div>No question found</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-primary">{currentQuestion.question}</h2>
      
      <div className="space-y-4">
        {currentQuestion.answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={submitted}
            className={`w-full p-4 rounded-lg text-left transition-colors ${
              submitted
                ? index === currentQuestion.correct
                  ? 'bg-green-100 text-green-800'
                  : selectedAnswer === index
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-500'
                : selectedAnswer === index
                ? 'bg-primary/10 text-primary'
                : 'bg-white hover:bg-primary/10 text-primary'
            }`}
          >
            {answer}
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        {submitted ? (
          <button
            onClick={onNextQuestion}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'See Results'}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              selectedAnswer === null
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 text-white'
            }`}
          >
            Submit Answer
          </button>
        )}
      </div>

      {showFeedback && submitted && (
        <div className={`mt-4 p-4 rounded-lg ${
          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isCorrect ? (
            <p className="text-center font-semibold">Great job! Moving on to the next question!</p>
          ) : (
            <p className="text-center font-semibold">Not quite right. Try again!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay; 