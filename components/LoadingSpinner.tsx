
import React from 'react';

const LoadingSpinner: React.FC<{ text?: string }> = ({ text = "Gerando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      <p className="text-cyan-300 text-lg">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
