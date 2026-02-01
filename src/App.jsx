import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage'; 
import DepartmentListPage from './components/DepartmentListPage';
import SectionListPage from './components/SectionListPage'; 
import ClassListPage from './components/ClassListPage';
import StudentListPage from './components/StudentListPage';
import AdminSubjectPage from './components/admin/AdminSubjectPage';
import AdminStudentPage from './components/admin/AdminStudentPage'; 
import { LogOut, RefreshCcw, Users, BookOpen, ArrowLeft } from 'lucide-react';

// Firebase Imports
import { db } from './firebaseConfig';
import { doc, setDoc, getDoc } from "firebase/firestore";

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [userRole, setUserRole] = useState(null); 
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState({ year: 1, section: 'A' });
  const [selectedClass, setSelectedClass] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [globalSubjects, setGlobalSubjects] = useState([]);
  const [globalStudents, setGlobalStudents] = useState([]); 

  // --- FETCH ALL CLOUD DATA ---
  useEffect(() => {
    const fetchCloudData = async () => {
      if (currentPage === 'login' || !selectedDept) return;
      
      setIsLoading(true);
      const deptName = selectedDept?.name || selectedDept;
      const sectionId = `${deptName}_${selectedConfig.year}_${selectedConfig.section}`.replace(/\s+/g, '_');
      
      try {
        // Fetch Subjects
        const subSnap = await getDoc(doc(db, "configurations", sectionId));
        if (subSnap.exists()) setGlobalSubjects(subSnap.data().subjects || []);
        else setGlobalSubjects([]);

        // Fetch Students
        const stuSnap = await getDoc(doc(db, "students_list", sectionId));
        if (stuSnap.exists()) setGlobalStudents(stuSnap.data().students || []);
        else setGlobalStudents([]);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCloudData();
  }, [selectedDept, selectedConfig, currentPage]);

  const handleLogin = (role) => {
    setUserRole(role); 
    setCurrentPage('deptList'); 
  };

  const handleLogout = () => {
    setCurrentPage('login');
    setUserRole(null);
    setSelectedDept(null);
    setSelectedClass(null);
    setGlobalSubjects([]);
    setGlobalStudents([]);
  };

  // --- ADMIN LOGIC: SYNC DATA TO CLOUD ---
  const handleUpdateSubjects = async (updatedList) => {
    const deptName = selectedDept?.name || selectedDept;
    const sectionId = `${deptName}_${selectedConfig.year}_${selectedConfig.section}`.replace(/\s+/g, '_');
    try {
      await setDoc(doc(db, "configurations", sectionId), { subjects: updatedList }, { merge: true });
      setGlobalSubjects(updatedList);
    } catch (e) { alert("Error saving subjects"); }
  };

  const handleUpdateStudents = async (updatedList) => {
    const deptName = selectedDept?.name || selectedDept;
    const sectionId = `${deptName}_${selectedConfig.year}_${selectedConfig.section}`.replace(/\s+/g, '_');
    try {
      await setDoc(doc(db, "students_list", sectionId), { students: updatedList }, { merge: true });
      setGlobalStudents(updatedList);
    } catch (e) { alert("Error saving students"); }
  };

  return (
    <div className="App min-h-screen bg-slate-50 font-sans relative">
      
      {/* FIXED: Logout & Loader UI changed to absolute to prevent scroll interference */}
      {currentPage !== 'login' && (
        <div className="absolute top-8 right-8 z-[100] flex gap-2">
          {isLoading && (
            <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-slate-100 text-indigo-600">
              <RefreshCcw size={18} className="animate-spin" />
            </div>
          )}
          <button 
            onClick={handleLogout} 
            className="bg-white border border-slate-200 text-slate-500 hover:text-rose-600 px-5 py-2.5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 font-bold text-xs"
          >
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </div>
      )}

      {/* Main Content Area with conditional top padding */}
      <div className={currentPage !== 'login' ? 'pt-10' : ''}>
        {/* 1. LOGIN */}
        {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
        
        {/* 2. DEPARTMENT LIST */}
        {currentPage === 'deptList' && (
          <DepartmentListPage onSelectDept={(dept) => { setSelectedDept(dept); setCurrentPage('sectionList'); }} />
        )}

        {/* 3. SECTION LIST */}
        {currentPage === 'sectionList' && (
          <SectionListPage 
            selectedDept={selectedDept}
            onSelectSection={(config) => {
              setSelectedConfig(config);
              userRole === 'admin' ? setCurrentPage('adminChoice') : setCurrentPage('classList');
            }}
            onBack={() => setCurrentPage('deptList')}
          />
        )}

        {/* 4. ADMIN CHOICE SCREEN */}
        {currentPage === 'adminChoice' && (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FBFBFB]">
             <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                <div onClick={() => setCurrentPage('adminSubjectList')} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-200 cursor-pointer transition-all flex flex-col items-center text-center group">
                  <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all"><BookOpen size={40}/></div>
                  <h3 className="text-2xl font-black mb-2">Subject Management</h3>
                  <p className="text-slate-400 font-bold text-sm">Assign codes, names, and staff members.</p>
                </div>
                
                <div onClick={() => setCurrentPage('adminStudentList')} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 cursor-pointer transition-all flex flex-col items-center text-center group">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all"><Users size={40}/></div>
                  <h3 className="text-2xl font-black mb-2">Student Enrollment</h3>
                  <p className="text-slate-400 font-bold text-sm">Add/Edit student names and roll numbers.</p>
                </div>

                <button onClick={() => setCurrentPage('sectionList')} className="md:col-span-2 text-slate-400 font-bold hover:text-indigo-600 flex items-center justify-center gap-2 mt-4 transition-colors">
                  <ArrowLeft size={18}/> Back to Section Selection
                </button>
             </div>
          </div>
        )}

        {currentPage === 'adminSubjectList' && (
          <AdminSubjectPage 
            selectedDept={selectedDept} selectedYear={selectedConfig.year} selectedSection={selectedConfig.section}
            subjects={globalSubjects}
            onAddSubject={(s) => handleUpdateSubjects([...globalSubjects, s])}
            onEditSubject={(s) => handleUpdateSubjects(globalSubjects.map(item => item.id === s.id ? s : item))}
            onDeleteSubject={(id) => handleUpdateSubjects(globalSubjects.filter(s => s.id !== id))}
            onBack={() => setCurrentPage('adminChoice')}
          />
        )}

        {currentPage === 'adminStudentList' && (
          <AdminStudentPage 
            selectedDept={selectedDept} selectedYear={selectedConfig.year} selectedSection={selectedConfig.section}
            students={globalStudents}
            onUpdateStudents={handleUpdateStudents}
            onBack={() => setCurrentPage('adminChoice')}
          />
        )}

        {currentPage === 'classList' && (
          <ClassListPage 
            selectedDept={selectedDept} selectedConfig={selectedConfig} subjects={globalSubjects}
            onSelectClass={(cls) => { setSelectedClass(cls); setCurrentPage('studentList'); }}
            onBack={() => setCurrentPage('sectionList')}
          />
        )}

        {currentPage === 'studentList' && (
          <StudentListPage 
            selectedClass={selectedClass} 
            adminStudents={globalStudents} 
            onBack={() => setCurrentPage('classList')}
          />
        )}
      </div>
    </div>
  );
}

export default App;