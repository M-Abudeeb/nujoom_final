const StatsRadarChart = () => (
  <div className="w-48 h-48 relative">
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Radar Background */}
      <polygon points="100,20 180,80 140,170 60,170 20,80" fill="none" stroke="#e5e7eb" strokeWidth="1" />
      <polygon points="100,40 160,90 130,160 70,160 40,90" fill="none" stroke="#e5e7eb" strokeWidth="1" />
      <polygon points="100,60 140,100 120,150 80,150 60,100" fill="none" stroke="#e5e7eb" strokeWidth="1" />
      <polygon points="100,80 120,110 110,140 90,140 80,110" fill="none" stroke="#e5e7eb" strokeWidth="1" />
      
      {/* Player Stats */}
      <polygon points="100,30 170,85 135,165 65,165 30,85" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2" />
      
      {/* Axis */}
      <line x1="100" y1="20" x2="100" y2="170" stroke="#e5e7eb" strokeWidth="1" />
      <line x1="20" y1="80" x2="180" y2="80" stroke="#e5e7eb" strokeWidth="1" />
      <line x1="60" y1="170" x2="140" y2="170" stroke="#e5e7eb" strokeWidth="1" />
      <line x1="180" y1="80" x2="60" y2="170" stroke="#e5e7eb" strokeWidth="1" />
      <line x1="20" y1="80" x2="140" y2="170" stroke="#e5e7eb" strokeWidth="1" />
      
      {/* Labels */}
      <text x="100" y="15" textAnchor="middle" fontSize="10" fill="#4b5563">ربح</text>
      <text x="190" y="80" textAnchor="start" fontSize="10" fill="#4b5563">قيادة</text>
      <text x="145" y="180" textAnchor="middle" fontSize="10" fill="#4b5563">انظباط</text>
      <text x="55" y="180" textAnchor="middle" fontSize="10" fill="#4b5563">سرعة</text>
      <text x="10" y="80" textAnchor="end" fontSize="10" fill="#4b5563">مرونة</text>
    </svg>
  </div>
);

export default StatsRadarChart; 