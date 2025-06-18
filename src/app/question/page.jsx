"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import questions from './questions.json';
import QuestionDisplay from './components/QuestionDisplay';
import BrainActionsMatch from './components/BrainActionsMatch';
import DragDropQuestion from './components/DragDropQuestion';
import Image from 'next/image';

export default function QuestionPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [showSecondCheckpoint, setShowSecondCheckpoint] = useState(false);
  const [copingSkillsCompleted, setCopingSkillsCompleted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const getBackgroundImage = () => {
    if (showResult) {
      return '/checkpoint1backdrop.png';
    }
    if (showCheckpoint) {
      return '/checkpoint1backdrop.png';
    }
    if (showSecondCheckpoint) {
      return '/checkpoint1backdrop.png';
    }
    if (currentQuestionIndex === 6 || currentQuestionIndex === 7 || currentQuestionIndex === 8) {
      return '/checkpoint1backdrop.png';
    }
    return '/questionBackdrop.png';
  };

  const handleAnswerSelect = (index) => {
    if (showResult) return; // Prevent changing answer after submission
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setSubmitted(true);
    
    if (selectedAnswer === questions.questions[currentQuestionIndex].correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    console.log('currentQuestionIndex', currentQuestionIndex);
    // Special case handling for interactive questions


    // Checkpoint handling
    if (currentQuestionIndex === 5) {
      setShowCheckpoint(true);
      return;
    }
    // Show second checkpoint after question 8 (index 8)
    if (currentQuestionIndex === 8) {
      setShowSecondCheckpoint(true);
      return;
    }

    // Regular question progression
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setSubmitted(false);
      setCopingSkillsCompleted(false); // Reset coping skills completion state
    } else {
      setShowResult(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setShowCheckpoint(false);
    setShowSecondCheckpoint(false);
    setCopingSkillsCompleted(false);
  };

  const handleContinueToNextSection = () => {
    setShowCheckpoint(false);
    setCurrentQuestionIndex(6);
    setSubmitted(false);
    setSelectedAnswer(null);
  };

  const handleContinueFromSecondCheckpoint = () => {
    setShowSecondCheckpoint(false);
    setCurrentQuestionIndex(9);
    setSubmitted(false);
    setSelectedAnswer(null);
  };

  const currentQuestion = questions.questions[currentQuestionIndex];
  const isBrainActionsMatch = currentQuestion.type === 'brainActionsMatch';
  const isDragDrop = currentQuestion.type === 'dragDrop';
  console.log(currentQuestion);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-background font-poppins"
      style={{
        backgroundImage: `url(${getBackgroundImage()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-4xl mx-auto">
        {showResult ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">Quiz Complete!</h2>
            <p className="text-xl mb-6 text-primary">
              You got {score} out of {questions.questions.length} questions correct!
            </p>
            <div className="space-y-4">
              <button
                onClick={handleResetQuiz}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Exit Quiz
              </button>
            </div>
          </div>
        ) : showCheckpoint ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">Checkpoint Reached!</h2>
            <p className="text-xl mb-6 text-secondary">
            Check point passed- time to help this brain! 
            </p>
            <div className="flex justify-center">
              <Image 
                src="/brain.png" 
                alt="Brain" 
                width={400} 
                height={300} 
                className="max-w-md rounded-lg shadow-lg mb-6" 
              />
            </div>
            <button
              onClick={handleContinueToNextSection}
              className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Continue to Next Section
            </button>
          </div>
        ) : showSecondCheckpoint ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">Checkpoint Reached!</h2>
            <p className="text-xl mb-6 text-secondary px-4">
              This brain can&apos;t remember what the right answer is, can you help it? True or False: there the best coping skills for myself are the same exact ones as other peoples.
            </p>
            <div className="flex justify-center">
              <Image 
                src="/brain.png" 
                alt="Brain" 
                width={400} 
                height={300} 
                className="max-w-md rounded-lg shadow-lg mb-6" 
              />
            </div>
            <button
              onClick={handleContinueFromSecondCheckpoint}
              className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Continue to Next Section
            </button>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8" >
            <h2 className="text-2xl font-bold text-primary mb-4">
              Question {currentQuestionIndex + 1} of {questions.questions.length}
            </h2>
            {isBrainActionsMatch ? (
              <BrainActionsMatch onComplete={() => {
                setCopingSkillsCompleted(true);
                handleNextQuestion();
              }} />
            ) : isDragDrop ? (
              <DragDropQuestion question={currentQuestion} onComplete={handleNextQuestion} />
            ) : (
              <QuestionDisplay
                currentQuestion={currentQuestion}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.questions.length}
                selectedAnswer={selectedAnswer}
                submitted={submitted}
                onAnswerSelect={handleAnswerSelect}
                onNextQuestion={handleNextQuestion}
                onSubmitAnswer={handleSubmitAnswer}
                copingSkillsCompleted={copingSkillsCompleted}
                setCopingSkillsCompleted={setCopingSkillsCompleted}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
