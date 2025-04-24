import React, { useState, useEffect } from 'react';
import { ArrowRight, Search, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { players } from '../data/players';
import StatsRadarChart from '../components/StatsRadarChart';
import BackButton from '../components/BackButton';

const ComparisonsPage = ({ navigateToPage }) => {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter players based on search queries
  const filteredPlayers1 = players.filter(player => 
    player.name.toLowerCase().includes(searchQuery1.toLowerCase())
  );
  
  const filteredPlayers2 = players.filter(player => 
    player.name.toLowerCase().includes(searchQuery2.toLowerCase())
  );

  // Select player handlers
  const selectPlayer1 = (player) => {
    setPlayer1(player);
    setShowDropdown1(false);
  };
  
  const selectPlayer2 = (player) => {
    setPlayer2(player);
    setShowDropdown2(false);
  };

  // Swap players
  const swapPlayers = () => {
    const temp = player1;
    setPlayer1(player2);
    setPlayer2(temp);
  };

  // Calculate comparison data
  const getComparisonData = () => {
    if (!player1 || !player2) return null;
    
    // Define default stats to use when player stats are missing
    const defaultStats = {
      speed: 70,
      strength: 65,
      passing: 75,
      shooting: 80,
      dribbling: 85,
      defending: 60
    };
    
    // Create complete player stats objects with defaults for missing values
    const p1Stats = { 
      speed: player1.speed || defaultStats.speed,
      strength: player1.strength || defaultStats.strength,
      passing: player1.passing || defaultStats.passing,
      shooting: player1.shooting || defaultStats.shooting,
      dribbling: player1.dribbling || defaultStats.dribbling,
      defending: player1.defending || defaultStats.defending
    };
    
    const p2Stats = {
      speed: player2.speed || defaultStats.speed,
      strength: player2.strength || defaultStats.strength,
      passing: player2.passing || defaultStats.passing,
      shooting: player2.shooting || defaultStats.shooting,
      dribbling: player2.dribbling || defaultStats.dribbling,
      defending: player2.defending || defaultStats.defending
    };
    
    return [
      { category: 'سرعة', player1: p1Stats.speed, player2: p2Stats.speed },
      { category: 'قوة', player1: p1Stats.strength, player2: p2Stats.strength },
      { category: 'تمرير', player1: p1Stats.passing, player2: p2Stats.passing },
      { category: 'تسديد', player1: p1Stats.shooting, player2: p2Stats.shooting },
      { category: 'مراوغة', player1: p1Stats.dribbling, player2: p2Stats.dribbling },
      { category: 'دفاع', player1: p1Stats.defending, player2: p2Stats.defending },
    ];
  };

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
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Player 1 Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">اللاعب الأول</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right" 
                  placeholder="اختر اللاعب الأول..." 
                  value={searchQuery1}
                  onChange={(e) => {
                    setSearchQuery1(e.target.value);
                    setShowDropdown1(true);
                  }}
                  onFocus={() => setShowDropdown1(true)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search size={20} className="text-gray-400" />
                </div>
              </div>
              
              {showDropdown1 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg max-h-60 overflow-auto"
                >
                  {filteredPlayers1.length > 0 ? (
                    <ul className="py-1">
                      {filteredPlayers1.map(player => (
                        <li 
                          key={player.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => selectPlayer1(player)}
                        >
                          <div className="flex items-center">
                            <img 
                              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                              alt={player.name} 
                              className="w-8 h-8 rounded-full mr-2"
                            />
                            <div>
                              <div className="text-sm font-medium">{player.name}</div>
                              <div className="text-xs text-gray-500">{player.team}</div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-2 text-gray-500">لا توجد نتائج</div>
                  )}
                </motion.div>
              )}
              
              {player1 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 bg-blue-50 rounded-lg p-4"
                >
                  <div className="flex items-center">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                      alt={player1.name} 
                      className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{player1.name}</h3>
                      <div className="text-sm text-gray-600">{player1.team}</div>
                      <div className="text-sm text-gray-600">{player1.position} • {player1.age} سنة</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Player 2 Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">اللاعب الثاني</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-right" 
                  placeholder="اختر اللاعب الثاني..." 
                  value={searchQuery2}
                  onChange={(e) => {
                    setSearchQuery2(e.target.value);
                    setShowDropdown2(true);
                  }}
                  onFocus={() => setShowDropdown2(true)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search size={20} className="text-gray-400" />
                </div>
              </div>
              
              {showDropdown2 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg max-h-60 overflow-auto"
                >
                  {filteredPlayers2.length > 0 ? (
                    <ul className="py-1">
                      {filteredPlayers2.map(player => (
                        <li 
                          key={player.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => selectPlayer2(player)}
                        >
                          <div className="flex items-center">
                            <img 
                              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                              alt={player.name} 
                              className="w-8 h-8 rounded-full mr-2"
                            />
                            <div>
                              <div className="text-sm font-medium">{player.name}</div>
                              <div className="text-xs text-gray-500">{player.team}</div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-2 text-gray-500">لا توجد نتائج</div>
                  )}
                </motion.div>
              )}
              
              {player2 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 bg-green-50 rounded-lg p-4"
                >
                  <div className="flex items-center">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                      alt={player2.name} 
                      className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{player2.name}</h3>
                      <div className="text-sm text-gray-600">{player2.team}</div>
                      <div className="text-sm text-gray-600">{player2.position} • {player2.age} سنة</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          
          {player1 && player2 && (
            <div className="mt-6 flex justify-center">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center"
                onClick={swapPlayers}
              >
                <RefreshCw size={16} className="ml-1" />
                <span>تبديل اللاعبين</span>
              </motion.button>
            </div>
          )}
        </div>
        
        {player1 && player2 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-6">مقارنة الإحصائيات</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80">
                  <StatsRadarChart 
                    data={[
                      { name: 'سرعة', value: player1.speed || 0, player: player1.name },
                      { name: 'قوة', value: player1.strength || 0, player: player1.name },
                      { name: 'تمرير', value: player1.passing || 0, player: player1.name },
                      { name: 'تسديد', value: player1.shooting || 0, player: player1.name },
                      { name: 'مراوغة', value: player1.dribbling || 0, player: player1.name },
                      { name: 'دفاع', value: player1.defending || 0, player: player1.name },
                    ]}
                    compareData={[
                      { name: 'سرعة', value: player2.speed || 0, player: player2.name },
                      { name: 'قوة', value: player2.strength || 0, player: player2.name },
                      { name: 'تمرير', value: player2.passing || 0, player: player2.name },
                      { name: 'تسديد', value: player2.shooting || 0, player: player2.name },
                      { name: 'مراوغة', value: player2.dribbling || 0, player: player2.name },
                      { name: 'دفاع', value: player2.defending || 0, player: player2.name },
                    ]}
                  />
                </div>
                
                <div>
                  <div className="space-y-4">
                    {getComparisonData().map((item, index) => (
                      <motion.div 
                        key={item.category}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{item.category}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-16 text-center text-sm font-medium">
                            {item.player1}
                          </div>
                          <div className="flex-grow mx-2">
                            <div className="relative h-2 bg-gray-200 rounded-full">
                              <div 
                                className="absolute top-0 right-0 h-2 bg-blue-500 rounded-full" 
                                style={{ width: `${item.player1}%` }}
                              ></div>
                              <div 
                                className="absolute top-0 left-0 h-2 bg-green-500 rounded-full" 
                                style={{ width: `${item.player2}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="w-16 text-center text-sm font-medium">
                            {item.player2}
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{player1.name}</span>
                          <span>{player2.name}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">إحصائيات الموسم</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">المباريات</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 text-center text-sm font-medium">
                        {player1.matches || 0}
                      </div>
                      <div className="flex-grow mx-2">
                        <div className="relative h-2 bg-gray-200 rounded-full">
                          <div 
                            className="absolute top-0 right-0 h-2 bg-blue-500 rounded-full" 
                            style={{ width: `${(player1.matches / Math.max(player1.matches, player2.matches)) * 100 || 0}%` }}
                          ></div>
                          <div 
                            className="absolute top-0 left-0 h-2 bg-green-500 rounded-full" 
                            style={{ width: `${(player2.matches / Math.max(player1.matches, player2.matches)) * 100 || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-12 text-center text-sm font-medium">
                        {player2.matches || 0}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">الأهداف</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 text-center text-sm font-medium">
                        {player1.goals || 0}
                      </div>
                      <div className="flex-grow mx-2">
                        <div className="relative h-2 bg-gray-200 rounded-full">
                          <div 
                            className="absolute top-0 right-0 h-2 bg-blue-500 rounded-full" 
                            style={{ width: `${(player1.goals / Math.max(player1.goals, player2.goals)) * 100 || 0}%` }}
                          ></div>
                          <div 
                            className="absolute top-0 left-0 h-2 bg-green-500 rounded-full" 
                            style={{ width: `${(player2.goals / Math.max(player1.goals, player2.goals)) * 100 || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-12 text-center text-sm font-medium">
                        {player2.goals || 0}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">معدل النجاح</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 text-center text-sm font-medium">
                        {player1.successRate || 0}%
                      </div>
                      <div className="flex-grow mx-2">
                        <div className="relative h-2 bg-gray-200 rounded-full">
                          <div 
                            className="absolute top-0 right-0 h-2 bg-blue-500 rounded-full" 
                            style={{ width: `${player1.successRate || 0}%` }}
                          ></div>
                          <div 
                            className="absolute top-0 left-0 h-2 bg-green-500 rounded-full" 
                            style={{ width: `${player2.successRate || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-12 text-center text-sm font-medium">
                        {player2.successRate || 0}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">التقييم النهائي</h3>
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-6xl font-bold mb-4">
                      {player1.successRate > player2.successRate ? player1.name : player2.name}
                    </div>
                    <div className="text-gray-600">
                      {player1.successRate > player2.successRate ? 
                        `أفضل من ${player2.name} بفارق ${Math.abs(player1.successRate - player2.successRate)}%` : 
                        `أفضل من ${player1.name} بفارق ${Math.abs(player2.successRate - player1.successRate)}%`
                      }
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-sm p-10 text-center"
          >
            <p className="text-gray-500 mb-4">اختر لاعبين للمقارنة بينهما</p>
            <p className="text-sm text-gray-400">سيتم عرض مقارنة تفصيلية بين اللاعبين بعد اختيارهما</p>
          </motion.div>
        )}
      </motion.div>
      </div>
    </div>
  );
};

export default ComparisonsPage;