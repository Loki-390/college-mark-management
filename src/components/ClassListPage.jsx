import React from 'react';
import { ArrowLeft, Book, ChevronRight, Inbox, User, Clock, RefreshCw } from 'lucide-react';

const ClassListPage = ({ selectedDept, selectedConfig, subjects, onSelectClass, onBack }) => {
  const deptName = selectedDept?.name || selectedDept || "Department";

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12 text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold mb-6 transition-all group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Sections
        </button>

        <header className="mb-8">
          <p className="text-indigo-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">Step 3: Select Subject</p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dept. of {deptName}</h1>
          <div className="flex gap-2 mt-2">
             <span className="text-slate-500 font-bold text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200/50 uppercase">Year {selectedConfig.year}</span>
             <span className="text-slate-500 font-bold text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200/50 uppercase">Section {selectedConfig.section}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects && subjects.length > 0 ? (
            subjects.map((cls) => (
              <div 
                key={cls.id}
                onClick={() => onSelectClass(cls)}
                className="group bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Book size={22} />
                    </div>
                    <p className="text-indigo-500 font-bold text-[10px] uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
                      {cls.id}
                    </p>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight mb-3">
                    {cls.name}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-2">
                    <div className="flex items-center gap-1.5 text-slate-500">
                       <User size={13} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                       <span className="text-[11px] font-semibold truncate max-w-[100px]">{cls.staff || 'N/A'}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-slate-500">
                       <Clock size={13} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                       <span className="text-[11px] font-semibold">{cls.hours || '0'} Hrs</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide group-hover:text-indigo-600 transition-colors">
                    Enter Marks
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300 shadow-sm">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 bg-white rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
              <Inbox className="text-slate-200 mb-3" size={32} />
              <h3 className="text-base font-bold text-slate-400">No Subjects Assigned</h3>
              <p className="text-xs text-slate-300 mt-1">Please ask Admin to assign subjects.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassListPage;