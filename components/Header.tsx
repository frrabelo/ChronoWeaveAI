
import React from 'react';
import { BookOpenIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/70 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <a href="#" className="flex items-center space-x-3 text-cyan-400 hover:text-cyan-300 transition-colors">
          <BookOpenIcon className="w-8 h-8"/>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            ChronoWeave <span className="text-cyan-400">AI</span>
          </h1>
        </a>
      </div>
    </header>
  );
};

export default Header;
