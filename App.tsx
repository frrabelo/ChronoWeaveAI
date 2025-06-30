import React from 'react';
import { SimpleHashRouter, SimpleRoutes, SimpleRoute, SimpleNavigate } from './components/SimpleRouter';
import Header from './components/Header';
import HomePage from './components/HomePage';
import TimelinePage from './components/TimelinePage';
import { translations } from './translations';

const Footer: React.FC = () => {
    // A little hacky, but avoids a full context setup for just the footer
    const lang = sessionStorage.getItem('timelineLanguage') || 'en';
    const t = (key: string) => translations[lang]?.[key] ?? translations['en'][key];

    return (
        <footer className="text-center py-6 text-sm text-gray-500 mt-auto">
            <p>{t('footer')}</p>
        </footer>
    );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans antialiased flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <SimpleHashRouter>
          <SimpleRoutes>
            <SimpleRoute path="/" element={<HomePage />} />
            <SimpleRoute path="/timeline" element={<TimelinePage />} />
            <SimpleRoute path="*" element={<SimpleNavigate to="/" />} />
          </SimpleRoutes>
        </SimpleHashRouter>
      </main>
      <Footer />
    </div>
  );
};

export default App;