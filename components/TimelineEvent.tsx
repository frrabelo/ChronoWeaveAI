
import React from 'react';
import { TimelineEventData } from '../types';
import { ClockIcon } from './icons';

interface TimelineEventProps {
  event: TimelineEventData;
  index: number;
}

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
    const categoryColors: { [key: string]: string } = {
        'Invenção': 'bg-blue-500 text-blue-100',
        'Conflito': 'bg-red-500 text-red-100',
        'Descoberta': 'bg-green-500 text-green-100',
        'Arte': 'bg-purple-500 text-purple-100',
    };
    const colorClass = categoryColors[category] || 'bg-gray-500 text-gray-100';
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>{category}</span>;
};


const TimelineEvent: React.FC<TimelineEventProps> = ({ event, index }) => {
  const isLeft = index % 2 === 0;
  const imageUrl = `https://source.unsplash.com/800x400/?${encodeURIComponent(event.image_query)}`;

  const containerClasses = `mb-8 flex justify-between items-center w-full ${isLeft ? 'flex-row-reverse left-timeline' : 'right-timeline'}`;
  const contentClasses = `order-1 w-full md:w-5/12`;

  return (
    <div className={containerClasses}>
      <div className="order-1 w-5/12 hidden md:block"></div>
      
      <div className="z-20 flex items-center order-1 bg-gray-800 shadow-xl w-12 h-12 rounded-full">
        <ClockIcon className="mx-auto font-semibold text-lg text-cyan-400 w-6 h-6" />
      </div>

      <div className={contentClasses}>
        <div className={`p-4 rounded-lg shadow-xl bg-gray-800 border border-gray-700 transform transition-transform duration-500 hover:scale-105 hover:shadow-cyan-500/20`}>
          <img src={imageUrl} alt={event.title} className="w-full h-40 object-cover rounded-t-md mb-3" />
          <div className="p-2">
            <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-cyan-400">{event.date}</p>
                <CategoryBadge category={event.category} />
            </div>
            <h3 className="mb-2 font-bold text-white text-xl">{event.title}</h3>
            <p className="text-sm leading-snug tracking-wide text-gray-300 text-opacity-100">
              {event.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineEvent;
