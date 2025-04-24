import { useState, useEffect } from 'react';
import { ArrowLeft, Star, BarChart2, UserCheck } from 'lucide-react';
import PlayerCard from '../components/PlayerCard';
import { players } from '../data/players';
import footballVideo from '../videos/football-intro.mp4';
import logo from '../logo/nujoom-logo.png';
import saffLogo from '../logo/SAFF+.png';

const MainPage = ({ navigateToPage }) => {
  // State for handling shortlisted players
  const [shortlistedPlayers, setShortlistedPlayers] = useState(() => {
    // Try to get existing shortlisted players from localStorage
    const saved = localStorage.getItem('shortlistedPlayers');
    return saved ? JSON.parse(saved) : [];
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Select only 5 players with the highest success rates
  const featuredPlayers = [...players]
    .sort((a, b) => b.successRate - a.successRate)
    .slice(0, 5);

  // Clean up any existing Watson Assistant elements (but keep Tawk.to)
  useEffect(() => {
    // Find and remove the Watson Assistant elements
    const watsonElements = document.querySelectorAll('[id^="WACContainer"]');
    watsonElements.forEach(el => el.remove());
    
    // Remove the Watson Assistant script
    const scriptElement = document.querySelector('script[src*="WatsonAssistantChatEntry.js"]');
    if (scriptElement) scriptElement.remove();
  }, []);

  // Handler for toggling player in shortlist
  const handleToggleShortlist = (player) => {
    setShortlistedPlayers(prevShortlisted => {
      // Check if player is already in shortlist
      const isShortlisted = prevShortlisted.some(p => p.id === player.id);
      
      let newShortlisted;
      if (isShortlisted) {
        // Remove player if already in shortlist
        newShortlisted = prevShortlisted.filter(p => p.id !== player.id);
      } else {
        // Add player to shortlist
        newShortlisted = [...prevShortlisted, player];
      }
      
      // Save to localStorage
      localStorage.setItem('shortlistedPlayers', JSON.stringify(newShortlisted));
      return newShortlisted;
    });
  };

  // Check if a player is shortlisted
  const isPlayerShortlisted = (playerId) => {
    return shortlistedPlayers.some(player => player.id === playerId);
  };

  const handlePlayerClick = (player) => {
    // Store the source page in sessionStorage
    sessionStorage.setItem('playerDetailsSource', 'mainPage');
    
    // Navigate to player details
    navigateToPage('playerDetails', player);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Video Welcome Section */}
      <div className="relative" style={{ 
        height: '100vh', 
        width: '100vw', 
        marginLeft: 'calc(-50vw + 50%)', 
        marginRight: 'calc(-50vw + 50%)',
        marginTop: '-16px',
        marginBottom: '-2px' // Remove any potential gap
      }}>
        {/* Video Background */}
        <video 
          className="absolute w-full h-full object-cover"
          autoPlay 
          muted 
          loop
          playsInline
          src={footballVideo}
        >
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay with content */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">مرحباً بك في منصة نجوم</h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl">
            منصة اكتشاف المواهب الكروية في المملكة العربية السعودية
          </p>
          <button 
            onClick={() => navigateToPage('playersPage')}
            className="bg-[#2d4f2b] hover:bg-[#1B5E20] text-white text-lg px-8 py-3 rounded-full transition-colors duration-300 flex items-center"
          >
            ابدأ الاستكشاف الآن
            <ArrowLeft size={20} className="mr-2" />
          </button>
        </div>
      </div>

      {/* Container for the rest of the content with proper padding */}
      <div className="container mx-auto px-6 py-10 flex-grow">
      {/* About Section */}
      <div className="bg-white p-8 rounded-lg shadow mb-10">
        <h2 className="text-2xl font-extrabold mb-6 text-[#2d4f2b] text-center">عن المنصة</h2>
        <div className="grid grid-cols-1 gap-8">
          <div>
            <p className="mb-4">
              منصة <span className="font-bold text-[#032425]">نجوم</span> هي منصة متخصصة في اكتشاف المواهب الكروية الخفية في المملكة العربية السعودية، تهدف إلى إبراز اللاعبين الموهوبين الذين لم يحظوا بالاهتمام الكافي.
            </p>
            <p className="mb-8">
              تستخدم المنصة تقنيات الذكاء الاصطناعي المتقدمة لتحليل مقاطع الفيديو واستخراج البيانات بشكل آلي، وتتميز بارتباطها المباشر مع <span className="font-bold">SAFF+</span> (الاتحاد السعودي لكرة القدم) مما يضمن تحديث البيانات بشكل مستمر ويتيح للمواهب الشابة فرصة الظهور أمام المدربين والكشافين.
            </p>
          </div>
          
          {/* Features Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Feature 1 */}
            <div className="bg-[#48724a] rounded-lg shadow p-4 text-center flex flex-col items-center transition-transform duration-300 hover:scale-105">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <Star className="text-yellow-400 w-10 h-10" />
              </div>
              <h3 className="text-white font-bold mb-2">اكتشاف المواهب الخفية</h3>
              <p className="text-white text-sm">باستخدام تقنيات الذكاء الاصطناعي</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-[#48724a] rounded-lg shadow p-4 text-center flex flex-col items-center transition-transform duration-300 hover:scale-105">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <BarChart2 className="text-yellow-400 w-10 h-10" />
              </div>
              <h3 className="text-white font-bold mb-2">تحليل شامل</h3>
              <p className="text-white text-sm">لأداء اللاعبين وإبراز نقاط القوة لديهم</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-[#48724a] rounded-lg shadow p-4 text-center flex flex-col items-center transition-transform duration-300 hover:scale-105">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <img src={saffLogo} alt="SAFF+" className="w-18 h-18 object-contain" />
              </div>
              <h3 className="text-white font-bold mb-2">تكامل مباشر</h3>
              <p className="text-white text-sm">مع بيانات +SAFF لضمان الدقة والمصداقية</p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-[#48724a] rounded-lg shadow p-4 text-center flex flex-col items-center transition-transform duration-300 hover:scale-105">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="text-yellow-400 w-10 h-10" />
              </div>
              <h3 className="text-white font-bold mb-2">فرصة للاعبين</h3>
              <p className="text-white text-sm">من مختلف المناطق للظهور على الساحة الكروية</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white p-8 rounded-lg shadow mb-10">
        <h2 className="text-2xl font-extrabold mb-8 text-center text-[#2d4f2b]">أرقام تتحدث عنا</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
          <div className="p-6 bg-[#E7F0EB] rounded-lg transition-transform hover:scale-105 duration-300">
            <div className="text-4xl font-bold text-[#032425] mb-2">+27000</div>
            <div className="text-gray-600">لاعب </div>
          </div>
          <div className="p-6 bg-[#E7F0EB] rounded-lg transition-transform hover:scale-105 duration-300">
            <div className="text-4xl font-bold text-[#032425] mb-2">+600</div>
            <div className="text-gray-600">نادي مسجل</div>
          </div>
        </div>
      </div>

      {/* Featured Players Section */}
      <div className="mb-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">المواهب البارزة</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPlayers.map(player => (
            <PlayerCard
              key={player.id}
              player={player}
              onClick={() => handlePlayerClick(player)}
              onToggleShortlist={() => handleToggleShortlist(player)}
              isShortlisted={isPlayerShortlisted(player.id)}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigateToPage('playersPage')}
            className="bg-[#416858] hover:bg-[#1B5E20] text-white px-6 py-2 rounded-md transition-colors duration-200"
          >
            عرض جميع المواهب
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default MainPage;