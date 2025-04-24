import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, StarOff, ChevronDown, ChevronUp, Calendar, Video, Edit, Plus, Trash, Save, Clock, MapPin, User, Ruler, Weight, Flag } from 'lucide-react';
import { motion } from 'framer-motion';
import StatsRadarChart from '../components/StatsRadarChart';
import BackButton from '../components/BackButton';

const PlayerDetailsPage = ({ player, navigateToPage }) => {
  const [shortlistedPlayers, setShortlistedPlayers] = useState([]);
  const [showAllAttributes, setShowAllAttributes] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [notes, setNotes] = useState(player?.notes || []);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteText, setEditingNoteText] = useState('');
  const [sourcePage, setSourcePage] = useState('mainPage');

   
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Default stats if none are provided
  const defaultStats = [
    { name: "السرعة", value: 85 },
    { name: "التمرير", value: 80 },
    { name: "التسديد", value: 75 },
    { name: "المراوغة", value: 82 },
    { name: "القوة البدنية", value: 78 },
    { name: "الدقة", value: 77 },
    { name: "التمركز", value: 79 },
    { name: "الرؤية", value: 83 }
  ];
  
  // Sample upcoming games
  const upcomingGames = [
    { id: 1, date: '2025-04-05', title: 'الهلال vs النصر', time: '19:00', location: 'استاد الملك فهد الدولي' },
    { id: 2, date: '2025-04-12', title: 'الأهلي vs الهلال', time: '20:30', location: 'استاد الجوهرة' }
  ];
  
  // Sample highlights
  const highlights = [
    { id: 1, title: 'هدف رائع ضد النصر', date: '2025-03-10', videoUrl: '#' },
    { id: 2, title: 'مهارات فردية مميزة', date: '2025-02-25', videoUrl: '#' },
    { id: 3, title: 'تمريرة حاسمة في مباراة الأهلي', date: '2025-03-05', videoUrl: '#' }
  ];
  
  // Load shortlisted players from localStorage on component mount and when player changes
  useEffect(() => {
    const loadShortlist = () => {
      try {
        const savedShortlist = localStorage.getItem('shortlistedPlayers');
        console.log("PlayerDetailsPage - Loading shortlist from localStorage:", savedShortlist);
        
        if (savedShortlist) {
          const parsedShortlist = JSON.parse(savedShortlist);
          console.log("PlayerDetailsPage - Parsed shortlist:", parsedShortlist);
          setShortlistedPlayers(parsedShortlist);
        }
      } catch (e) {
        console.error("PlayerDetailsPage - Error loading shortlisted players:", e);
      }
    };
    
    // Load initially
    loadShortlist();
    
    // Set up event listener for storage changes
    const handleStorageChange = (e) => {
      console.log("PlayerDetailsPage - Storage event detected:", e);
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
  }, [player]); // Re-run when player changes
  
  // Check if the current player is shortlisted
  const isShortlisted = player ? shortlistedPlayers.some(p => p.id === player.id) : false;
  
  // Toggle shortlist status for the current player
  const toggleShortlist = () => {
    if (!player) return;
    
    console.log("PlayerDetailsPage - Toggling shortlist for player:", player.name);
    let newShortlist;
    
    if (isShortlisted) {
      newShortlist = shortlistedPlayers.filter(p => p.id !== player.id);
      console.log("PlayerDetailsPage - Removing player from shortlist");
    } else {
      // Make sure we use the full player object with all details
      newShortlist = [...shortlistedPlayers, player];
      console.log("PlayerDetailsPage - Adding player to shortlist");
    }
    
    console.log("PlayerDetailsPage - New shortlist:", newShortlist);
    
    // Update state
    setShortlistedPlayers(newShortlist);
    
    // Save to localStorage
    try {
      const jsonString = JSON.stringify(newShortlist);
      console.log("PlayerDetailsPage - Saving to localStorage:", jsonString);
      localStorage.setItem('shortlistedPlayers', jsonString);
      
      // Dispatch custom event to notify other components
      const event = new CustomEvent('shortlistUpdated');
      window.dispatchEvent(event);
    } catch (e) {
      console.error("PlayerDetailsPage - Error saving shortlist to localStorage:", e);
    }
  };
  
  // Determine the source page when component mounts
  useEffect(() => {
    // Check if we have a referrer in sessionStorage
    const storedSource = sessionStorage.getItem('playerDetailsSource');
    
    if (storedSource) {
      setSourcePage(storedSource);
    }
  }, []);
  
  // If no player is provided, show a message
  if (!player) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">بيانات اللاعب غير متوفرة</p>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300"
          onClick={() => navigateToPage('playersPage')}
        >
          الرجوع إلى قائمة اللاعبين
        </button>
      </div>
    );
  }

  // Ensure player has attributes
  const playerAttributes = player.attributes || defaultStats;

  // Determine if player is a goalkeeper
  const isGoalkeeper = player.position === "حارس مرمى" || player.playerType === "goalkeeper";

  // Render position-specific stats
  const renderPositionSpecificStats = () => {
    if (isGoalkeeper) {
      // Goalkeeper stats
      return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">إحصائيات الحارس</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-[#f9fbfa] rounded-lg">
              <p className="text-sm text-gray-500">التصديات</p>
              <p className="text-2xl font-bold text-[#032425]">{player.saves || 0}</p>
            </div>
            <div className="text-center p-3 bg-[#f9fbfa] rounded-lg">
              <p className="text-sm text-gray-500">شباك نظيفة</p>
              <p className="text-2xl font-bold text-[#032425]">{player.cleanSheets || 0}</p>
            </div>
            <div className="text-center p-3 bg-[#f9fbfa] rounded-lg">
              <p className="text-sm text-gray-500">أهداف استقبلها</p>
              <p className="text-2xl font-bold text-[#032425]">{player.goalsConceded || 0}</p>
            </div>
            <div className="text-center p-3 bg-[#f9fbfa] rounded-lg">
              <p className="text-sm text-gray-500">تصديات/مباراة</p>
              <p className="text-2xl font-bold text-[#032425]">{player.savesPerMatch || 0}</p>
            </div>
          </div>
        </div>
      );
    } else {
      // Outfield player stats
      return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">إحصائيات اللاعب</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-[#f9fbfa] rounded-lg">
              <p className="text-sm text-gray-500">الأهداف</p>
              <p className="text-2xl font-bold text-[#032425]">{player.goals || 0}</p>
            </div>
            <div className="text-center p-3 bg-[#f9fbfa] rounded-lg">
              <p className="text-sm text-gray-500">التمريرات الحاسمة</p>
              <p className="text-2xl font-bold text-[#032425]">{player.assists || 0}</p>
            </div>
            <div className="text-center p-3 bg-[#f9fbfa] rounded-lg">
              <p className="text-sm text-gray-500">دقة التمريرات</p>
              <p className="text-2xl font-bold text-[#032425]">{player.passSuccessRate || 0}%</p>
            </div>
            <div className="text-center p-3 bg-[#f9fbfa] rounded-lg">
              <p className="text-sm text-gray-500">المباريات</p>
              <p className="text-2xl font-bold text-[#032425]">{player.matches || 0}</p>
            </div>
          </div>
          
          {/* Additional position-specific stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {player.position === "مدافع" && (
              <>
                <div className="text-center p-3 bg-[#f9fbfa] rounded-lg">
                  <p className="text-sm text-gray-500">تدخلات</p>
                  <p className="text-2xl font-bold text-[#032425]">{player.tackles || 0}</p>
                </div>
                <div className="text-center p-3 bg-[#f9fbfa] rounded-lg">
                  <p className="text-sm text-gray-500">اعتراضات</p>
                  <p className="text-2xl font-bold text-[#032425]">{player.interceptions || 0}</p>
                </div>
                <div className="text-center p-3 bg-[#f9fbfa] rounded-lg">
                  <p className="text-sm text-gray-500">تشتيت</p>
                  <p className="text-2xl font-bold text-[#032425]">{player.clearances || 0}</p>
                </div>
              </>
            )}
            
            {player.position === "جناح" && (
              <>
                <div className="text-center p-3 bg-[#f9fbfa] rounded-lg">
                  <p className="text-sm text-gray-500">مراوغات/مباراة</p>
                  <p className="text-2xl font-bold text-[#032425]">{player.dribblesPerMatch || 0}</p>
                </div>
                <div className="text-center p-3 bg-[#f9fbfa] rounded-lg">
                  <p className="text-sm text-gray-500">تمريرات مفتاحية</p>
                  <p className="text-2xl font-bold text-[#032425]">{player.keyPasses || 0}</p>
                </div>
              </>
            )}
            
            {player.position === "مهاجم" && (
              <div className="text-center p-3 bg-[#f9fbfa] rounded-lg">
                <p className="text-sm text-gray-500">تسديدات/مباراة</p>
                <p className="text-2xl font-bold text-[#032425]">{player.shotsPerMatch || 0}</p>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  // Render injury history section
  const renderInjuryHistory = () => {
    if (!player.injuries || player.injuries.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">سجل الإصابات</h3>
          <p className="text-gray-500 text-center py-2">لا يوجد سجل إصابات</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">سجل الإصابات</h3>
        <ul className="divide-y divide-gray-100">
          {player.injuries.map((injury, index) => (
            <li key={index} className="py-2 flex items-start">
              <div className="w-2 h-2 mt-2 rounded-full mr-2 flex-shrink-0" 
                style={{ 
                  backgroundColor: injury.recoveryStatus === 'تعافى' ? '#10b981' : 
                                  injury.recoveryStatus === 'قيد التعافي' ? '#f59e0b' : 
                                  '#ef4444' 
                }}></div>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <p className="font-medium text-sm">{injury.type}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    injury.recoveryStatus === 'تعافى' ? 'bg-green-100 text-green-800' : 
                    injury.recoveryStatus === 'قيد التعافي' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {injury.recoveryStatus}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{injury.description}</p>
                <div className="flex flex-wrap text-xs text-gray-400 mt-1">
                  <span className="ml-3">من: {injury.startDate}</span>
                  {injury.endDate && <span className="ml-3">إلى: {injury.endDate}</span>}
                  <span>مدة الغياب: {injury.duration}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    
    const note = {
      id: Date.now(),
      text: newNote,
      date: new Date().toISOString()
    };
    
    setNotes([...notes, note]);
    setNewNote('');
  };
  
  const deleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };
  
  const startEditingNote = (note) => {
    setEditingNoteId(note.id);
    setEditingNoteText(note.text);
  };
  
  const saveEditedNote = () => {
    if (!editingNoteText.trim()) return;
    
    setNotes(notes.map(note => 
      note.id === editingNoteId 
        ? { ...note, text: editingNoteText } 
        : note
    ));
    
    setEditingNoteId(null);
    setEditingNoteText('');
  };

  const handleBackClick = () => {
    console.log('Back button clicked');
    navigateToPage('playersPage');
  };

  return (
    <div className="relative">
      <BackButton 
        navigateToPage={navigateToPage}
        destination="playersPage"
      />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-16"
      >
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="relative">
              <div className={`h-40 bg-gradient-to-b from-[#032425] to-[#599E68]`}></div>
              <div className="absolute -bottom-16 right-8">
                <div className="bg-white rounded-full p-2 shadow">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                    alt={player.name} 
                    className="w-32 h-32 rounded-full"
                  />
                </div>
              </div>
              <button 
                className="absolute top-4 left-4 bg-white p-2 rounded-full shadow"
                onClick={toggleShortlist}
              >
                {isShortlisted ? (
                  <Star size={20} className="text-yellow-400" />
                ) : (
                  <StarOff size={20} className="text-gray-400" />
                )}
              </button>
            </div>
            
            <div className="pt-20 p-8">
              <div className="flex flex-wrap items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 ml-3">{player.name}</h2>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="bg-[#E7F0EB] text-[#032425] text-sm font-medium px-2.5 py-0.5 rounded">
                    {player.position || 'لاعب'}
                  </span>
                  <span className="text-gray-500">
                    {player.age ? `${player.age} سنة` : ''}
                  </span>
                </div>
              </div>
              
              <div className="text-gray-600 mb-6 space-y-3">
                <div className="flex items-center space-x-1 space-x-reverse">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <User size={18} className="text-[#032425]" />
                  </div>
                  <p><span className="font-medium">النادي:</span> {player.team || 'غير محدد'}</p>
                </div>
                
                <div className="flex items-center space-x-1 space-x-reverse">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <Flag size={18} className="text-[#032425]" />
                  </div>
                  <p><span className="font-medium">الجنسية:</span> {player.nationality || 'غير محدد'}</p>
                </div>
                
                <div className="flex items-center space-x-1 space-x-reverse">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <Ruler size={18} className="text-[#032425]" />
                  </div>
                  <p><span className="font-medium">الطول:</span> {player.height ? `${player.height} سم` : 'غير محدد'}</p>
                </div>
                
                <div className="flex items-center space-x-1 space-x-reverse">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <Weight size={18} className="text-[#032425]" />
                  </div>
                  <p><span className="font-medium">الوزن:</span> {player.weight ? `${player.weight} كجم` : 'غير محدد'}</p>
                </div>
                
                <div className="flex items-center space-x-1 space-x-reverse">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#032425]">
                      <path d="M5 21h14"></path>
                      <path d="M7 6h.01"></path>
                      <path d="M8 10c.95 0 1.436 0 1.698.152.07.04.134.103.196.196.152.262.152.744.152 1.704V21" stroke="#032425"></path>
                      <path d="m11 5.6 3 1.8v7.8a3 3 0 0 1-3 3"></path>
                    </svg>
                  </div>
                  <p><span className="font-medium">القدم المفضلة:</span> {player.foot || 'غير محدد'}</p>
                </div>
                
                {player.bio && (
                  <p className="mt-4">{player.bio}</p>
                )}
                {player.additionalInfo && (
                  <p className="text-gray-600">{player.additionalInfo}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">الإحصائيات</h3>
                  <div>
                    <p className="flex justify-between mb-2">
                      <span className="text-gray-600">عدد المباريات</span>
                      <span className="font-semibold">{player.matches || '0'}</span>
                    </p>
                    <p className="flex justify-between mb-2">
                      <span className="text-gray-600">نسبة النجاح</span>
                      <span className="font-semibold">{player.successRate || '0'}%</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">البطاقات</span>
                      <span className="font-semibold">{player.cardsCount || '0'}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">المستوى</h3>
                  <div>
                    {playerAttributes.slice(0, 3).map((attr, index) => (
                      <div key={index} className="mb-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">{attr.name}</span>
                          <span className={attr.value >= 90 ? 'text-green-500 font-semibold' : 
                                        attr.value >= 80 ? 'text-[#ffce00] font-semibold' : 
                                        'text-yellow-500 font-semibold'}>{attr.value}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
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
                    ))}
                    
                    <button 
                      onClick={() => setShowAllAttributes(!showAllAttributes)}
                      className="text-[#032425] text-sm font-medium flex items-center mt-1"
                    >
                      {showAllAttributes ? (
                        <>
                          <span className="ml-1">عرض أقل</span>
                          <ChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          <span className="ml-1">عرض المزيد</span>
                          <ChevronDown size={16} />
                        </>
                      )}
                    </button>
                    
                    {showAllAttributes && (
                      <div className="mt-3">
                        {playerAttributes.slice(3).map((attr, index) => (
                          <div key={index} className="mb-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600">{attr.name}</span>
                              <span className={attr.value >= 90 ? 'text-green-500 font-semibold' : 
                                            attr.value >= 80 ? 'text-[#ffce00] font-semibold' : 
                                            'text-yellow-500 font-semibold'}>{attr.value}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
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
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Render position-specific stats */}
          {renderPositionSpecificStats()}
          
          {/* Injury History */}
          {renderInjuryHistory()}
          
          {/* Radar Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="font-semibold text-gray-800 mb-4">تحليل الأداء</h3>
            <div className="h-72">
              {/* Replace with actual chart component if needed */}
              <StatsRadarChart attributes={playerAttributes.slice(0, 6)} />
            </div>
          </motion.div>
          
          {/* Tabs Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="flex border-b">
              <button 
                className={`flex-1 py-3 px-4 font-medium text-sm ${activeTab === 'upcoming' ? 'text-[#032425] border-b-2 border-[#032425]' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('upcoming')}
              >
                المباريات القادمة
              </button>
              <button 
                className={`flex-1 py-3 px-4 font-medium text-sm ${activeTab === 'highlights' ? 'text-[#032425] border-b-2 border-[#032425]' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('highlights')}
              >
                أبرز اللقطات
              </button>
              <button 
                className={`flex-1 py-3 px-4 font-medium text-sm ${activeTab === 'notes' ? 'text-[#032425] border-b-2 border-[#032425]' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('notes')}
              >
                ملاحظات
              </button>
            </div>
            
            <div className="p-6">
              {/* Upcoming Matches Tab */}
              {activeTab === 'upcoming' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">المباريات القادمة</h3>
                  <div className="space-y-4">
                    {upcomingGames.map(game => (
                      <div key={game.id} className="border rounded-lg p-4 flex items-start">
                        <div className="bg-[#E7F0EB] rounded-lg p-2 text-center w-16 h-16 flex flex-col justify-center items-center mr-4">
                          <Calendar size={16} className="text-[#032425] mb-1" />
                          <span className="text-[#032425] text-sm">{game.date.split('-')[2]}/{game.date.split('-')[1]}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{game.title}</h4>
                          <div className="flex items-center text-gray-600 text-sm mt-1">
                            <Clock size={14} className="ml-1" />
                            <span>{game.time}</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm mt-1">
                            <MapPin size={14} className="ml-1" />
                            <span>{game.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Highlights Tab */}
              {activeTab === 'highlights' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">أبرز اللقطات</h3>
                  <div className="space-y-4">
                    {highlights.map(highlight => (
                      <div key={highlight.id} className="border rounded-lg p-4 flex items-start">
                        <div className="bg-[#E7F0EB] rounded-lg p-2 text-center w-16 h-16 flex flex-col justify-center items-center mr-4">
                          <Video size={16} className="text-[#032425] mb-1" />
                          <span className="text-[#032425] text-sm">{highlight.date.split('-')[2]}/{highlight.date.split('-')[1]}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{highlight.title}</h4>
                          <button className="text-[#032425] text-sm font-medium mt-2 flex items-center">
                            <span className="ml-1">مشاهدة الفيديو</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Notes Tab */}
              {activeTab === 'notes' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">ملاحظات</h3>
                  <div className="mb-4">
                    <textarea 
                      className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500 resize-none"
                      placeholder="أضف ملاحظة..."
                      rows="3"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    ></textarea>
                    <button 
                      className="mt-2 bg-[#032425] text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium"
                      onClick={addNote}
                    >
                      <Plus size={16} className="ml-1" />
                      <span>إضافة ملاحظة</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {notes.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">لا توجد ملاحظات بعد</p>
                    ) : (
                      notes.map(note => (
                        <div key={note.id} className="border rounded-lg p-4">
                          {editingNoteId === note.id ? (
                            <div>
                              <textarea 
                                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500 resize-none"
                                rows="3"
                                value={editingNoteText}
                                onChange={(e) => setEditingNoteText(e.target.value)}
                              ></textarea>
                              <div className="flex justify-end mt-2">
                                <button 
                                  className="bg-[#032425] text-white px-3 py-1 rounded-lg flex items-center text-sm font-medium"
                                  onClick={saveEditedNote}
                                >
                                  <Save size={14} className="ml-1" />
                                  <span>حفظ</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="text-gray-700 mb-2">{note.text}</p>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">
                                  {new Date(note.date).toLocaleDateString('ar-SA')}
                                </span>
                                <div className="flex space-x-2 space-x-reverse">
                                  <button 
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={() => startEditingNote(note)}
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button 
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => deleteNote(note.id)}
                                  >
                                    <Trash size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlayerDetailsPage; 