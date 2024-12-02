"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import highSchoolQuestions from "./highSchoolQuestions.json";
import middleSchoolQuestions from "./middleSchoolQuestions.json";

import { FaCheck, FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";

export default function QuestionPage() {
  const [questionSet, setQuestionSet] = useState(null); // To track which question set is selected
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false); // To track if the answer has been submitted
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0); // Track the number of correct answers

  const router = useRouter(); // Initialize router for navigation

  const questions =
    questionSet === "highSchool"
      ? highSchoolQuestions?.questions
      : questionSet === "middleSchool"
      ? middleSchoolQuestions?.questions
      : [];

  const currentQuestion = questions[currentQuestionIndex] || {
    question: "No question available",
    answers: [],
    correct: -1, // Default value if no correct answer is provided
  };

  const handleAnswerClick = (index) => {
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    setAnswerSubmitted(true); // Mark the answer as submitted
    if (selectedAnswer === currentQuestion.correct) {
      setCorrectAnswers(correctAnswers + 1); // Increment correct answers if the selected answer is correct
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setAnswerSubmitted(false); // Reset for the next question
    } else {
      setShowResult(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex === 0) {
      router.push("/"); // Navigate back to the home screen if on the first question
    } else {
      setCurrentQuestionIndex(currentQuestionIndex - 1); // Go to the previous question
      setSelectedAnswer(null);
      setAnswerSubmitted(false); // Reset the state for the previous question
    }
  };

  const handleResetQuiz = () => {
    setQuestionSet(null); // Reset to the level selection screen
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    setShowResult(false);
    setCorrectAnswers(0); // Reset the correct answers count
  };

  return (
    <div
      className={`font-poppins h-[100dvh] py-6 ${
        showResult
          ? "bg-cover bg-center"
          : "bg-secondary"
      }`}
      style={{
        backgroundImage: showResult ? "url('/gator_on_river.jpg')" : "none", // Use gator.jpg only on the final step
      }}
    >
      <span className="w-full justify-between flex text-primary px-10">
        {/* Left Arrow */}
        <button onClick={handlePreviousQuestion}>
          <FaArrowCircleLeft size={48} />
        </button>
        {/* Right Arrow */}
        <button
          onClick={() =>
            currentQuestionIndex + 1 < questions.length
              ? handleNextQuestion()
              : setShowResult(true)
          }
        >
          <FaArrowCircleRight size={48} />
        </button>
      </span>
      <div className="flex flex-col justify-center items-center h-full pb-24">
        {!questionSet ? (
          <div className="w-4/5 bg-primary rounded-xl shadow-md p-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">Select Your Level</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setQuestionSet("middleSchool")}
                className="px-4 py-2 bg-accent text-white rounded-lg text-lg font-medium"
              >
                Middle School
              </button>
              <button
                onClick={() => setQuestionSet("highSchool")}
                className="px-4 py-2 bg-accent text-white rounded-lg text-lg font-medium"
              >
                High School
              </button>
            </div>
          </div>
        ) : !showResult ? (
          <div className="w-4/5 bg-primary rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">{currentQuestion.question}</h2>
            <ul className="grid grid-cols-2 gap-2">
              {currentQuestion.answers.map((answer, index) => (
                <li
                  key={index}
                  onClick={() =>
                    !answerSubmitted ? handleAnswerClick(index) : null
                  } // Disable interaction after submitting
                  className={`cursor-pointer p-3 rounded-lg text-lg flex justify-between items-center ${
                    answerSubmitted
                      ? index === currentQuestion.correct
                        ? "bg-green-500 text-white" // Highlight correct answer
                        : selectedAnswer === index
                        ? "bg-red-500 text-white" 
                        : "bg-primaryMuted"
                      : selectedAnswer === index
                      ? "bg-primary2 text-white"
                      : "bg-primaryMuted"
                  }`}
                >
                  {answer}
                  {selectedAnswer === index && <span><FaCheck /></span>}
                </li>
              ))}
            </ul>
            <button
              onClick={answerSubmitted ? handleNextQuestion : handleSubmitAnswer}
              disabled={selectedAnswer === null} 
              className={`mt-4 px-4 py-2 rounded-lg ${
                selectedAnswer === null
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-accent text-white"
              }`}
            >
              {answerSubmitted
                ? currentQuestionIndex + 1 < questions.length
                  ? "Next"
                  : "Show Results"
                : "Submit"}
            </button>
          </div>
        ) : (
          <div className="text-center bg-black/50 px-10 py-16 rounded-xl">
            <h2 className="text-2xl font-bold text-zinc-100">Quiz Completed!</h2>
            <p className="text-lg text-zinc-300 mt-2">
              You scored {correctAnswers} out of {questions.length}!
            </p>
            <button
              onClick={handleResetQuiz} 
              className="mt-4 px-4 py-2 bg-accent text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
