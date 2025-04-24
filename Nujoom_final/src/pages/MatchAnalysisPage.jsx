import { ArrowRight, Upload, Play, FileVideo, X, Check, Loader } from 'lucide-react';
import { useState } from 'react';

const MatchAnalysisPage = ({ navigateToPage }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type.startsWith('video/')) {
      setFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert('الرجاء تحميل ملف فيديو فقط');
    }
  };

  const handleUpload = () => {
    if (!file) return;
    
    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      setUploadComplete(true);
      
      // Simulate analysis process
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        setAnalysisComplete(true);
      }, 3000);
    }, 2000);
  };

  const resetUpload = () => {
    setFile(null);
    setPreviewUrl(null);
    setUploadComplete(false);
    setAnalysisComplete(false);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigateToPage('mainPage')}
          className="flex items-center text-green-700 hover:text-green-800 mr-4 bg-gray-100 px-3 py-1 rounded"
        >
          <ArrowRight size={20} className="ml-1" />
          العودة
        </button>
        <h1 className="text-2xl font-bold">اكتشاف المواهب</h1>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-bold mb-4">تحميل فيديو المباراة لاكتشاف المواهب</h2>
        <p className="mb-6 text-gray-600">
          قم بتحميل فيديو المباراة وسيقوم نظام الذكاء الاصطناعي بتحليله واكتشاف المواهب الواعدة التي قد لا تكون ظاهرة للعيان، مع استخراج الإحصائيات والبيانات الخاصة بهم.
        </p>
        
        {!file ? (
          <div 
            className={`border-2 border-dashed rounded-lg p-10 text-center ${dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <FileVideo size={48} className="text-gray-400 mb-4" />
              <p className="mb-4 font-medium">اسحب وأفلت ملف الفيديو هنا أو</p>
              <label className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors duration-200 cursor-pointer">
                اختر ملف
                <input
                  type="file"
                  className="hidden"
                  accept="video/*"
                  onChange={handleChange}
                />
              </label>
              <p className="mt-2 text-sm text-gray-500">MP4, MOV, AVI (الحد الأقصى: 500 ميجابايت)</p>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <FileVideo size={24} className="text-green-700 mr-2" />
                <span className="font-medium">{file.name}</span>
              </div>
              {!uploadComplete && (
                <button 
                  onClick={resetUpload}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            
            {previewUrl && (
              <div className="mb-4 relative aspect-video">
                <video 
                  src={previewUrl} 
                  className="w-full h-full rounded" 
                  controls
                ></video>
              </div>
            )}
            
            {!uploadComplete ? (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className={`w-full flex items-center justify-center ${
                  uploading 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-green-700 hover:bg-green-800'
                } text-white py-2 rounded-md transition-colors duration-200`}
              >
                {uploading ? (
                  <>
                    <Loader size={16} className="animate-spin ml-2" />
                    جاري التحميل...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="ml-2" />
                    تحميل الفيديو
                  </>
                )}
              </button>
            ) : (
              <div>
                <div className="flex items-center text-green-700 mb-4">
                  <Check size={20} className="ml-2" />
                  تم تحميل الفيديو بنجاح
                </div>
                
                {analyzing ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-center">
                    <Loader size={20} className="animate-spin ml-2 text-blue-500" />
                    <div>
                      <p className="font-medium text-blue-700">جاري تحليل الفيديو واكتشاف المواهب...</p>
                      <p className="text-sm text-blue-600">يرجى الانتظار، قد تستغرق هذه العملية بضع دقائق.</p>
                    </div>
                  </div>
                ) : analysisComplete ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex items-center mb-2">
                      <Check size={20} className="ml-2 text-green-700" />
                      <p className="font-medium text-green-700">تم اكتشاف مواهب جديدة!</p>
                    </div>
                    <p className="text-sm text-green-600 mb-4">تم تحليل الفيديو واكتشاف عدة مواهب واعدة لم تكن ظاهرة للعيان. يمكنك الآن استعراض هذه المواهب والإحصائيات الخاصة بهم.</p>
                    
                    <div className="flex space-x-4 space-x-reverse">
                      <button 
                        className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors duration-200"
                        onClick={() => navigateToPage('playersPage')}
                      >
                        عرض المواهب المكتشفة
                      </button>
                      <button 
                        className="bg-white border border-green-700 text-green-700 px-4 py-2 rounded-md hover:bg-green-50 transition-colors duration-200"
                        onClick={resetUpload}
                      >
                        تحميل فيديو آخر
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">كيف تعمل منصة اكتشاف المواهب</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4 text-center">
            <div className="bg-green-100 text-green-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload size={24} />
            </div>
            <h3 className="font-bold mb-2">1. تحميل الفيديو</h3>
            <p className="text-gray-600">قم بتحميل فيديو المباراة من أي دوري أو بطولة محلية.</p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <div className="bg-green-100 text-green-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader size={24} />
            </div>
            <h3 className="font-bold mb-2">2. تحليل الذكاء الاصطناعي</h3>
            <p className="text-gray-600">يقوم نظامنا بتحليل الفيديو واكتشاف المواهب الخفية وتقييم أدائهم.</p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <div className="bg-green-100 text-green-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play size={24} />
            </div>
            <h3 className="font-bold mb-2">3. إبراز المواهب</h3>
            <p className="text-gray-600">استعرض المواهب المكتشفة وشاركها مع الأندية والمدربين والكشافين.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchAnalysisPage; 