import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, User, Hash, CheckCircle2, AlertCircle, Edit3, X, UserPlus, Users } from 'lucide-react';

const AdminStudentPage = ({ selectedDept, selectedYear, selectedSection, students, onUpdateStudents, onBack }) => {
  const [name, setName] = useState('');
  const [roll, setRoll] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const deptName = selectedDept?.name || selectedDept || "Department";

  const handleAddOrUpdate = () => {
    if (!name.trim() || !roll.trim()) {
      setError("Please fill both Name and Roll Number");
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (isEditing) {
      const updatedList = students.map(s => s.id === editId ? { ...s, name, roll } : s);
      onUpdateStudents(updatedList);
      setIsEditing(false);
      setEditId(null);
    } else {
      if (students.some(s => s.roll.toLowerCase() === roll.toLowerCase())) {
        setError("This Roll Number already exists!");
        setTimeout(() => setError(''), 3000);
        return;
      }
      const newStudent = { id: Date.now(), name, roll, marks: Array(7).fill('') };
      onUpdateStudents([...students, newStudent]);
    }

    setName(''); setRoll(''); setError('');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const startEdit = (student) => {
    setIsEditing(true);
    setEditId(student.id);
    setName(student.name);
    setRoll(student.roll);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] p-4 sm:p-8 font-sans text-slate-900">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="text-emerald-400" size={20} />
          <span className="text-sm font-bold">Database Updated</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold mb-8 transition-all group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>

        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">{isEditing ? "Edit Student" : "Student Enrollment"}</h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{deptName} • Year {selectedYear} • Sec {selectedSection}</p>
          </div>
          {isEditing && (
            <button onClick={() => { setIsEditing(false); setName(''); setRoll(''); }} className="text-rose-500 font-bold text-xs uppercase tracking-widest px-3 py-2 bg-rose-50 rounded-lg">Cancel Edit</button>
          )}
        </div>

        <div className={`bg-white p-6 sm:p-8 rounded-[2rem] border shadow-sm mb-10 transition-all ${isEditing ? 'border-amber-200 ring-4 ring-amber-50' : 'border-slate-100'}`}>
          {error && <div className="mb-6 flex items-center gap-3 text-rose-600 bg-rose-50 p-4 rounded-xl border border-rose-100 font-bold text-sm"><AlertCircle size={18}/> {error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100" /></div>
            <div className="relative"><Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input type="text" placeholder="Roll Number" value={roll} onChange={(e) => setRoll(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100" /></div>
          </div>
          <button onClick={handleAddOrUpdate} className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${isEditing ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white hover:bg-slate-900'}`}>
            {isEditing ? <CheckCircle2 size={20}/> : <UserPlus size={20}/>} {isEditing ? "Update Student Details" : "Enroll Student"}
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
             <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Users size={14}/> Enrolled Students ({students.length})</h2>
          </div>
          {students.length === 0 ? (
            <div className="bg-white p-16 rounded-[2rem] border border-dashed border-slate-100 text-center">
               <p className="text-slate-400 font-bold">No students enrolled in this section.</p>
            </div>
          ) : (
            students.map((stu) => (
              <div key={stu.id} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-emerald-100 transition-all shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xs uppercase">{stu.name.charAt(0)}</div>
                  <div>
                    <h4 className="font-bold text-slate-800 leading-tight">{stu.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stu.roll}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(stu)} className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit3 size={18}/></button>
                  <button onClick={() => onUpdateStudents(students.filter(s => s.id !== stu.id))} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStudentPage;