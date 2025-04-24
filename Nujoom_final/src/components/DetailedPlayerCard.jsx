import { Search, User, Star } from 'lucide-react';

const DetailedPlayerCard = ({ player }) => (
  <div className="bg-white rounded-md overflow-hidden shadow-sm">
    <div className="relative">
      <img src={player.image} alt={player.name} className="w-full h-40 object-cover" />
      <button className="absolute top-2 right-2 text-yellow-400">
        <Star size={20} />
      </button>
    </div>
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="font-bold">{player.name}</h3>
          <div className="flex text-sm text-gray-500">
            <span>{player.city}</span>
            <span className="mx-2">•</span>
            <span>{player.team}</span>
            <span className="mx-2">•</span>
            <span>سنة {player.age}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center my-4">
        <div>
          <div className="font-bold text-green-700">{player.successRate}%</div>
          <div className="text-xs text-gray-500">توزيع ناجح</div>
        </div>
        <div>
          <div className="font-bold">{player.actions}</div>
          <div className="text-xs text-gray-500">تصديات/مباراة</div>
        </div>
        <div>
          <div className="font-bold text-green-700">{player.rating}%</div>
          <div className="text-xs text-gray-500">نسبة الإنقاذ</div>
        </div>
      </div>

      <div className="flex mt-2">
        <button className="bg-green-700 text-white py-2 px-4 rounded-md flex-grow flex items-center justify-center mr-2">
          <Search size={16} className="ml-1" />
          عرض الملف
        </button>
        <button className="border border-gray-300 py-2 px-3 rounded-md">
          <User size={16} />
        </button>
      </div>
    </div>
  </div>
);

export default DetailedPlayerCard; 