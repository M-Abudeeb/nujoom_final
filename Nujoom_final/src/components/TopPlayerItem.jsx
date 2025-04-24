const TopPlayerItem = ({ name, team, rating }) => (
  <div className="flex items-center justify-between">
    <div>
      <div className="font-bold">{name}</div>
      <div className="text-sm text-gray-500">{team}</div>
    </div>
    <div className="font-bold text-yellow-500">{rating}</div>
  </div>
);

export default TopPlayerItem; 