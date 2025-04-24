import React, { useState, useEffect } from 'react';
import { ArrowRight, Plus, X, Calendar as CalendarIcon, Clock, MapPin, Check, ChevronRight, ChevronLeft, User, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';

const CalendarPage = ({ navigateToPage }) => {
  // Calendar data
  const months = [
    "يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو", 
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];
  const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  
  // Current date state - starting from April 2025
  const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 1)); // April is month 3 (0-indexed)
  const currentMonth = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  
  // Sample available games
  const availableGames = [
    { 
      id: 1, 
      date: "2025-04-05", 
      title: "الهلال vs النصر", 
      type: "match", 
      time: "19:00",
      location: "استاد الملك فهد الدولي",
    },
    { 
      id: 2, 
      date: "2025-04-12", 
      title: "الاتحاد vs الأهلي", 
      type: "match", 
      time: "20:30",
      location: "استاد الجوهرة",
    },
    { 
      id: 3, 
      date: "2025-04-19", 
      title: "الشباب vs الفيصلي", 
      type: "match", 
      time: "18:45",
      location: "استاد الأمير فيصل بن فهد",
    },
    { 
      id: 4, 
      date: "2025-04-26", 
      title: "الأهلي vs الاتحاد", 
      type: "match", 
      time: "20:00",
      location: "استاد مدينة الملك عبدالله الرياضية",
    },
    { 
      id: 5, 
      date: "2025-05-03", 
      title: "النصر vs الشباب", 
      type: "match", 
      time: "19:30",
      location: "استاد الأمير فيصل بن فهد",
    },
    { 
      id: 6, 
      date: "2025-05-10", 
      title: "الهلال vs الاتحاد", 
      type: "match", 
      time: "20:15",
      location: "استاد الملك فهد الدولي",
    },
  ];
  
  // User's added events
  const [userEvents, setUserEvents] = useState([
    { 
      id: 1, 
      gameId: 1,
      date: "2025-04-05", 
      title: "الهلال vs النصر", 
      type: "match", 
      time: "19:00",
      location: "استاد الملك فهد الدولي",
      playersToWatch: ["محمد الشمراني", "خالد العطوي"],
      notes: "التركيز على أداء اللاعبين الشباب في الفريقين",
      isUserAdded: true
    },
  ]);

  // State for add event form
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [playersToWatch, setPlayersToWatch] = useState('');
  const [eventNotes, setEventNotes] = useState('');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Function to navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Function to navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Function to remove event from user's calendar
  const removeEvent = (eventId) => {
    setUserEvents(userEvents.filter(event => event.id !== eventId));
  };

  // Function to add new event
  const addEvent = () => {
    if (!selectedGame) {
      alert('يرجى اختيار مباراة');
      return;
    }
    
    const game = availableGames.find(g => g.id === parseInt(selectedGame));
    if (!game) return;
    
    const event = {
      ...game,
      id: Date.now(),
      gameId: game.id,
      playersToWatch: playersToWatch.split(',').map(player => player.trim()).filter(player => player),
      notes: eventNotes,
      isUserAdded: true
    };
    
    setUserEvents([...userEvents, event]);
    setSelectedGame(null);
    setPlayersToWatch('');
    setEventNotes('');
    setShowAddEventForm(false);
  };

  // Function to get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Function to get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Function to check if a day has events
  const dayHasEvents = (day) => {
    if (!day) return false;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    return userEvents.some(event => event.date === dateStr);
  };

  // Function to get events for a specific day
  const getEventsForDay = (day) => {
    if (!day) return [];
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    return userEvents.filter(event => event.date === dateStr);
  };

  // Generate calendar days
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  
  // Create calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="pt-6">
      <BackButton 
        navigateToPage={navigateToPage} 
        destination="dashboard" 
      />

      <div className="flex justify-center items-center mb-4">
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <button 
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={goToPreviousMonth}
              >
                <ChevronRight size={20} />
              </button>
              <h2 className="text-lg font-bold">{currentMonth} {currentYear}</h2>
              <button 
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={goToNextMonth}
              >
                <ChevronLeft size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {days.map((day, index) => (
                <div key={index} className="text-center text-xs font-medium text-gray-500 py-1">
                  {day.substring(0, 1)}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div 
                  key={index} 
                  className={`text-center p-1 rounded-md ${
                    day ? 'hover:bg-gray-100 cursor-pointer' : ''
                  } ${
                    day && dayHasEvents(day) ? 'bg-[#e8efe8]' : ''
                  }`}
                >
                  {day && (
                    <div className="relative">
                      <span className={`text-sm ${dayHasEvents(day) ? 'font-bold text-[#2d4f2b]' : ''}`}>
                        {day}
                      </span>
                      {dayHasEvents(day) && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#2d4f2b] rounded-full"></div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button 
                className="w-full bg-[#2d4f2b] hover:bg-[#1f3b1e] text-white py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
                onClick={() => setShowAddEventForm(true)}
              >
                <Plus size={18} className="ml-2" />
                إضافة مباراة جديدة
              </button>
            </div>
          </motion.div>
        </div>
        
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-sm mb-6"
          >
            <h2 className="text-xl font-bold mb-8">المباريات المضافة</h2>
            
            {showAddEventForm && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 p-6 rounded-lg mb-8"
              >
                <h3 className="font-bold text-#2d4f2b mb-6">إضافة مباراة جديدة</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">اختر المباراة</label>
                    <select 
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#2d4f2b] focus:border-[#2d4f2b] block w-full p-2.5"
                      value={selectedGame || ''}
                      onChange={(e) => setSelectedGame(e.target.value)}
                    >
                      <option value="">-- اختر مباراة --</option>
                      {availableGames.map(game => (
                        <option key={game.id} value={game.id}>
                          {game.title} - {new Date(game.date).toLocaleDateString('ar-SA')}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">اللاعبون المراد متابعتهم (مفصولين بفواصل)</label>
                    <input 
                      type="text" 
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#2d4f2b] focus:border-[#2d4f2b] block w-full p-2.5"
                      placeholder="مثال: محمد الشمراني، خالد العطوي"
                      value={playersToWatch}
                      onChange={(e) => setPlayersToWatch(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">ملاحظات إضافية</label>
                    <textarea 
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#2d4f2b] focus:border-[#2d4f2b] block w-full p-2.5"
                      rows="3"
                      placeholder="أضف أي ملاحظات إضافية هنا..."
                      value={eventNotes}
                      onChange={(e) => setEventNotes(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-2 space-x-reverse">
                    <button 
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition duration-300"
                      onClick={() => setShowAddEventForm(false)}
                    >
                      إلغاء
                    </button>
                    <button 
                      className="bg-[#2d4f2b] hover:bg-[#1f3b1e] text-white py-2 px-4 rounded-lg transition duration-300 flex items-center"
                      onClick={addEvent}
                    >
                      <Check size={18} className="ml-2" />
                      إضافة
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            
            {userEvents.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">لم تقم بإضافة أي مباريات إلى التقويم بعد</p>
                <button 
                  className="bg-[#2d4f2b] hover:bg-[#1f3b1e] text-white py-2 px-4 rounded-lg transition duration-300"
                  onClick={() => setShowAddEventForm(true)}
                >
                  إضافة مباراة جديدة
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userEvents.map(event => (
                  <div 
                    key={event.id}
                    className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition duration-300 mb-5"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{event.title}</h3>
                        <div className="flex items-center text-gray-600 text-sm mt-2">
                          <CalendarIcon size={14} className="ml-1" />
                          <span className="ml-3">{new Date(event.date).toLocaleDateString('ar-SA')}</span>
                          {event.time && (
                            <>
                              <Clock size={14} className="mr-3 ml-1" />
                              <span className="ml-3">{event.time}</span>
                            </>
                          )}
                          {event.location && (
                            <>
                              <MapPin size={14} className="mr-3 ml-1" />
                              <span>{event.location}</span>
                            </>
                          )}
                        </div>
                        
                        {event.playersToWatch && event.playersToWatch.length > 0 && (
                          <div className="mt-5">
                            <div className="flex items-center text-gray-600 text-sm">
                              <User size={14} className="ml-1" />
                              <span className="font-medium">اللاعبون المراد متابعتهم:</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {event.playersToWatch.map((player, index) => (
                                <span 
                                  key={index}
                                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded"
                                >
                                  {player}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {event.notes && (
                          <div className="mt-3">
                            <div className="flex items-center text-gray-600 text-sm">
                              <FileText size={14} className="ml-1" />
                              <span className="font-medium">ملاحظات:</span>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{event.notes}</p>
                          </div>
                        )}
                      </div>
                      <button 
                        className="text-gray-400 hover:text-red-500 p-1"
                        onClick={() => removeEvent(event.id)}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;