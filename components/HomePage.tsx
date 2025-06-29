import React, { useState, useCallback } from 'react';
import { useSimpleNavigate } from './SimpleRouter';
import { generateTimeline } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const HomePage: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useSimpleNavigate();

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!topic.trim()) {
      setError('Por favor, insira um tópico.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const timelineData = await generateTimeline(topic);
      sessionStorage.setItem('timelineData', JSON.stringify(timelineData));
      navigate('/timeline');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro inesperado.';
      setError(`Falha ao gerar a linha do tempo. ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [topic, navigate]);

  return (
    <div className="flex flex-col items-center justify-center text-center pt-10">
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
          Desvende a História com IA
        </h2>
        <p className="text-lg text-gray-400 mb-8">
          Digite um tópico e deixe nossa IA tecer uma linha do tempo histórica detalhada para você.
        </p>

        {loading ? (
          <div className="mt-12">
            <LoadingSpinner text="Nossa IA está pesquisando na história..."/>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: A História da Fotografia, A Queda do Império Romano..."
              className="w-full px-5 py-4 text-lg bg-gray-800 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              className="w-full px-8 py-4 text-lg font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-50 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Gerar Linha do Tempo
            </button>
          </form>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
