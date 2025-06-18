import { FaXmark } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";

const AnswerButton = ({ answer, index, isSelected, isCorrect, submitted, onSelect, disabled }) => {
  const getButtonStyles = () => {
    if (submitted) {
      if (isCorrect) return 'bg-green-100 border-2 border-green-500';
      if (isSelected) return 'bg-red-100 border-2 border-red-500';
      return 'bg-gray-50';
    }
    if (isSelected) return 'bg-primary/10 border-2 border-primary';
    return 'bg-white hover:bg-gray-50';
  };

  return (
    <button
      onClick={() => onSelect(index)}
      disabled={disabled}
      className={`w-full p-4 rounded-lg text-left transition-all ${getButtonStyles()}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-base text-pink-500">{answer}</span>
        {submitted && (
          isCorrect ? (
            <FaCheck className="text-green-500 text-xl" />
          ) : isSelected ? (
            <FaXmark className="text-red-500 text-xl" />
          ) : null
        )}
      </div>
    </button>
  );
};

export default AnswerButton; 