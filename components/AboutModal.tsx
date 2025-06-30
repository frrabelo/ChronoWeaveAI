import React from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6 md:p-8 relative border border-gray-700" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-white transition-colors" aria-label="Close modal">&times;</button>
        <h2 className="text-2xl font-bold text-white mb-4">{t('aboutTitle')}</h2>
        <div className="space-y-4 text-gray-300">
            <p>{t('aboutL1')}</p>
            <p>{t('aboutL2')}</p>
        </div>
        <div className="mt-6 text-center">
            <a href="https://frrabelo.github.io/ChronoWeaveAI" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                {t('learnMore')}
            </a>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;