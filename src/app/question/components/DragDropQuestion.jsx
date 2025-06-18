import { useState, useEffect } from 'react';

const DragDropQuestion = ({ question, onComplete }) => {
  const [items, setItems] = useState(question.items);
  const [categories, setCategories] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  // Initialize categories when question changes
  useEffect(() => {
    const initialCategories = question.categories.reduce((acc, category) => {
      acc[category.id] = [];
      return acc;
    }, {});
    setCategories(initialCategories);
    setItems(question.items);
    setShowFeedback(false);
    setIsCorrect(false);
    setDraggedItem(null);
  }, [question]);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, categoryId) => {
    e.preventDefault();
    if (!draggedItem) return;

    // Remove item from its current location
    const newCategories = { ...categories };
    Object.keys(newCategories).forEach(catId => {
      newCategories[catId] = newCategories[catId].filter(item => item.id !== draggedItem.id);
    });

    // Add item to new category
    newCategories[categoryId] = [...newCategories[categoryId], draggedItem];
    setCategories(newCategories);
    setDraggedItem(null);
  };

  const checkAnswers = () => {
    const allCorrect = question.categories.every(category => {
      const correctItems = question.correctAnswers[category.id];
      const userItems = categories[category.id]?.map(item => item.id) || [];
      return (
        correctItems.length === userItems.length &&
        correctItems.every(id => userItems.includes(id))
      );
    });

    setIsCorrect(allCorrect);
    setShowFeedback(true);

    if (allCorrect) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const allItemsPlaced = items.every(item => 
    question.categories.some(category => 
      categories[category.id]?.some(catItem => catItem.id === item.id)
    )
  );

  // Get items that haven't been placed in any category
  const unplacedItems = items.filter(item => 
    !question.categories.some(category => 
      categories[category.id]?.some(catItem => catItem.id === item.id)
    )
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {question.categories.map((category) => (
          <div key={category.id} className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-lg font-semibold text-primary mb-4">{category.title}</h3>
            <div
              className="min-h-[200px] bg-white/30 rounded-lg p-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, category.id)}
            >
              {categories[category.id]?.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  className="bg-primary bg-opacity-10 p-3 rounded-lg shadow-sm mb-2 cursor-move inline-block mr-2 border border-primary text-primary"
                >
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
        <h3 className="text-lg font-semibold text-primary mb-4">Items to Sort</h3>
        <div
          className="min-h-[100px] bg-white/30 rounded-lg p-4 text-secondary"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'items')}
        >
          {unplacedItems.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              className="bg-secondary bg-opacity-10 p-3 rounded-lg shadow-sm mb-2 cursor-move inline-block mr-2 border border-secondary"
            >
              {item.text}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={checkAnswers}
          disabled={!allItemsPlaced}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            allItemsPlaced
              ? 'bg-primary hover:bg-primary/90 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Check Answers
        </button>
      </div>

      {showFeedback && (
        <div className={`mt-4 p-4 rounded-lg ${
          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isCorrect ? (
            <p className="text-center font-semibold">Great job! You&apos;ve correctly sorted all the coping skills!</p>
          ) : (
            <p className="text-center font-semibold">Not quite right. Try again!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DragDropQuestion; 