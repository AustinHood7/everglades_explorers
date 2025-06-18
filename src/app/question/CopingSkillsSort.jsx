"use client";

import { useState } from "react";
import { FaTrash } from "react-icons/fa";

const positiveSkills = [
  "Deep breaths",
  "Exercise",
  "Positive affirmations or self-talk",
  "Listen to Music",
  "Do something fun",
  "Grounding Techniques",
  "Spend time with family or friends",
  "Spend time with pets"
];

const negativeSkills = [
  "Using marijuana",
  "Using alcohol",
  "Vaping",
  "Eating too much",
  "Eating too little",
  "Hurting one's self on purpose"
];

// Function to shuffle array
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function CopingSkillsSort({ onComplete }) {
  const [availableSkills, setAvailableSkills] = useState(() => 
    shuffleArray([...positiveSkills, ...negativeSkills])
  );
  const [removedSkills, setRemovedSkills] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e, skill) => {
    e.dataTransfer.setData("text/plain", skill);
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const skill = e.dataTransfer.getData("text/plain");
    
    // Only allow dropping negative skills
    if (negativeSkills.includes(skill)) {
      setAvailableSkills(prev => prev.filter(s => s !== skill));
      setRemovedSkills(prev => [...prev, skill]);
      
      // Check if all negative skills have been removed
      if (removedSkills.length + 1 === negativeSkills.length) {
        onComplete();
      }
    }
    
    setIsDragging(false);
  };

  return (
    <div className="w-full h-full flex gap-8">
      {/* Left side - Available skills */}
      <div className="w-1/2 bg-primary/80 backdrop-blur-sm rounded-xl p-6">
        <div className="space-y-2">
          {availableSkills.map((skill, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, skill)}
              className="p-2 rounded-lg cursor-move bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Drop zone */}
      <div
        className="w-1/2 bg-primary2/80 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center justify-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="relative w-48 h-48">
          <img 
            src="/trash_bucket.png" 
            alt="Remove negative coping skills" 
            className="w-full h-full object-contain"
          />
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">Drop here</p>
            </div>
          )}
        </div>
        {removedSkills.length > 0 && (
          <div className="mt-4 text-center">
            <div className="space-y-1">
              {removedSkills.map((skill, index) => (
                <div key={index} className="text-white/70 line-through text-sm">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 