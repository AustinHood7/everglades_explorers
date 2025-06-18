import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ClickAwayQuestion = ({ question, onComplete }) => {
  const [answers, setAnswers] = useState([]);
  const [clickedAnswers, setClickedAnswers] = useState(new Set());
  const [isComplete, setIsComplete] = useState(false);

  // Shuffle answers on component mount
  useEffect(() => {
    const shuffled = [...question.answers].sort(() => Math.random() - 0.5);
    setAnswers(shuffled);
  }, [question.answers]);

  const handleAnswerClick = (answer) => {
    if (clickedAnswers.has(answer)) return;

    setClickedAnswers(prev => {
      const newSet = new Set(prev);
      newSet.add(answer);
      
      // Check if all answers have been clicked
      if (newSet.size === answers.length) {
        setIsComplete(true);
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
      
      return newSet;
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-primary">{question.question}</h2>
      
      <div className="grid grid-cols-3 gap-4">
        <AnimatePresence>
          {answers.map((answer, index) => (
            <motion.div
              key={answer}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: clickedAnswers.has(answer) ? 0 : 1,
                scale: clickedAnswers.has(answer) ? 0 : 1,
                x: clickedAnswers.has(answer) ? (Math.random() > 0.5 ? 1000 : -1000) : 0,
                y: clickedAnswers.has(answer) ? (Math.random() > 0.5 ? 1000 : -1000) : 0,
                rotate: clickedAnswers.has(answer) ? (Math.random() > 0.5 ? 360 : -360) : 0
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => handleAnswerClick(answer)}
              className={`
                p-4 rounded-lg cursor-pointer text-center
                ${clickedAnswers.has(answer) 
                  ? 'bg-transparent' 
                  : 'bg-white hover:bg-primary/10 transition-colors text-primary'
                }
              `}
            >
              {answer}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-green-600 font-semibold"
        >
          Great job! Moving on...
        </motion.div>
      )}
    </div>
  );
};

export default ClickAwayQuestion; 