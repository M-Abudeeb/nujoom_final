import React, { useState, useEffect } from 'react';
import { ArrowRight, Grid, List, Search, Star, StarOff, Filter, ChevronDown, ChevronUp, X, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';
import PlayerCard from '../components/PlayerCard';
import BackButton from '../components/BackButton';
// Import players directly
import { players } from '../data/players';

const PlayersPage = ({ navigateToPage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [shortlistedPlayers, setShortlistedPlayers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Dropdown states
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);
  const [positionDropdownOpen, setPositionDropdownOpen] = useState(false);
  const [footDropdownOpen, setFootDropdownOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    ageRange: [17, 21],
    height: [160, 190],
    weight: [60, 85],
    teams: [],
    positions: [],
    foot: [],
    matches: [0, 30],    // Added for games played
    goals: [0, 30],      // Added for goals
    saves: [0, 100],     // Added for saves
  });
  
  // Get unique values for filter options
  const teams = [...new Set(players.map(player => player.team))];
  const positions = [...new Set(players.map(player => player.position))];
  const footOptions = [...new Set(players.map(player => player.foot))];
  
  // Load shortlisted players from localStorage on component mount
  useEffect(() => {
    const loadShortlist = () => {
      try {
        const savedShortlist = localStorage.getItem('shortlistedPlayers');
        console.log("Loading shortlist from localStorage:", savedShortlist);
        
        if (savedShortlist) {
          const parsedShortlist = JSON.parse(savedShortlist);
          console.log("Parsed shortlist:", parsedShortlist);
          setShortlistedPlayers(parsedShortlist);
        }
      } catch (e) {
        console.error("Error loading shortlisted players:", e);
      }
    };
    
    // Load initially
    loadShortlist();
    
    // Set up event listener for storage changes
    const handleStorageChange = (e) => {
      console.log("Storage event detected:", e);
      if (e.key === 'shortlistedPlayers' || e.key === null) {
        loadShortlist();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for our custom event
    window.addEventListener('shortlistUpdated', loadShortlist);
    
    // Clean up
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('shortlistUpdated', loadShortlist);
    };
  }, []);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.team-dropdown') && teamDropdownOpen) {
        setTeamDropdownOpen(false);
      }
      if (!event.target.closest('.position-dropdown') && positionDropdownOpen) {
        setPositionDropdownOpen(false);
      }
      if (!event.target.closest('.foot-dropdown') && footDropdownOpen) {
        setFootDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [teamDropdownOpen, positionDropdownOpen, footDropdownOpen]);
  
  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      ageRange: [17, 21],
      height: [160, 190],
      weight: [60, 85],
      teams: [],
      positions: [],
      foot: [],
      matches: [0, 30],
      goals: [0, 30],
      saves: [0, 100],
    });
    setSearchQuery('');
  };
  
  // Toggle filter visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Toggle selection in array filters (teams, positions, foot)
  const toggleArrayFilter = (filterType, value) => {
    setFilters(prev => {
      const currentValues = [...prev[filterType]];
      
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [filterType]: currentValues.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [filterType]: [...currentValues, value]
        };
      }
    });
  };
  
  // Apply all filters to players
  const filteredPlayers = players.filter(player => {
    // Determine if player is a goalkeeper
    const isGoalkeeper = player.position === "حارس مرمى" || player.playerType === "goalkeeper";

    // Text search filter
    const textMatch = 
      searchQuery === '' ||
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (player.team && player.team.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (player.position && player.position.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Age range filter
    const ageMatch = 
      player.age >= filters.ageRange[0] && 
      player.age <= filters.ageRange[1];
    
    // Height filter
    const heightMatch = 
      !player.height || 
      (player.height >= filters.height[0] && 
       player.height <= filters.height[1]);
    
    // Weight filter
    const weightMatch = 
      !player.weight || 
      (player.weight >= filters.weight[0] && 
       player.weight <= filters.weight[1]);
    
    // Team filter
    const teamMatch = 
      filters.teams.length === 0 || 
      (player.team && filters.teams.includes(player.team));
    
    // Position filter
    const positionMatch = 
      filters.positions.length === 0 || 
      (player.position && filters.positions.includes(player.position));
    
    // Foot preference filter
    const footMatch = 
      filters.foot.length === 0 || 
      (player.foot && filters.foot.includes(player.foot));
    
    // Matches played filter
    const matchesMatch = 
      !player.matches || 
      (player.matches >= filters.matches[0] && 
       player.matches <= filters.matches[1]);
    
    // Goals filter (for outfield players)
    let goalsMatch = true;
    if (filters.goals[0] > 0 || filters.goals[1] < 30) {
      // If the goals filter is being used (not at default values)
      if (isGoalkeeper) {
        // Goalkeepers don't score goals, so they should be excluded
        goalsMatch = false;
      } else {
        goalsMatch = 
          !player.goals || 
          (player.goals >= filters.goals[0] && 
           player.goals <= filters.goals[1]);
      }
    }
    
    // Saves filter (for goalkeepers)
    let savesMatch = true;
    if (filters.saves[0] > 0 || filters.saves[1] < 100) {
      // If the saves filter is being used (not at default values)
      if (!isGoalkeeper) {
        // Outfield players don't make saves, so they should be excluded
        savesMatch = false;
      } else {
        savesMatch = 
          !player.saves || 
          (player.saves >= filters.saves[0] && 
           player.saves <= filters.saves[1]);
      }
    }
    
    return textMatch && ageMatch && heightMatch && weightMatch && teamMatch && 
           positionMatch && footMatch && matchesMatch && goalsMatch && savesMatch;
  });

  // Check if a player is shortlisted
  const isPlayerShortlisted = (playerId) => {
    return shortlistedPlayers.some(player => player.id === playerId);
  };

  // Toggle shortlist status for a player
  const toggleShortlist = (player) => {
    console.log("Toggling shortlist for player:", player.name);
    let newShortlist;
    
    if (isPlayerShortlisted(player.id)) {
      newShortlist = shortlistedPlayers.filter(p => p.id !== player.id);
      console.log("Removing player from shortlist");
    } else {
      // Find the full player object from the players array to ensure all data is preserved
      const fullPlayerData = players.find(p => p.id === player.id) || player;
      newShortlist = [...shortlistedPlayers, fullPlayerData];
      console.log("Adding player to shortlist");
    }
    
    console.log("New shortlist:", newShortlist);
    
    // Update state
    setShortlistedPlayers(newShortlist);
    
    // Save to localStorage
    try {
      const jsonString = JSON.stringify(newShortlist);
      console.log("Saving to localStorage:", jsonString);
      localStorage.setItem('shortlistedPlayers', jsonString);
      
      // Dispatch custom event to notify other components
      const event = new CustomEvent('shortlistUpdated');
      window.dispatchEvent(event);
    } catch (e) {
      console.error("Error saving shortlist to localStorage:", e);
    }
  };

  // Handle player card click
  const handlePlayerClick = (player) => {
    // Store the source page in sessionStorage
    sessionStorage.setItem('playerDetailsSource', 'playersPage');
    
    // Navigate to player details
    navigateToPage('playerDetails', player);
  };

  // Render range filter with text inputs instead of dropdowns
  const renderRangeFilter = (label, min, max, filterKey, step = 1, unit = '') => {
    return (
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-800 mb-3">{label}</h3>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* Min value text input */}
            <div className="relative min-w-24">
              <input
                type="text"
                inputMode="numeric"
                value={filters[filterKey][0]}
                onChange={(e) => {
                  if (e.target.value === '') {
                    setFilters(prev => ({
                      ...prev,
                      [filterKey]: ['', prev[filterKey][1]]
                    }));
                    return;
                  }
                  
                  const value = parseInt(e.target.value);
                  if (!isNaN(value)) {
                    handleFilterChange(filterKey, [value, filters[filterKey][1]]);
                  }
                }}
                onBlur={(e) => {
                  // Restore minimal value if field is left empty
                  if (e.target.value === '') {
                    handleFilterChange(filterKey, [0, filters[filterKey][1]]);
                  }
                }}
                className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-[#032425] focus:border-[#032425] text-right"
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">{unit}</span>
            </div>
            
            <span className="mx-2 text-gray-500">-</span>
            
            {/* Max value text input */}
            <div className="relative min-w-24">
              <input
                type="text"
                inputMode="numeric"
                value={filters[filterKey][1]}
                onChange={(e) => {
                  if (e.target.value === '') {
                    setFilters(prev => ({
                      ...prev,
                      [filterKey]: [prev[filterKey][0], '']
                    }));
                    return;
                  }
                  
                  const value = parseInt(e.target.value);
                  if (!isNaN(value)) {
                    handleFilterChange(filterKey, [filters[filterKey][0], value]);
                  }
                }}
                onBlur={(e) => {
                  // If left empty, set to a high value
                  if (e.target.value === '') {
                    handleFilterChange(filterKey, [filters[filterKey][0], 999]);
                  }
                }}
                className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-[#032425] focus:border-[#032425] text-right"
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">{unit}</span>
            </div>
          </div>
          
          <div className="text-sm font-medium bg-[#E7F0EB] text-[#032425] px-3 py-1 rounded-full">
            {filters[filterKey][0]}{unit} - {filters[filterKey][1]}{unit}
          </div>
        </div>
        
        {/* Simple visualization bar */}
        <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#032425] to-[#599E68]"
            style={{ 
              width: `${Math.min(100, ((filters[filterKey][1] - filters[filterKey][0]) / (max - min)) * 100)}%`,
              marginLeft: `${Math.min(100, ((filters[filterKey][0] - min) / (max - min)) * 100)}%`
            }}
          ></div>
        </div>
      </div>
    );
  };

  // Get display text for dropdown based on selected values
  const getDropdownDisplayText = (filterType, options, labelSingular, labelPlural) => {
    if (filters[filterType].length === 0) {
      return `اختر ${labelPlural}`;
    } else if (filters[filterType].length === 1) {
      return `${labelSingular}: ${filters[filterType][0]}`;
    } else {
      return `${labelPlural}: ${filters[filterType].length}`;
    }
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-6">
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
              <button 
                className={`p-2 rounded-lg flex items-center ${showFilters ? 'bg-[#E7F0EB] text-[#032425]' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={toggleFilters}
              >
                <Sliders size={20} className="ml-1" />
                <span className="text-sm">تصفية متقدمة</span>
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
              {searchQuery && (
                <button 
                  className="absolute inset-y-0 left-0 flex items-center pl-3"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
          
          {/* Filter Dropdowns - Always visible */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {/* Team Dropdown */}
            <div className="relative team-dropdown">
              <button 
                className="bg-white border border-gray-300 text-gray-700 w-full px-4 py-2 rounded-lg text-sm flex justify-between items-center hover:border-[#032425] transition-colors"
                onClick={() => setTeamDropdownOpen(!teamDropdownOpen)}
              >
                <span>{getDropdownDisplayText('teams', teams, 'الفريق', 'الفريق')}</span>
                <ChevronDown size={16} className={`transition-transform duration-300 text-[#032425] ${teamDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {teamDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-60 overflow-y-auto">
                  <div className="p-2 border-b border-gray-100 bg-[#f9fbfa]">
                    <h4 className="text-sm font-medium text-[#032425] mb-1">الفريق</h4>
                  </div>
                  {teams.map(team => (
                    <label key={team} className="flex items-center px-4 py-2 hover:bg-[#f9fbfa] cursor-pointer transition-colors">
                      <input 
                        type="checkbox"
                        checked={filters.teams.includes(team)}
                        onChange={() => toggleArrayFilter('teams', team)}
                        className="ml-2 accent-[#032425] h-4 w-4"
                      />
                      <span className="text-sm text-gray-700">{team}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Position Dropdown */}
            <div className="relative position-dropdown">
              <button 
                className="bg-white border border-gray-300 text-gray-700 w-full px-4 py-2 rounded-lg text-sm flex justify-between items-center hover:border-[#032425] transition-colors"
                onClick={() => setPositionDropdownOpen(!positionDropdownOpen)}
              >
                <span>{getDropdownDisplayText('positions', positions, 'المركز', 'المركز')}</span>
                <ChevronDown size={16} className={`transition-transform duration-300 text-[#032425] ${positionDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {positionDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-60 overflow-y-auto">
                  <div className="p-2 border-b border-gray-100 bg-[#f9fbfa]">
                    <h4 className="text-sm font-medium text-[#032425] mb-1">المركز</h4>
                  </div>
                  {positions.map(position => (
                    <label key={position} className="flex items-center px-4 py-2 hover:bg-[#f9fbfa] cursor-pointer transition-colors">
                      <input 
                        type="checkbox"
                        checked={filters.positions.includes(position)}
                        onChange={() => toggleArrayFilter('positions', position)}
                        className="ml-2 accent-[#032425] h-4 w-4"
                      />
                      <span className="text-sm text-gray-700">{position}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Foot Preference Dropdown */}
            <div className="relative foot-dropdown">
              <button 
                className="bg-white border border-gray-300 text-gray-700 w-full px-4 py-2 rounded-lg text-sm flex justify-between items-center hover:border-[#032425] transition-colors"
                onClick={() => setFootDropdownOpen(!footDropdownOpen)}
              >
                <span>{getDropdownDisplayText('foot', footOptions, 'القدم المفضلة', 'القدم المفضلة')}</span>
                <ChevronDown size={16} className={`transition-transform duration-300 text-[#032425] ${footDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {footDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                  <div className="p-2 border-b border-gray-100 bg-[#f9fbfa]">
                    <h4 className="text-sm font-medium text-[#032425] mb-1">القدم المفضلة</h4>
                  </div>
                  {footOptions.map(foot => (
                    <label key={foot} className="flex items-center px-4 py-2 hover:bg-[#f9fbfa] cursor-pointer transition-colors">
                      <input 
                        type="checkbox"
                        checked={filters.foot.includes(foot)}
                        onChange={() => toggleArrayFilter('foot', foot)}
                        className="ml-2 accent-[#032425] h-4 w-4"
                      />
                      <span className="text-sm text-gray-700">{foot}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Advanced Filters - Toggle */}
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 border-t pt-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">تصفية متقدمة</h3>
                <button 
                  className="text-sm font-medium text-[#032425] hover:underline flex items-center"
                  onClick={resetFilters}
                >
                  <X size={14} className="ml-1" />
                  إعادة ضبط
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Age Range Filter with text inputs */}
                {renderRangeFilter('العمر', 17, 21, 'ageRange', 1, ' سنة')}
                
                {/* Height Range Filter with text inputs */}
                {renderRangeFilter('الطول', 160, 190, 'height', 5, ' سم')}
                
                {/* Weight Range Filter with text inputs */}
                {renderRangeFilter('الوزن', 60, 85, 'weight', 5, ' كجم')}
                
                {/* Games Played Range Filter */}
                {renderRangeFilter('المباريات', 0, 30, 'matches', 1, ' مباراة')}
                
                <div className="border-t border-gray-200 pt-4 mb-2">
                  <h4 className="text-md font-medium text-gray-800 mb-3">إحصائيات حسب المركز</h4>
                </div>
                
                {/* Goals Range Filter - for outfield players */}
                <div className="mb-1 text-xs text-gray-500">
                  استخدم هذا الفلتر للاعبين الميدانيين فقط
                </div>
                {renderRangeFilter('الأهداف', 0, 30, 'goals', 1, ' هدف')}
                
                {/* Saves Range Filter - for goalkeepers */}
                <div className="mb-1 text-xs text-gray-500">
                  استخدم هذا الفلتر لحراس المرمى فقط
                </div>
                {renderRangeFilter('التصديات', 0, 100, 'saves', 5, ' تصدي')}
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Count */}
        <div className="bg-[#E7F0EB] text-[#032425] text-sm font-medium px-4 py-2 rounded-lg mb-4 inline-block">
          تم العثور على {filteredPlayers.length} لاعب
        </div>

        {filteredPlayers.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">لا توجد نتائج مطابقة للبحث</p>
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
                      الطول
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المفضلة
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPlayers.map(player => (
                    <tr key={player.id} className="hover:bg-[#f9fbfa] cursor-pointer transition-colors" onClick={() => handlePlayerClick(player)}>
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
                        <div className="text-sm text-gray-900">{player.team}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{player.position}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{player.age} سنة</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{player.height} سم</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-gray-400 hover:text-gray-900 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleShortlist(player);
                          }}
                        >
                          {isPlayerShortlisted(player.id) ? (
                            <Star size={20} className="text-yellow-400" />
                          ) : (
                            <StarOff size={20} className="text-gray-400" />
                          )}
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
                <PlayerCard 
                  key={player.id}
                  player={player}
                  onClick={() => handlePlayerClick(player)}
                  onToggleShortlist={() => toggleShortlist(player)}
                  isShortlisted={isPlayerShortlisted(player.id)}
                  isHighlighted={player.successRate >= 85}
                />
              ))}
            </div>
          )
        )}
      </motion.div>
      </div>
    </div>
  );
};

export default PlayersPage; 