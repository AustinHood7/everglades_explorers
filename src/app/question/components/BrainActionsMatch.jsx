import { useState, useRef, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const BrainActionsMatch = ({ onComplete }) => {
  const actions = [
    "Deep breathing exercises",
    "Progressive muscle relaxation",
    "Exercise",
    "Yoga",
    "Grounding techniques",
    "Using affirmations or positive self-talk",
    "Spending time with friends or family",
    "Listen to music",
    "Engaging in fun activities"
  ];

  const instructions = [
    "Inhale for 4 seconds, hold for 4, exhale for 4, hold for 4 – box breathing. Count to 10",
    "Open and close your fists three times. Roll your shoulders forward twice and backwards twice.",
    "Do 10 jumping jacks. Run in place for 15 seconds",
    "Hold a tree pose for 10 seconds. Hold a Warrior pose for 10 seconds.",
    "5-4-3-2-1: list 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste",
    "\"I've done hard things before; I can do this too.\", \"I choose to focus on what I can control.\"",
    "Call out the name of a family member or friend who you helps you calm down.",
    "Say the name and artist of your favorite song that helps you calm down.",
    "Which would bring you the most joy? Gaming, Baking, or Skateboarding. Call out your answer."
  ];

  const [selectedPairs, setSelectedPairs] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);

  const handleDragStart = (e, item, type, index) => {
    setDraggedItem({ item, type, index });
    e.dataTransfer.setData('text/plain', item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetItem, type, index) => {
    e.preventDefault();
    if (!draggedItem) return;

    // Only allow matching if one is an action and one is an instruction
    if (draggedItem.type === type) return;

    const newPairs = [...selectedPairs];
    const existingPairIndex = newPairs.findIndex(
      pair => pair.actionIndex === (type === 'action' ? index : draggedItem.index)
    );
    
    if (existingPairIndex !== -1) {
      newPairs[existingPairIndex] = {
        actionIndex: type === 'action' ? index : draggedItem.index,
        instructionIndex: type === 'action' ? draggedItem.index : index
      };
    } else {
      newPairs.push({
        actionIndex: type === 'action' ? index : draggedItem.index,
        instructionIndex: type === 'action' ? draggedItem.index : index
      });
    }

    setSelectedPairs(newPairs);

    // Check if all actions have been matched
    if (newPairs.length === actions.length) {
      const allCorrect = newPairs.every(pair => pair.actionIndex === pair.instructionIndex);
      if (allCorrect) {
        setCompleted(true);
        onComplete();
      }
    }

    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const isCorrectMatch = (actionIndex, instructionIndex) => {
    return actionIndex === instructionIndex;
  };

  const isItemMatched = (index, type) => {
    return selectedPairs.some(pair => 
      type === 'action' ? pair.actionIndex === index : pair.instructionIndex === index
    );
  };

  const getMatchedIndex = (index, type) => {
    const pair = selectedPairs.find(pair => 
      type === 'action' ? pair.actionIndex === index : pair.instructionIndex === index
    );
    return pair ? (type === 'action' ? pair.instructionIndex : pair.actionIndex) : null;
  };

  // Update lines when pairs change
  useEffect(() => {
    if (!containerRef.current) return;

    const newLines = selectedPairs.map(pair => {
      const actionElement = containerRef.current.querySelector(`#action-${pair.actionIndex}`);
      const instructionElement = containerRef.current.querySelector(`#instruction-${pair.instructionIndex}`);
      
      if (!actionElement || !instructionElement) return null;

      const actionRect = actionElement.getBoundingClientRect();
      const instructionRect = instructionElement.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      return {
        x1: actionRect.right - containerRect.left,
        y1: actionRect.top + actionRect.height / 2 - containerRect.top,
        x2: instructionRect.left - containerRect.left,
        y2: instructionRect.top + instructionRect.height / 2 - containerRect.top,
        isCorrect: isCorrectMatch(pair.actionIndex, pair.instructionIndex)
      };
    }).filter(Boolean);

    setLines(newLines);
  }, [selectedPairs]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6" ref={containerRef}>
      <div className="grid grid-cols-2 gap-8 relative">
        {/* Actions Column */}
        <div className="space-y-4 pr-8">
          <h3 className="text-xl font-semibold mb-6 text-black">Actions</h3>
          <div className="space-y-3">
            {actions.map((action, index) => (
              <div
                key={`action-${index}`}
                id={`action-${index}`}
                draggable
                onDragStart={(e) => handleDragStart(e, action, 'action', index)}
                onDragEnd={handleDragEnd}
                className={`p-4 rounded-xl cursor-move transition-all ${
                  isItemMatched(index, 'action')
                    ? isCorrectMatch(index, getMatchedIndex(index, 'action'))
                      ? 'bg-green-100 border-2 border-green-500'
                      : 'bg-red-100 border-2 border-red-500'
                    : 'bg-white/90 hover:bg-white shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-black font-medium">{action}</span>
                  <div className='min-w-[16px]'>
                    {isItemMatched(index, 'action') && (
                    isCorrectMatch(index, getMatchedIndex(index, 'action')) ? (
                      <FaCheck className="text-green-500 text-xl" size={16}/>
                    ) : (
                      <FaTimes className="text-red-500 text-xl" />
                    )
                  )}</div>
                  
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions Column */}
        <div className="space-y-4 pl-8">
          <h3 className="text-xl font-semibold mb-6 text-primary">Instructions</h3>
          <div className="space-y-3">
            {instructions.map((instruction, index) => (
              <div
                key={`instruction-${index}`}
                id={`instruction-${index}`}
                draggable
                onDragStart={(e) => handleDragStart(e, instruction, 'instruction', index)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, instruction, 'instruction', index)}
                className={`p-4 rounded-xl cursor-move transition-all ${
                  isItemMatched(index, 'instruction')
                    ? isCorrectMatch(getMatchedIndex(index, 'instruction'), index)
                      ? 'bg-green-100 border-2 border-green-500'
                      : 'bg-red-100 border-2 border-red-500'
                    : 'bg-white/90 hover:bg-white shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-black font-medium">{instruction}</span>
                  <div className='min-w-[16px]'>
                    {isItemMatched(index, 'action') && (
                    isCorrectMatch(index, getMatchedIndex(index, 'action')) ? (
                      <FaCheck className="text-green-500 text-xl" size={16}/>
                    ) : (
                      <FaTimes className="text-red-500 text-xl" />
                    )
                  )}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connecting Lines */}
        <svg
          className="absolute top-0 -left-6 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        >
          {lines.map((line, index) => (
            <line
              key={index}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.isCorrect ? '#22c55e' : '#ef4444'}
              strokeWidth="2"
              strokeDasharray={line.isCorrect ? 'none' : '5,5'}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default BrainActionsMatch; 