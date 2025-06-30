import React, { useState, useCallback, useEffect } from 'react';
import { useSimpleNavigate } from './SimpleRouter';
import { generateTimelineText } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { translations, languageOptions } from '../translations';
import AboutModal from './AboutModal';

const HomePage: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [language, setLanguage] = useState<string>('en');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAboutModalOpen, setAboutModalOpen] = useState(false);
  const navigate = useSimpleNavigate();

  const t = useCallback((key: string) => {
    return translations[language]?.[key] ?? translations['en'][key];
  }, [language]);

  useEffect(() => {
    document.title = t('pageTitle');
    sessionStorage.setItem('timelineLanguage', language);
  }, [language, t]);


  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!topic.trim()) {
      setError(t('pleaseInsertTopic'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const timelineData = await generateTimelineText(topic, language);
      sessionStorage.setItem('timelineData', JSON.stringify(timelineData));
      sessionStorage.setItem('timelineLanguage', language);
      navigate('/timeline');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('errorUnexpected');
      setError(`${t('errorGenerating')} ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [topic, language, navigate, t]);

  return (
    <div className="flex flex-col items-center justify-center text-center pt-10">
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setAboutModalOpen(false)} t={t} />
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
          {t('unravelHistory')}
        </h2>
        <p className="text-lg text-gray-400 mb-8">
          {t('typeTopic')}
        </p>

        {loading ? (
          <div className="mt-12">
            <LoadingSpinner text={t('generatingTimeline')}/>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-5 py-4 text-lg bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all appearance-none"
                aria-label={t('chooseLanguage')}
              >
                {Object.entries(languageOptions).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t('inputPlaceholder')}
              className="w-full px-5 py-4 text-lg bg-gray-800 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              className="w-full px-8 py-4 text-lg font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-50 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {t('generateTimeline')}
            </button>
          </form>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
            <p>{error}</p>
          </div>
        )}

        <div className="mt-8">
            <button onClick={() => setAboutModalOpen(true)} className="font-semibold text-gray-400 hover:text-cyan-400 transition-colors">
                {t('about')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;