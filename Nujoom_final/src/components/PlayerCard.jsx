import React from 'react';
import { Star, StarOff, Ruler, Weight, User, Flag } from 'lucide-react';
import { motion } from 'framer-motion';

const PlayerCard = ({ player, onClick, onToggleShortlist, isShortlisted, isHighlighted }) => {
  // Handle case where player is undefined or incomplete
  if (!player || !player.name) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4 text-center">
        <p className="text-gray-500">بيانات اللاعب غير متوفرة</p>
      </div>
    );
  }

  // Default stats if none are provided
  const defaultStats = [
    { name: "السرعة", value: 75 },
    { name: "التمرير", value: 70 },
    { name: "التسديد", value: 65 }
  ];

  // Ensure player.attributes exists and is an array
  const attributes = player.attributes && player.attributes.length > 0 
    ? player.attributes 
    : defaultStats;

  // Handle shortlist toggle with safety check
  const handleShortlistToggle = (e) => {
    e.stopPropagation();
    try {
      if (onToggleShortlist && typeof onToggleShortlist === 'function') {
        onToggleShortlist(player);
      } else {
        console.log('Shortlist toggle clicked, but no onToggleShortlist handler provided:', player.name);
      }
    } catch (error) {
      console.error("Error in handleShortlistToggle:", error);
    }
  };

  // Handle player click with safety check
  const handlePlayerClick = () => {
    try {
      if (onClick && typeof onClick === 'function') {
        onClick(player);
      } else {
        console.log('Player clicked, but no onClick handler provided:', player.name);
      }
    } catch (error) {
      console.error("Error in handlePlayerClick:", error);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white rounded-lg shadow overflow-hidden cursor-pointer"
      onClick={handlePlayerClick}
    >
      <div className="relative">
        <div className="h-24 bg-gradient-to-b from-[#032425] to-[#599E68]"></div>
        <div className="absolute -bottom-10 inset-x-0 flex justify-center">
          <div className="bg-white rounded-full p-1.5 shadow">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
              alt={player.name} 
              className="w-20 h-20 rounded-full"
            />
          </div>
        </div>
        <button 
          className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow"
          onClick={handleShortlistToggle}
        >
          {isShortlisted ? (
            <Star size={18} className="text-yellow-400" />
          ) : (
            <StarOff size={18} className="text-gray-400" />
          )}
        </button>
      </div>
      
      <div className="pt-12 p-4 text-center">
        <h3 className="font-bold text-gray-800 text-lg mb-1">{player.name}</h3>
        <div className="flex justify-center items-center space-x-1 space-x-reverse mb-2">
          <span className="bg-[#E7F0EB] text-[#032425] text-xs font-medium px-2 py-0.5 rounded">
            {player.position || 'لاعب'}
          </span>
          <span className="text-gray-500 text-xs">
            {player.age ? `${player.age} سنة` : ''}
          </span>
        </div>
        
        <div className="flex justify-center space-x-2 space-x-reverse text-xs text-gray-500 mb-3">
          <span>{player.team || 'نادي غير محدد'}</span>
        </div>

        {/* Player physical details */}
        <div className="flex justify-center space-x-4 space-x-reverse text-xs text-gray-600 mb-3">
          <div className="flex items-center space-x-1 space-x-reverse">
            <Ruler size={14} className="text-[#032425]" />
            <span>{player.height ? `${player.height} سم` : 'غير محدد'}</span>
          </div>
          <div className="flex items-center space-x-1 space-x-reverse">
            <Weight size={14} className="text-[#032425]" />
            <span>{player.weight ? `${player.weight} كجم` : 'غير محدد'}</span>
          </div>
        </div>

        <div className="flex justify-center space-x-4 space-x-reverse text-xs text-gray-600 mb-3">
          <div className="flex items-center space-x-1 space-x-reverse">
            <User size={14} className="text-[#032425]" />
            <span>القدم {player.foot || 'غير محدد'}</span>
          </div>
          <div className="flex items-center space-x-1 space-x-reverse">
            <Flag size={14} className="text-[#032425]" />
            <span>{player.nationality || 'غير محدد'}</span>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          {attributes.slice(0, 3).map((attr, index) => (
            <div key={index} className="flex items-center text-sm">
              <span className="w-24 text-right text-gray-600">{attr.name}</span>
              <div className="flex-grow mx-2">
                <div className="h-1.5 bg-gray-200 rounded-full">
                  <div 
                    className={`h-1.5 rounded-full ${
                      attr.value >= 90 ? 'bg-green-500' : 
                      attr.value >= 80 ? 'bg-[#ffce00]' : 
                      'bg-yellow-500'
                    }`}
                    style={{ width: `${attr.value}%` }}
                  ></div>
                </div>
              </div>
              <span className={`font-medium ${
                attr.value >= 90 ? 'text-green-500' : 
                attr.value >= 80 ? 'text-[#ffce00]' : 
                'text-yellow-500'
              }`}>{attr.value}</span>
            </div>
          ))}
          
          {attributes.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-2">
              لا توجد إحصائيات متاحة
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerCard;