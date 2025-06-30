import React, { useState, useEffect, useCallback } from 'react';
import { useSimpleNavigate } from './SimpleRouter';
import { TimelineData, TimelineEvent } from '../types';
import TimelineEventComponent from './TimelineEvent';
import { generateImage } from '../services/geminiService';
import { translations } from '../translations';
import LoadingSpinner from './LoadingSpinner';

// Make JSZip available from the script loaded in index.html
declare var JSZip: any;

const TimelinePage: React.FC = () => {
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [language, setLanguage] = useState('en');
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const navigate = useSimpleNavigate();

  const t = useCallback((key: string) => {
    return translations[language]?.[key] ?? translations['en'][key];
  }, [language]);

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem('timelineData');
      const storedLang = sessionStorage.getItem('timelineLanguage');
      if (storedData && storedLang) {
        const parsedData = JSON.parse(storedData) as TimelineData;
        setTimelineData(parsedData);
        setEvents(parsedData.events);
        setLanguage(storedLang);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error("Failed to parse timeline data from session storage", error);
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (timelineData && timelineData.events.length > 0) {
      const fetchImages = async () => {
        setIsLoadingImages(true);
        const imagePromises = timelineData.events.map(event => 
          generateImage(event.image_query).catch(e => {
            console.error(e);
            return 'error'; // a placeholder for failed images
          })
        );
        const base64Images = await Promise.all(imagePromises);
        const eventsWithImages = timelineData.events.map((event, index) => ({
          ...event,
          imageBase64: base64Images[index] !== 'error' ? base64Images[index] : undefined,
        }));
        setEvents(eventsWithImages);
        setIsLoadingImages(false);
      };
      fetchImages();
    }
  }, [timelineData]);

  const handleSaveZip = async () => {
    if (!timelineData || events.length === 0) return;
  
    const zip = new JSZip();
    
    // Format JSON to the user-specified structure
    const formattedJson = events.map((event, index) => {
        const imageFilename = `image_${String(index + 1).padStart(2, '0')}.png`;
        return {
          [`image${String(index + 1).padStart(2, '0')}`]: imageFilename,
          html_image_div: `<div class='image-container'><img src='${imageFilename}' alt='${event.title}' /></div>`,
          Title: timelineData.title,
          Context: timelineData.summary,
          date: event.date,
          age: null, // This field is not provided by the AI
          tag: t(`category_${event.category}`), // Use translated category
          subtitle: event.title,
          content: event.description,
        };
      });
  
    zip.file("file.json", JSON.stringify(formattedJson, null, 2));
  
    // Add images to zip
    events.forEach((event, index) => {
      if (event.imageBase64) {
        const imageFilename = `image_${String(index + 1).padStart(2, '0')}.png`;
        // The base64 string from Gemini API does not need the prefix
        zip.file(imageFilename, event.imageBase64, { base64: true });
      }
    });
  
    // Generate and download zip
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "ChronoWeaveAI_Timeline.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!timelineData) {
    return (
      <div className="text-center py-20">
        <LoadingSpinner text={t('loadingTimeline')} />
      </div>
    );
  }

  const { title, summary } = timelineData;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">{title}</h1>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">{summary}</p>
      </div>

      <div className="relative wrap overflow-hidden p-2 sm:p-4 md:p-10 h-full">
        <div className="absolute h-full border-2 border-cyan-600/50 rounded-full" style={{ left: '50%', transform: 'translateX(-50%)' }}></div>
        {events.map((event, index) => (
          <TimelineEventComponent key={index} event={event} index={index} t={t} isLoadingImage={isLoadingImages && !event.imageBase64} />
        ))}
      </div>
      
      <div className="text-center mt-12 space-y-8">
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 relative">
                <label className="block text-left text-sm font-bold text-gray-400 mb-2">{t('jsonCreated')}</label>
                <button onClick={handleSaveZip} className="absolute top-2 right-2 px-3 py-1 text-xs font-bold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors">{t('saveButton')}</button>
                <textarea
                    readOnly
                    className="w-full h-48 bg-gray-900 text-gray-300 font-mono text-sm p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={JSON.stringify(timelineData, null, 2)}
                />
            </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 text-md font-bold text-white bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all"
        >
          {t('generateAnother')}
        </button>
      </div>
    </div>
  );
};

export default TimelinePage;