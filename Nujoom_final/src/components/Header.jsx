import React, { useState, useEffect } from 'react';
import { Bell, User, Star, Calendar, BookOpen } from 'lucide-react';
import logo from '../logo/nujoom-logo.png';

const Header = ({ navigateToPage, currentPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMainPage, setIsMainPage] = useState(false);
  
  useEffect(() => {
    setIsMainPage(currentPage === 'mainPage' || currentPage === 'dashboard');
    
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentPage]);
  
  console.log("Current page:", currentPage); // Debug current page
  
  return (
    <div className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div 
              className={`cursor-pointer flex items-center ml-8 font-bold text-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                isMainPage && !scrolled
                  ? 'text-white' 
                  : 'text-[#032425]'
              }`}
              onClick={() => navigateToPage('mainPage')}
            >
              <img src={logo} alt="Nujoom" className="h-14 w-auto scale-110 transform origin-left transition-transform duration-300" />
            </div>
            
            <nav className="flex flex-wrap">
              <div 
                className={`cursor-pointer ml-6 mb-2 transition-all duration-300 hover:opacity-80 ${
                  currentPage === 'playersPage' 
                  ? (isMainPage && !scrolled ? 'text-white font-bold text-lg' : 'text-[#032425] font-bold text-lg')
                  : (isMainPage && !scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#032425]')
                }`}
                onClick={() => navigateToPage('playersPage')}
              >
                المواهب
              </div>
              <div 
                className={`cursor-pointer ml-6 mb-2 transition-all duration-300 hover:opacity-80 ${
                  currentPage === 'comparisons' 
                  ? (isMainPage && !scrolled ? 'text-white font-bold text-lg' : 'text-[#032425] font-bold text-lg')
                  : (isMainPage && !scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#032425]')
                }`}
                onClick={() => navigateToPage('comparisons')}
              >
                المقارنات
              </div>
              <div 
                className={`cursor-pointer ml-6 mb-2 transition-all duration-300 hover:opacity-80 ${
                  currentPage === 'calendar' 
                    ? (isMainPage && !scrolled ? 'text-white font-bold text-lg' : 'text-[#032425] font-bold text-lg')
                    : (isMainPage && !scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#032425]')
                }`}
                onClick={() => navigateToPage('calendar')}
              >
                جدول المباريات
              </div>
              <div 
                className={`cursor-pointer ml-6 mb-2 transition-all duration-300 hover:opacity-80 ${
                  currentPage === 'shortlistedPlayers' 
                    ? (isMainPage && !scrolled ? 'text-white font-bold text-lg' : 'text-[#032425] font-bold text-lg')
                    : (isMainPage && !scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#032425]')
                }`}
                onClick={() => navigateToPage('shortlistedPlayers')}
              >
                اللاعبين المفضلين
              </div>
              <div 
                className={`cursor-pointer ml-6 mb-2 transition-all duration-300 hover:opacity-80 ${
                  currentPage === 'notes' 
                    ? (isMainPage && !scrolled ? 'text-white font-bold text-lg' : 'text-[#032425] font-bold text-lg')
                    : (isMainPage && !scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#032425]')
                }`}
                onClick={() => {
                  console.log("Clicking on notes menu item");
                  navigateToPage('notes');
                }}
              >
                ملاحظاتي
              </div>
            </nav>
          </div>
          
          <div className="flex items-center">
            <button 
              className={`p-2 mr-2 ${
                currentPage === 'shortlistedPlayers' 
                  ? (isMainPage && !scrolled ? 'text-white' : 'text-[#032425]')
                  : (isMainPage && !scrolled ? 'text-gray-300' : 'text-gray-600')
              }`}
              onClick={() => navigateToPage('shortlistedPlayers')}
              title="اللاعبين المفضلين"
            >
              <Star size={20} />
            </button>
            <button 
              className={`p-2 mr-2 ${
                currentPage === 'calendar' 
                  ? (isMainPage && !scrolled ? 'text-white' : 'text-[#032425]')
                  : (isMainPage && !scrolled ? 'text-gray-300' : 'text-gray-600')
              }`}
              onClick={() => navigateToPage('calendar')}
              title="جدول المباريات"
            >
              <Calendar size={20} />
            </button>
            <button 
              className={`p-2 mr-2 ${
                currentPage === 'notes' 
                  ? (isMainPage && !scrolled ? 'text-white' : 'text-[#032425]')
                  : (isMainPage && !scrolled ? 'text-gray-300' : 'text-gray-600')
              }`}
              onClick={() => {
                console.log("Clicking on notes icon");
                navigateToPage('notes');
              }}
              title="ملاحظاتي"
            >
              <BookOpen size={20} />
            </button>
            <button className={`p-2 mr-2 ${isMainPage && !scrolled ? 'text-gray-300' : 'text-gray-600'}`}>
              <Bell size={20} />
            </button>
            <button className={`p-2 ${isMainPage && !scrolled ? 'text-gray-300' : 'text-gray-600'}`}>
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;