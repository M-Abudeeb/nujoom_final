import React from 'react';
import { ArrowRight } from 'lucide-react';

const BackButton = ({ navigateToPage, destination = 'dashboard' }) => {
  const handleBackClick = () => {
    console.log('Back button clicked, navigating to:', destination);
    navigateToPage(destination);
  };

  return (
    <button 
      className="fixed right-3 top-3 p-2 rounded-full bg-white shadow-md text-gray-600 hover:text-[#032425] hover:bg-gray-100 z-50 cursor-pointer"
      onClick={handleBackClick}
      style={{ pointerEvents: 'auto' }}
    >
      <ArrowRight size={24} />
    </button>
  );
};

export default BackButton;
