import React from 'react';
import { TimelineEvent } from '../types';
import { ClockIcon } from './icons';

interface TimelineEventProps {
  event: TimelineEvent;
  index: number;
  t: (key: string) => string;
  isLoadingImage: boolean;
}

const CategoryBadge: React.FC<{ category: string, t: (key: string) => string }> = ({ category, t }) => {
    const categoryColors: { [key: string]: string } = {
        'Invention': 'bg-blue-500 text-blue-100',
        'Conflict': 'bg-red-500 text-red-100',
        'Discovery': 'bg-green-500 text-green-100',
        'Art': 'bg-purple-500 text-purple-100',
    };
    const colorClass = categoryColors[category] || 'bg-gray-500 text-gray-100';
    const translatedCategory = t(`category_${category}`);
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>{translatedCategory}</span>;
};

const ImagePlaceholder: React.FC = () => (
    <div className="w-full h-40 bg-gray-700 flex items-center justify-center rounded-t-md animate-pulse">
        <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"></path></svg>
    </div>
);

const TimelineEventComponent: React.FC<TimelineEventProps> = ({ event, index, t, isLoadingImage }) => {
  const isLeft = index % 2 === 0;
  
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
          {event.imageBase64 ? (
             <img src={`data:image/png;base64,${event.imageBase64}`} alt={event.title} className="w-full h-40 object-cover rounded-t-md mb-3" />
          ) : (
            <ImagePlaceholder />
          )}
         
          <div className="p-2">
            <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-cyan-400">{event.date}</p>
                <CategoryBadge category={event.category} t={t} />
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

export default TimelineEventComponent;