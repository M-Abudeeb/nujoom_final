import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './pages/MainPage';
import PlayersPage from './pages/PlayersPage';
import PlayerDetailsPage from './pages/PlayerDetailsPage';
import ComparisonsPage from './pages/ComparisonsPage';
//import MatchAnalysisPage from './pages/MatchAnalysisPage';
import CalendarPage from './pages/CalendarPage';
import NotesPage from './pages/NotesPage';
import ShortlistedPlayersPage from './pages/ShortlistedPlayersPage';

function App() {
  const [currentPage, setCurrentPage] = useState('mainPage');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const navigateToPage = (page, data = null) => {
    setCurrentPage(page);
    if (page === 'playerDetails' && data) {
      setSelectedPlayer(data);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'mainPage':
        return <MainPage navigateToPage={navigateToPage} />;
      case 'playersPage':
        return <PlayersPage navigateToPage={navigateToPage} />;
      case 'playerDetails':
        return <PlayerDetailsPage player={selectedPlayer} navigateToPage={navigateToPage} />;
      case 'comparisons':
        return <ComparisonsPage navigateToPage={navigateToPage} />;
    //  case 'matchAnalysis':
      //  return <MatchAnalysisPage navigateToPage={navigateToPage} />;
      case 'calendar':
        return <CalendarPage navigateToPage={navigateToPage} />;
      case 'notes':
        return <NotesPage navigateToPage={navigateToPage} />;
      case 'shortlistedPlayers':
        return <ShortlistedPlayersPage navigateToPage={navigateToPage} />;
      default:
        return <MainPage navigateToPage={navigateToPage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header navigateToPage={navigateToPage} currentPage={currentPage} />
      
      <main className="flex-grow">
        <div className="container mx-auto px-6 py-4">
          {renderPage()}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
