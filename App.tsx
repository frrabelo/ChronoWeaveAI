import React from 'react';
import { SimpleHashRouter, SimpleRoutes, SimpleRoute, SimpleNavigate } from './components/SimpleRouter';
import Header from './components/Header';
import HomePage from './components/HomePage';
import TimelinePage from './components/TimelinePage';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans antialiased">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SimpleHashRouter>
          <SimpleRoutes>
            <SimpleRoute path="/" element={<HomePage />} />
            <SimpleRoute path="/timeline" element={<TimelinePage />} />
            <SimpleRoute path="*" element={<SimpleNavigate to="/" />} />
          </SimpleRoutes>
        </SimpleHashRouter>
      </main>
    </div>
  );
};

export default App;
