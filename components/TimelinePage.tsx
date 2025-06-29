import React, { useState, useEffect } from 'react';
import { useSimpleNavigate } from './SimpleRouter';
import { TimelineResponse } from '../types';
import TimelineEvent from './TimelineEvent';

const TimelinePage: React.FC = () => {
  const [timelineData, setTimelineData] = useState<TimelineResponse | null>(null);
  const navigate = useSimpleNavigate();

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem('timelineData');
      if (storedData) {
        setTimelineData(JSON.parse(storedData));
      } else {
        // If no data, redirect to home to generate a new one
        navigate('/');
      }
    } catch (error) {
      console.error("Failed to parse timeline data from session storage", error);
      navigate('/');
    }
  }, [navigate]);

  if (!timelineData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl text-gray-400">Carregando dados da linha do tempo...</h2>
      </div>
    );
  }

  const { title, summary, events_container } = timelineData.story.content;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">{title}</h1>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">{summary}</p>
      </div>

      <div className="relative wrap overflow-hidden p-2 sm:p-4 md:p-10 h-full">
        <div className="absolute h-full border-2 border-cyan-600/50 rounded-full" style={{ left: '50%', transform: 'translateX(-50%)' }}></div>
        
        {events_container.map((event, index) => (
          <TimelineEvent key={index} event={event} index={index} />
        ))}
      </div>
      
      <div className="text-center mt-12">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 text-md font-bold text-white bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all"
        >
          Gerar Outra Linha do Tempo
        </button>
      </div>
    </div>
  );
};

export default TimelinePage;
