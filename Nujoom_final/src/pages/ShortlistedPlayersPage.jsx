import React, { useState, useEffect } from 'react';
import { ArrowRight, Grid, List, Search, Star, StarOff, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import PlayerCard from '../components/PlayerCard';
import BackButton from '../components/BackButton';
import { players as allPlayers } from '../data/players'; // Import all players

const ShortlistedPlayersPage = ({ navigateToPage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [shortlistedPlayers, setShortlistedPlayers] = useState([]);
  
  // Load shortlisted players from localStorage on component mount
  useEffect(() => {
    const loadShortlist = () => {
      const savedShortlist = localStorage.getItem('shortlistedPlayers');
      if (savedShortlist) {
        try {
          const parsedPlayers = JSON.parse(savedShortlist);
          
          // Ensure we have complete player data by merging with the latest data from allPlayers
          const enrichedPlayers = parsedPlayers.map(shortlistedPlayer => {
            // Find the matching player in our full player list
            const matchingPlayer = allPlayers.find(p => p.id === shortlistedPlayer.id);
            // Return the matching player if found, otherwise use the saved player data
            return matchingPlayer || shortlistedPlayer;
          });
          
          setShortlistedPlayers(enrichedPlayers);
        } catch (e) {
          console.error("Error loading shortlisted players:", e);
        }
      }
    };
    
    // Load initially
    loadShortlist();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', loadShortlist);
    
    // Clean up
    return () => {
      window.removeEventListener('storage', loadShortlist);
    };
  }, []);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Filter players based on search query
  const filteredPlayers = shortlistedPlayers.filter(player => 
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (player.team && player.team.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Remove player from shortlist
  const removeFromShortlist = (player) => {
    console.log("Removing player from shortlist:", player.name);
    const newShortlist = shortlistedPlayers.filter(p => p.id !== player.id);
    
    // Update state
    setShortlistedPlayers(newShortlist);
    
    // Save to localStorage
    localStorage.setItem('shortlistedPlayers', JSON.stringify(newShortlist));
    
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'));
    
    console.log("Updated shortlist:", newShortlist);
  };

  // Clear all shortlisted players
  const clearShortlist = () => {
    console.log("Clearing shortlist");
    
    // Update state
    setShortlistedPlayers([]);
    
    // Save to localStorage
    localStorage.setItem('shortlistedPlayers', JSON.stringify([]));
    
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  };

  // Handle player card click
  const handlePlayerClick = (player) => {
    // Store the source page in sessionStorage
    sessionStorage.setItem('playerDetailsSource', 'shortlistedPlayersPage');
    
    // Navigate to player details
    navigateToPage('playerDetails', player);
  };

  return (
    <div className="pt-8">
      <BackButton 
        navigateToPage={navigateToPage} 
        destination="dashboard" 
      />

      <div className="flex justify-center items-center mb-6">
      </div>

      <div className="mt-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2 space-x-reverse">
              <button 
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#E7F0EB] text-[#032425]' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={20} />
              </button>
              <button 
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#E7F0EB] text-[#032425]' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={() => setViewMode('list')}
              >
                <List size={20} />
              </button>
            </div>
            <div className="relative flex-grow mx-4">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#032425] focus:border-[#032425] block w-full pr-10 p-2.5 text-right" 
                placeholder="البحث عن لاعب..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {shortlistedPlayers.length > 0 && (
              <button 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                onClick={clearShortlist}
              >
                <Trash2 size={16} className="ml-1" />
                <span>مسح الكل</span>
              </button>
            )}
          </div>
        </div>

        {filteredPlayers.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">لا يوجد لاعبين في المفضلة</p>
            <button 
              className="bg-[#032425] hover:bg-[#044345] text-white px-4 py-2 rounded-lg"
              onClick={() => navigateToPage('playersPage')}
            >
              استعراض اللاعبين
            </button>
          </div>
        ) : (
          viewMode === 'list' ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#f9fbfa]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      اللاعب
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الفريق
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المركز
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      العمر
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <span className="sr-only">إزالة</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPlayers.map(player => (
                    <tr key={player.id} className="hover:bg-[#f9fbfa] cursor-pointer" onClick={() => handlePlayerClick(player)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="" />
                          </div>
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900">{player.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{player.team || 'غير معروف'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{player.position || 'غير معروف'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{player.age ? `${player.age} سنة` : 'غير معروف'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromShortlist(player);
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlayers.map(player => (
                <div key={player.id} className="relative">
                  <div 
                    className="absolute top-2 right-2 z-10 bg-white p-1.5 rounded-full shadow-sm cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromShortlist(player);
                    }}
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </div>
                  <PlayerCard 
                    player={player}
                    onClick={() => handlePlayerClick(player)}
                    onToggleShortlist={() => removeFromShortlist(player)}
                    isShortlisted={true}
                    isHighlighted={player.successRate >= 85}
                  />
                </div>
              ))}
            </div>
          )
        )}
      </motion.div>
      </div>
    </div>
  );
};

export default ShortlistedPlayersPage; 