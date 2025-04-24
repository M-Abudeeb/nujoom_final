import { Bell, User } from 'lucide-react';

const Layout = ({ children, navigateToPage }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Header - Only the top navigation */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div 
                className="text-green-700 font-bold cursor-pointer flex items-center ml-8"
                onClick={() => navigateToPage('mainPage')}
              >
                <img src="/logo.svg" alt="نجوم" className="h-8 w-8 ml-2" />
                نجوم
              </div>
              <nav>
                <ul className="flex space-x-8 space-x-reverse">
                  <li>
                    <button 
                      className="hover:text-green-700 focus:outline-none"
                      onClick={() => navigateToPage('playersPage')}
                    >
                      اللاعبون
                    </button>
                  </li>
                  <li>
                    <button 
                      className="hover:text-green-700 focus:outline-none"
                      onClick={() => navigateToPage('comparisons')}
                    >
                      المقارنات
                    </button>
                  </li>
                  <li>
                    <button className="hover:text-green-700 focus:outline-none">التقارير</button>
                  </li>
                  <li>
                    <button className="hover:text-green-700 focus:outline-none">التنبيهات</button>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button className="px-3">EN</button>
              <button className="p-2">
                <Bell size={20} />
              </button>
              <button className="p-2">
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-4">
        {children}
      </main>
    </div>
  );
};

export default Layout; 