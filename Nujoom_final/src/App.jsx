import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './pages/MainPage';
import PlayersPage from './pages/PlayersPage';
import PlayerDetailsPage from './pages/PlayerDetailsPage';
import ComparisonsPage from './pages/ComparisonsPage';
import MatchAnalysisPage from './pages/MatchAnalysisPage';
import ShortlistedPlayersPage from './pages/ShortlistedPlayersPage';
import CalendarPage from './pages/CalendarPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import { players } from './data/players';
import Dashboard from './pages/Dashboard';
import TalentedPlayersPage from './pages/TalentedPlayersPage';

// Add a console log to check if players is being imported correctly
console.log("Imported players:", players);

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [shortlistedPlayers, setShortlistedPlayers] = useState([]);

  const navigateToPage = (page, data = null) => {
    console.log("Navigating to:", page);
    setCurrentPage(page);
    if (page === 'playerDetails' && data) {
      setSelectedPlayer(data);
    }
  };

  const handleToggleShortlist = (player) => {
    try {
      console.log("Toggling shortlist for player:", player);
      if (!player || !player.id) return;
      
      const isAlreadyShortlisted = shortlistedPlayers.some(p => p.id === player.id);
      
      if (isAlreadyShortlisted) {
        setShortlistedPlayers(shortlistedPlayers.filter(p => p.id !== player.id));
      } else {
        setShortlistedPlayers([...shortlistedPlayers, player]);
      }
    } catch (error) {
      console.error("Error toggling shortlist:", error);
    }
  };

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98
    }
  };

  const homePageVariants = {
    initial: {
      opacity: 0,
      scale: 1.02
    },
    animate: {
      opacity: 1,
      scale: 1
    },
    exit: {
      opacity: 0,
      scale: 0.98
    }
  };

  const renderPage = () => {
    const content = (() => {
      switch (currentPage) {
        case 'dashboard':
          return <Dashboard navigateToPage={navigateToPage} />;
        case 'playersPage':
          return (
            <PlayersPage 
              navigateToPage={navigateToPage} 
              players={players}
              onClick={(player) => navigateToPage('playerDetails', player)}
              onToggleShortlist={handleToggleShortlist}
              shortlistedPlayers={shortlistedPlayers}
            />
          );
        case 'playerDetails':
          return (
            <PlayerDetailsPage 
              player={selectedPlayer} 
              navigateToPage={navigateToPage}
              onToggleShortlist={handleToggleShortlist}
              shortlistedPlayers={shortlistedPlayers}
            />
          );
        case 'shortlistedPlayers':
          return (
            <ShortlistedPlayersPage 
              navigateToPage={navigateToPage}
              shortlistedPlayers={shortlistedPlayers}
              onClick={(player) => navigateToPage('playerDetails', player)}
              onToggleShortlist={handleToggleShortlist}
            />
          );
        case 'talentedPlayers':
          return (
            <TalentedPlayersPage 
              navigateToPage={navigateToPage}
              players={players}
              onClick={(player) => navigateToPage('playerDetails', player)}
              onToggleShortlist={handleToggleShortlist}
              shortlistedPlayers={shortlistedPlayers}
            />
          );
        case 'calendar':
          return <CalendarPage navigateToPage={navigateToPage} />;
        case 'reports':
          return <ReportsPage navigateToPage={navigateToPage} />;
        case 'settings':
          return <SettingsPage navigateToPage={navigateToPage} />;
        default:
          return <Dashboard navigateToPage={navigateToPage} />;
      }
    })();

    return (
      <motion.div
        key={currentPage}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={currentPage === 'dashboard' ? homePageVariants : pageVariants}
        transition={{ 
          duration: 0.4,
          ease: "easeOut"
        }}
      >
        {content}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header navigateToPage={navigateToPage} currentPage={currentPage} />
      
      <main className="flex-grow">
        <div className="container mx-auto px-6 py-4">
          <AnimatePresence mode="wait">
            {renderPage()}
          </AnimatePresence>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App; 