import React, { useState } from 'react';
import { ArrowLeft, Layers, ArrowRight, Calendar } from 'lucide-react';

const SectionListPage = ({ selectedDept, onSelectSection, onBack }) => {
  const [activeYear, setActiveYear] = useState(1);
  const sections = ['A', 'B', 'C', 'D'];
  const years = [1, 2, 3, 4];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans p-6 lg:p-12 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold mb-8 transition-all"
        >
          <ArrowLeft size={20} /> Back to Departments
        </button>

        <header className="mb-10">
          <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">Step 2: Configuration</p>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Dept. of {selectedDept?.name}</h1>
        </header>

        {/* --- YEAR SELECTION TABS --- */}
        <div className="flex flex-wrap items-center gap-3 mb-10 border-b border-slate-200 pb-8">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider mr-4">
            <Calendar size={16} /> Select Year:
          </div>
          {years.map((yr) => (
            <button
              key={yr}
              onClick={() => setActiveYear(yr)}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-300 border-2 ${
                activeYear === yr
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600'
              }`}
            >
              {yr}{yr === 1 ? 'st' : yr === 2 ? 'nd' : yr === 3 ? 'rd' : 'th'} Year
            </button>
          ))}
        </div>

        {/* --- SECTION SELECTION GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((sec) => (
            <div 
              key={sec}
              onClick={() => onSelectSection({ year: activeYear, section: sec })}
              className="group bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-slate-100 group-hover:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-white transition-all duration-300 shadow-inner">
                    <Layers size={28} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                      Year {activeYear}
                    </span>
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-slate-800 mb-2">Section {sec}</h3>
                <p className="text-slate-500 font-medium text-sm mb-6 uppercase tracking-widest">
                  Batch {2028 - activeYear}
                </p>
              </div>

              <button className="w-full py-4 bg-slate-50 group-hover:bg-indigo-600 text-slate-700 group-hover:text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300">
                View Classes <ArrowRight size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionListPage;