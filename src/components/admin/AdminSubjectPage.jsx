import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, BookOpen, Hash, CheckCircle2, User, Clock, AlertCircle, Edit3, X } from 'lucide-react';

const AdminSubjectPage = ({ selectedDept, selectedYear, selectedSection, subjects, onAddSubject, onDeleteSubject, onEditSubject, onBack }) => {
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [staffName, setStaffName] = useState('');
  const [classHrs, setClassHrs] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const staffList = ["Dr. Arulmani", "Prof. Sampath", "Mrs. Priya", "Mr. Rajesh", "Dr. Kavitha", "Staff Not Assigned"];
  const deptName = selectedDept?.name || selectedDept || "Department";

  const startEdit = (sub) => {
    setIsEditing(true);
    setNewSubName(sub.name);
    setNewSubCode(sub.id);
    setStaffName(sub.staff);
    setClassHrs(sub.hours);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setNewSubName('');
    setNewSubCode('');
    setStaffName('');
    setClassHrs('');
  };

  const handleSubmit = () => {
    if (!newSubName || !newSubCode || !staffName || !classHrs) {
      setError("All fields are required.");
      setTimeout(() => setError(''), 3000);
      return;
    }

    const subData = {
      id: newSubCode.trim(),
      name: newSubName.trim(),
      staff: staffName,
      hours: classHrs,
      dept: deptName,
      year: selectedYear,
      section: selectedSection
    };

    if (isEditing) {
      onEditSubject(subData);
      setIsEditing(false);
    } else {
      const isDuplicate = subjects.some(sub => sub.id.toLowerCase() === newSubCode.trim().toLowerCase());
      if (isDuplicate) {
        setError(`Subject code "${newSubCode}" is already in use.`);
        return;
      }
      onAddSubject(subData);
    }

    setNewSubName(''); setNewSubCode(''); setStaffName(''); setClassHrs('');
    triggerToast();
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] p-4 sm:p-8 font-sans text-slate-900">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="text-emerald-400" size={20} />
          <span className="text-sm font-bold">{isEditing ? "Updated Successfully" : "Assigned Successfully"}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold mb-8 transition-all group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Sections
        </button>

        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">{isEditing ? "Edit Subject" : "Management"}</h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
              {deptName} • Year {selectedYear} • Sec {selectedSection}
            </p>
          </div>
          {isEditing && (
            <button onClick={cancelEdit} className="flex items-center gap-1 text-rose-500 font-bold text-xs uppercase tracking-widest hover:bg-rose-50 px-3 py-2 rounded-lg transition-all">
              <X size={14}/> Cancel Edit
            </button>
          )}
        </div>

        {/* Entry Form */}
        <div className={`bg-white p-6 sm:p-8 rounded-[2rem] border shadow-sm mb-10 transition-all ${isEditing ? 'border-amber-200 ring-4 ring-amber-50' : 'border-slate-100'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="relative">
              <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="text" placeholder="Subject Name" value={newSubName} onChange={(e) => setNewSubName(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>

            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="text" placeholder="Subject Code" value={newSubCode} disabled={isEditing} onChange={(e) => setNewSubCode(e.target.value)} className={`w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 ${isEditing ? 'opacity-50' : ''}`} />
            </div>

            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 z-10" size={18} />
              <select value={staffName} onChange={(e) => setStaffName(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-10 py-4 text-sm font-bold outline-none appearance-none cursor-pointer">
                <option value="">Select Staff Member</option>
                {staffList.map((staff, index) => <option key={index} value={staff}>{staff}</option>)}
              </select>
            </div>

            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="number" placeholder="Total Class Hours" value={classHrs} onChange={(e) => setClassHrs(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-4 text-sm font-bold outline-none" />
            </div>
          </div>

          <button onClick={handleSubmit} className={`w-full rounded-xl py-4 font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] ${isEditing ? 'bg-amber-500 text-white' : 'bg-indigo-600 text-white'}`}>
            {isEditing ? "Update Subject Details" : "Assign Subject & Staff"}
          </button>
        </div>

        {/* Assigned List */}
        <div className="space-y-4">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Assigned Subjects</h2>
          {subjects.map((sub) => (
            <div key={sub.id} className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-indigo-100 transition-all shadow-sm">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                  {sub.id.slice(0, 3)}
                </div>
                {/* Fixed visibility container */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                     <h4 className="font-bold text-slate-800 text-base leading-tight break-words">{sub.name}</h4>
                     <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-md font-bold border border-slate-200 uppercase whitespace-normal break-all">
                        {sub.id}
                     </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5 whitespace-normal">
                      <User size={12} className="text-slate-300 shrink-0"/> 
                      <span className="break-words">{sub.staff}</span>
                    </p>
                    <p className="text-[11px] font-bold text-indigo-400 uppercase flex items-center gap-1.5 shrink-0">
                      <Clock size={12} className="text-indigo-200 shrink-0"/> {sub.hours} Hrs
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                <button onClick={() => startEdit(sub)} className="p-2.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit3 size={18} /></button>
                <button onClick={() => onDeleteSubject(sub.id)} className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>  
      </div>
    </div>
  );
};

export default AdminSubjectPage;