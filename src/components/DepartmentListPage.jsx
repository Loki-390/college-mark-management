import React, { useState } from 'react';
import { Building2, Search, ArrowRight } from 'lucide-react';

const depts = [
  { id: 'CSE', name: 'Computer Science', head: 'Dr. Alan Turing', labs: 8 },
  { id: 'IT', name: 'Information Technology', head: 'Dr. Grace Hopper', labs: 6 },
  { id: 'ECE', name: 'Electronics & Comm.', head: 'Dr. Nikola Tesla', labs: 10 },
  { id: 'EEE', name: 'Electrical Engineering', head: 'Dr. Thomas Edison', labs: 7 },
  { id: 'MECH', name: 'Mechanical Engineering', head: 'Dr. James Watt', labs: 12 },
  { id: 'CIVIL', name: 'Civil Engineering', head: 'Dr. Arthur Casagrande', labs: 5 },
  { id: 'AI', name: 'Artificial Intelligence', head: 'Dr. John McCarthy', labs: 4 },
  { id: 'DS', name: 'Data Science', head: 'Dr. DJ Patil', labs: 4 },
  { id: 'BIO', name: 'Biotechnology', head: 'Dr. Rosalind Franklin', labs: 6 },
  { id: 'AERO', name: 'Aeronautical Eng.', head: 'Dr. Wright Brothers', labs: 3 },
];

const DepartmentListPage = ({ onSelectDept }) => {
  const [query, setQuery] = useState("");
  const filtered = depts.filter(d => d.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">College Registry</h1>
            <p className="text-slate-500 font-medium text-sm">Select a Department to view available classes</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search departments..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-6 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((d) => (
            <div 
              key={d.id}
              onClick={() => onSelectDept(d)}
              className="group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[320px]"
            >
              <div>
                <div className="w-16 h-16 bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl flex items-center justify-center text-slate-500 mb-6 transition-all duration-300 shadow-inner group-hover:shadow-indigo-200 group-hover:-translate-y-1">
                  <Building2 size={32} />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{d.name}</h3>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-500">HOD: {d.head}</p>
                  <p className="text-xs font-medium text-slate-400 italic">{d.labs} Active Labs</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-8">
                <span className="text-slate-600 font-bold text-sm">View Department</span>
                <div className="w-11 h-11 rounded-full bg-slate-100 group-hover:bg-indigo-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-300">
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentListPage;