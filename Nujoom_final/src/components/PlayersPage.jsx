import { Search, Grid, List, ChevronDown, Save } from 'lucide-react';
import SecondHeader from './SecondHeader';
import DetailedPlayerCard from './DetailedPlayerCard';
import TopPlayerItem from './TopPlayerItem';
import StatsRadarChart from './StatsRadarChart';
import { players } from '../data/players';
import PlayerCard from '../components/PlayerCard';

const PlayersPage = ({ navigateToPage }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">صفحة اللاعبين</h1>
      <div className="grid grid-cols-3 gap-6">
        {players.map(player => (
          <PlayerCard
            key={player.id}
            player={player}
            onClick={() => navigateToPage('playerDetails', player)}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayersPage; 