"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import highSchoolQuestions from "./highSchoolQuestions.json";
import middleSchoolQuestions from "./middleSchoolQuestions.json";
import highSchoolQuestionPool from "./highSchoolQuestionPool.json";
import {FaXmark} from "react-icons/fa6";

import { FaCheck, FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";

export default function QuestionPage() {
  const [questionSet, setQuestionSet] = useState(null); // To track which question set is selected
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false); // To track if the answer has been submitted
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0); // Track the number of correct answers
  const [isPoolStep, setIsPoolStep] = useState(false); // Track if we're in the intermediate pool step
  const [dragAnswers, setDragAnswers] = useState([...highSchoolQuestionPool.pool]); // Initialize draggable answers
  const [slots, setSlots] = useState(
    highSchoolQuestionPool.questions.map((question) => ({
      ...question,
      droppedAnswer: null, // Tracks the dropped answer for each slot
    }))
  );

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

  const handleDragStart = (e, answer) => {
    e.dataTransfer.setData("text/plain", answer); // Store the dragged answer
  };

  const handleDrop = (e, slotIndex) => {
    const answer = e.dataTransfer.getData("text/plain");
    e.preventDefault();

    // Prevent overwriting an already dropped answer
    if (slots[slotIndex].droppedAnswer) return;

    // Update the slot with the dropped answer
    const updatedSlots = [...slots];
    updatedSlots[slotIndex].droppedAnswer = answer;
    setSlots(updatedSlots);

    // Remove the answer from the draggable pool
    const updatedAnswers = dragAnswers.filter((item) => item !== answer);
    setDragAnswers(updatedAnswers);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow dropping
  };

  const handlePoolSubmit = () => {
    let correctCount = correctAnswers;

    // Check answers for each slot
    slots.forEach((slot) => {
      if (slot.droppedAnswer && slot.droppedAnswer.startsWith(slot.correctAnswer)) {
        correctCount += 1; // Increment for correct matches
      }
    });

    setCorrectAnswers(correctCount);
    setIsPoolStep(false); // Exit pool step
    setShowResult(true); // Show final results
  };

  const handleResetQuiz = () => {
    setQuestionSet(null); // Reset to the level selection screen
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    setShowResult(false); // Reset the result screen
    setCorrectAnswers(0); // Reset the correct answers count
    setIsPoolStep(false); // Reset the pool step
    setDragAnswers([...highSchoolQuestionPool.pool]); // Reset draggable answers
    setSlots(
      highSchoolQuestionPool.questions.map((question) => ({
        ...question,
        droppedAnswer: null,
      }))
    ); // Reset slots
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setAnswerSubmitted(false); // Reset for the next question
    } else {
      // After normal questions, go to the pool step
      setIsPoolStep(true);
    }
  };

  const handleSubmitAnswer = () => {
    setAnswerSubmitted(true); // Mark the answer as submitted
    if (selectedAnswer === currentQuestion.correct) {
      setCorrectAnswers(correctAnswers + 1); // Increment correct answers if the selected answer is correct
    }
  };

  const handleAnswerClick = (index) => {
    setSelectedAnswer(index); // Update the selectedAnswer state with the clicked answer's index
  };
  
  

  return (
    <div
      className={`font-poppins h-[100dvh] py-6 ${
        showResult ? "bg-cover bg-center" : "bg-secondary"
      }`}
      style={{
        backgroundImage: showResult ? "url('/gator_on_river.jpg')" : "none", // Use gator.jpg only on the final step
      }}
    >
      <span className="w-full justify-between flex text-primary px-10">
        {/* Left Arrow */}
        <button onClick={handleResetQuiz}>
          <FaArrowCircleLeft size={48} />
        </button>
        {/* Right Arrow */}
        <button
          onClick={() =>
            isPoolStep ? handlePoolSubmit() : currentQuestionIndex + 1 < questions.length
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
        ) : isPoolStep ? (
          // Pool Step
          <div className="w-4/5 bg-primary rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Match the Questions to Answers</h2>
            <div className="flex flex-wrap gap-4 mb-6">
              {dragAnswers.map((answer, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, answer)}
                  className="cursor-pointer p-3 bg-secondary text-black rounded-lg shadow-md  max-w-[50%]"
                >
                  {answer}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 overflow-auto max-h-[400px]">
            {slots.map((slot, index) => (
  <div
    key={slot.id}
    onDrop={(e) => handleDrop(e, index)}
    onDragOver={handleDragOver}
    className="p-4 bg-primary2 text-white rounded-lg shadow-md"
  >
    <p>{slot.text}</p>
    <div className="mt-2 p-3 bg-white text-black rounded-lg flex justify-between items-center">
      {slot.droppedAnswer || "Drop your answer here"}
      {slot.droppedAnswer && (
        <span
          className="cursor-pointer text-red-500 ml-2"
          onClick={() => {
            // Store the dropped answer before removing it
            const removedAnswer = slot.droppedAnswer;

            // Add the removed answer back to the pool
            setDragAnswers((prevAnswers) => [...prevAnswers, removedAnswer]);

            // Remove the answer from the slot
            const updatedSlots = [...slots];
            updatedSlots[index].droppedAnswer = null;
            setSlots(updatedSlots);
          }}
        >
          <FaXmark size={22} />
        </span>
      )}
    </div>
  </div>
))}


            </div>
            <button
              onClick={handlePoolSubmit}
              className="mt-4 px-4 py-2 bg-accent text-white rounded-lg"
            >
              Submit Pool Step
            </button>
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
                  }
                  className={`cursor-pointer p-3 rounded-lg text-lg flex justify-between items-center ${
                    answerSubmitted
                      ? index === currentQuestion.correct
                        ? "bg-green-500 text-white"
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
                  : "Go to Pool Step"
                : "Submit"}
            </button>
          </div>
        ) : (
          <div className="text-center bg-black/50 px-10 py-16 rounded-xl">
            <h2 className="text-2xl font-bold text-zinc-100">Quiz Completed!</h2>
            <p className="text-lg text-zinc-300 mt-2">
              You scored {correctAnswers} out of{" "}
              {questions.length + highSchoolQuestionPool.questions.length}!
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
