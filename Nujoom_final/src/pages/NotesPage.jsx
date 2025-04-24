import React, { useState, useEffect } from 'react';
import { ArrowRight, Plus, Search, Edit2, Trash2, Calendar, User, FileText, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/BackButton';

const NotesPage = ({ navigateToPage }) => {
  // State for notes
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  
  // Form state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [notePlayer, setNotePlayer] = useState('');
  const [noteDate, setNoteDate] = useState('');
  
  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('playerNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);
  
  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('playerNotes', JSON.stringify(notes));
  }, [notes]);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Filter notes based on search query
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.player.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Add new note
  const addNote = () => {
    if (!noteTitle.trim()) return;
    
    const newNote = {
      id: Date.now(),
      title: noteTitle,
      content: noteContent,
      player: notePlayer,
      date: noteDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    
    setNotes([newNote, ...notes]);
    resetForm();
    setShowAddForm(false);
  };
  
  // Update existing note
  const updateNote = () => {
    if (!noteTitle.trim() || !editingNoteId) return;
    
    setNotes(notes.map(note => 
      note.id === editingNoteId ? {
        ...note,
        title: noteTitle,
        content: noteContent,
        player: notePlayer,
        date: noteDate
      } : note
    ));
    
    resetForm();
    setEditingNoteId(null);
  };
  
  // Delete note
  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };
  
  // Edit note (load data into form)
  const editNote = (note) => {
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNotePlayer(note.player);
    setNoteDate(note.date);
    setEditingNoteId(note.id);
    setShowAddForm(true);
  };
  
  // Reset form
  const resetForm = () => {
    setNoteTitle('');
    setNoteContent('');
    setNotePlayer('');
    setNoteDate('');
  };
  
  // Cancel editing/adding
  const cancelForm = () => {
    resetForm();
    setShowAddForm(false);
    setEditingNoteId(null);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-SA', options);
  };

  return (
    <div className="pt-8">
      <BackButton 
        navigateToPage={navigateToPage} 
        destination="dashboard" 
      />
      
      <div className="flex justify-center items-center mb-6">
      </div>
      
      <div className="mt-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-1"
        >
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">الملاحظات</h2>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#2d4f2b] hover:bg-[#1f3b1e] text-white p-2 rounded-full"
                onClick={() => {
                  resetForm();
                  setShowAddForm(true);
                  setEditingNoteId(null);
                }}
              >
                <Plus size={18} />
              </motion.button>
            </div>
            
            <div className="relative mb-4">
              <input 
                type="text" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#2d4f2b] focus:border-[#2d4f2b] block w-full p-2.5 pr-10 text-right" 
                placeholder="بحث في الملاحظات..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Search size={18} className="text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {filteredNotes.map((note, index) => (
                  <motion.div 
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className={`p-3 rounded-lg cursor-pointer border ${editingNoteId === note.id ? 'border-[#2d4f2b] bg-[#e8efe8]' : 'border-gray-200'}`}
                    onClick={() => editNote(note)}
                  >
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900 truncate">{note.title}</h3>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                    <div className="text-sm text-gray-500 truncate mt-1">{note.content}</div>
                    <div className="flex items-center text-xs text-gray-400 mt-2">
                      <Calendar size={12} className="ml-1" />
                      <span>{formatDate(note.date)}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredNotes.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6 text-gray-500"
                >
                  {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد ملاحظات بعد'}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2"
        >
          <AnimatePresence>
            {showAddForm ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold mb-4">
                  {editingNoteId ? 'تعديل ملاحظة' : 'إضافة ملاحظة جديدة'}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                    <input 
                      type="text" 
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#2d4f2b] focus:border-[#2d4f2b] block w-full p-2.5 text-right" 
                      placeholder="أدخل عنوان الملاحظة..." 
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اللاعب</label>
                    <input 
                      type="text" 
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#2d4f2b] focus:border-[#2d4f2b] block w-full p-2.5 text-right" 
                      placeholder="أدخل اسم اللاعب..." 
                      value={notePlayer}
                      onChange={(e) => setNotePlayer(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                    <input 
                      type="date" 
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#2d4f2b] focus:border-[#2d4f2b] block w-full p-2.5 text-right" 
                      value={noteDate}
                      onChange={(e) => setNoteDate(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">المحتوى</label>
                    <textarea 
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#2d4f2b] focus:border-[#2d4f2b] block w-full p-2.5 text-right" 
                      rows="6"
                      placeholder="أدخل محتوى الملاحظة..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-2 space-x-reverse">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition duration-300 flex items-center"
                      onClick={cancelForm}
                    >
                      <X size={18} className="ml-2" />
                      إلغاء
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-[#2d4f2b] hover:bg-[#1f3b1e] text-white py-2 px-4 rounded-lg transition duration-300 flex items-center"
                      onClick={editingNoteId ? updateNote : addNote}
                    >
                      <Check size={18} className="ml-2" />
                      {editingNoteId ? 'تحديث' : 'إضافة'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm p-6 h-full flex items-center justify-center"
              >
                <div className="text-center">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">اختر ملاحظة أو أضف ملاحظة جديدة</h3>
                  <p className="text-gray-500 mb-4">يمكنك إضافة ملاحظات حول اللاعبين والمباريات</p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#2d4f2b] hover:bg-[#1f3b1e] text-white py-2 px-4 rounded-lg transition duration-300 flex items-center mx-auto"
                    onClick={() => {
                      resetForm();
                      setShowAddForm(true);
                    }}
                  >
                    <Plus size={18} className="ml-2" />
                    إضافة ملاحظة جديدة
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
};

export default NotesPage; 