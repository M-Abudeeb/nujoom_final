import { Search, Bell, User, ArrowRight } from 'lucide-react';

const SecondHeader = ({ navigateToPage, showBackButton = false }) => (
  <header className="bg-white border-b">
    <div className="container mx-auto px-6 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {showBackButton && (
            <button 
              onClick={() => navigateToPage('mainPage')}
              className="flex items-center text-gray-600 hover:text-green-700 mr-4"
            >
              <ArrowRight size={20} className="ml-1" />
              العودة
            </button>
          )}
          <div 
            className="text-green-700 font-bold ml-4 cursor-pointer"
            onClick={() => navigateToPage('mainPage')}
          >
            نجوم
          </div>
          <nav className="ml-10">
            <ul className="flex space-x-6 space-x-reverse">
              <li className="mx-3">
                <a href="#" className="hover:text-green-700" onClick={() => navigateToPage('playersPage')}>
                  اللاعبون
                </a>
              </li>
              <li className="mx-3">
                <a href="#" className="hover:text-green-700" onClick={() => navigateToPage('comparisons')}>
                  المقارنات
                </a>
              </li>
              <li className="mx-3">
                <a href="#" className="hover:text-green-700">التقارير</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center">
          <div className="border rounded-md px-4 py-2 flex items-center ml-4">
            <Search size={16} className="ml-2" />
            <input 
              type="text" 
              placeholder="البحث عن لاعب..." 
              className="outline-none bg-transparent w-48"
            />
          </div>
          <button className="mx-2 p-2">
            <Bell size={20} />
          </button>
          <button className="mx-2 p-2">
            <User size={20} />
          </button>
        </div>
      </div>
    </div>
  </header>
);

export default SecondHeader; 