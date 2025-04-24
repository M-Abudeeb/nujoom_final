import logo from '../logo/nujoom-logo.png';


const Footer = () => {
  return (
    <footer className="bg-white border-t py-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <img src={logo} alt="Nujoom" className="h-16 w-auto scale-110" />
            </div>
            <p className="text-gray-600 text-sm mt-auto font-bold">منصة اكتشاف المواهب الكروية</p>
            </div>
          
          <div className="flex flex-col md:flex-row">
            <a href="#" className="text-gray-600 hover:text-green-700 mb-2 md:mb-0 md:ml-6 font-bold">عن المنصة</a>
            <a href="#" className="text-gray-600 hover:text-green-700 mb-2 md:mb-0 md:ml-6 font-bold">سياسة الخصوصية</a>
            <a href="#" className="text-gray-600 hover:text-green-700 mb-2 md:mb-0 md:ml-6 font-bold">الشروط والأحكام</a>
            <a href="#" className="text-gray-600 hover:text-green-700 mb-2 md:mb-0 md:ml-6 font-bold">اتصل بنا</a>
          </div>
        </div>
        
        <div className="mt-6 border-t pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} منصة نجوم. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 