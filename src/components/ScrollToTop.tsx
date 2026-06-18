import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      id="scroll-to-top"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 p-3 bg-blue-700 hover:bg-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 border border-blue-600/50 focus:outline-none focus:ring-4 focus:ring-blue-100 z-50 flex items-center justify-center animate-bounce-short"
      aria-label="맨 위로 이동"
      title="맨 위로 이동"
    >
      <ArrowUp className="w-5 h-5 text-white" />
    </button>
  );
}
