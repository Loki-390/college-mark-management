import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Users, TrendingUp, Search, Download, FileText, Table as TableIcon, CheckCircle2, Cloud, RefreshCcw, GraduationCap, BookOpen, ChevronDown, BarChart3 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Firebase Imports
import { db } from '../firebaseConfig'; 
import { doc, setDoc, getDoc } from "firebase/firestore";

const StudentListPage = ({ selectedClass, onBack, adminStudents }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [submittedAverage, setSubmittedAverage] = useState("0.00");
  const [students, setStudents] = useState([]);
  const [examStats, setExamStats] = useState({
    int1: { avg: '0', pass: 0, fail: 0 },
    int2: { avg: '0', pass: 0, fail: 0 },
    ict1: { avg: '0', pass: 0, fail: 0 },
    ict2: { avg: '0', pass: 0, fail: 0 },
    model: { avg: '0', pass: 0, fail: 0 }
  });
  const inputRefs = useRef([]);

  // --- DATA EXTRACTION ---
  const deptName = selectedClass?.dept || "Department";
  const year = selectedClass?.year || "1";
  const section = selectedClass?.section || "A";
  const className = `Year ${year} - Sec ${section}`;
  const subjectName = selectedClass?.name || selectedClass?.subject || "Subject";
  const subjectCode = selectedClass?.id || "Unknown";

  const marksDocId = `${deptName}_${year}_${section}_${subjectCode}`.replace(/\s+/g, '_');
  const studentListDocId = `${deptName}_${year}_${section}`.replace(/\s+/g, '_');

  const getMarkTextColor = (val, max) => {
    if (val === '' || val === null) return 'text-slate-700';
    return Number(val) < (max / 2) ? 'text-red-600 font-bold' : 'text-slate-700';
  };

  const calculateStats = (studentMarks) => {
    const convert = (val) => (val !== '' ? Number(((val / 60) * 100).toFixed(0)) : null);
    const int1_100 = convert(studentMarks[0]);
    const int2_100 = convert(studentMarks[1]);
    const allAssessments = [
        int1_100, 
        int2_100, 
        studentMarks[2] !== '' ? Number(studentMarks[2]) : null, 
        studentMarks[3] !== '' ? Number(studentMarks[3]) : null, 
        studentMarks[4] !== '' ? Number(studentMarks[4]) : null  
    ];
    const validMarks = allAssessments.filter(m => m !== null);
    const totalScore = validMarks.reduce((a, b) => a + b, 0);
    const averageScore = validMarks.length > 0 ? (totalScore / validMarks.length).toFixed(1) : "0.0";
    return { 
      int1_100: int1_100 !== null ? int1_100 : '-', 
      int2_100: int2_100 !== null ? int2_100 : '-', 
      total: totalScore, 
      average: averageScore 
    };
  };

  // --- LOGIC: CALCULATE PASS/FAIL COUNTS PER EXAM ---
  const calculateAllStats = (studentList) => {
    const keys = ['int1', 'int2', 'ict1', 'ict2', 'model'];
    const maxMarks = [60, 60, 100, 100, 100];
    const tempStats = {
      int1: { sum: 0, count: 0, pass: 0, fail: 0 },
      int2: { sum: 0, count: 0, pass: 0, fail: 0 },
      ict1: { sum: 0, count: 0, pass: 0, fail: 0 },
      ict2: { sum: 0, count: 0, pass: 0, fail: 0 },
      model: { sum: 0, count: 0, pass: 0, fail: 0 }
    };

    studentList.forEach(s => {
      s.marks.slice(0, 5).forEach((m, i) => {
        if (m !== '' && m !== null) {
          const val = Number(m);
          const key = keys[i];
          const passMark = maxMarks[i] / 2;

          tempStats[key].sum += val;
          tempStats[key].count += 1;
          if (val >= passMark) tempStats[key].pass += 1;
          else tempStats[key].fail += 1;
        }
      });
    });

    const finalStats = {};
    keys.forEach(k => {
      finalStats[k] = {
        avg: tempStats[k].count > 0 ? (tempStats[k].sum / tempStats[k].count).toFixed(1) : '0',
        pass: tempStats[k].pass,
        fail: tempStats[k].fail
      };
    });

    setExamStats(finalStats);
    setSubmittedAverage(getClassAverage(studentList));
  };

  const getRankedAndFilteredStudents = () => {
    return students.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.roll.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getClassAverage = (currentStudents) => {
    const allAverages = currentStudents.map(s => Number(calculateStats(s.marks).average));
    const activeAverages = allAverages.filter(avg => avg > 0);
    return activeAverages.length > 0 ? (activeAverages.reduce((a, b) => a + b, 0) / activeAverages.length).toFixed(2) : "0.00";
  };

  useEffect(() => {
    const syncStudentData = async () => {
      try {
        const listSnap = await getDoc(doc(db, "students_list", studentListDocId));
        const masterList = listSnap.exists() ? listSnap.data().students : [];
        const marksSnap = await getDoc(doc(db, "marks", marksDocId));
        
        let finalData = [];
        if (marksSnap.exists()) {
          const savedMarkData = marksSnap.data().studentData;
          finalData = masterList.map(masterStu => {
            const existingEntry = savedMarkData.find(s => s.roll === masterStu.roll);
            return existingEntry ? existingEntry : { ...masterStu, marks: Array(7).fill('') };
          });
        } else {
          finalData = masterList.map(s => ({ ...s, marks: Array(7).fill('') }));
        }

        setStudents(finalData);
        calculateAllStats(finalData);
      } catch (error) { console.error("Sync error:", error); }
    };
    syncStudentData();
  }, [marksDocId, studentListDocId]);

  const handleCloudSave = async () => {
    if (!isOnline) return alert("No Internet Connection!");
    setIsSaving(true);
    calculateAllStats(students);
    
    try {
      await setDoc(doc(db, "marks", marksDocId), { 
        studentData: students, 
        subject: subjectName,
        subjectCode: subjectCode,
        lastUpdated: new Date().toISOString()
      }, { merge: true }); 
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (e) { alert("Save Error."); } 
    finally { setIsSaving(false); }
  };

  const handleMarkChange = (studentId, markIndex, value) => {
    const val = value === '' ? '' : Number(value);
    const maxLimit = (markIndex === 0 || markIndex === 1) ? 60 : 100;
    if (val === '' || val <= maxLimit) {
      const updated = students.map(s => s.id === studentId ? { ...s, marks: s.marks.map((m, i) => i === markIndex ? val : m) } : s);
      setStudents(updated);
      calculateAllStats(updated);
    }
  };

  const handleKeyDown = (e, sIdx, mIdx) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextIdx = sIdx + 1;
      if (inputRefs.current[nextIdx]?.[mIdx]) inputRefs.current[nextIdx][mIdx].focus();
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('landscape');
    const data = getRankedAndFilteredStudents();
    doc.setFontSize(18);
    doc.text(`${subjectName} (${subjectCode})`, 14, 15);
    doc.setFontSize(10);
    doc.text(`${deptName} - ${className}`, 14, 22);
    const rows = data.map(s => {
      const stats = calculateStats(s.marks);
      return [s.roll, s.name, s.marks[0] || '-', stats.int1_100, s.marks[1] || '-', stats.int2_100, s.marks[2] || '-', s.marks[3] || '-', s.marks[4] || '-', stats.total, stats.average];
    });
    autoTable(doc, {
      startY: 30,
      head: [['Roll', 'Name', 'I1(60)', 'I1(100)', 'I2(60)', 'I2(100)', 'ICT1', 'ICT2', 'Model', 'Total', 'Avg']],
      body: rows,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] },
      didParseCell: function (data) {
        if (data.section === 'body') {
          const val = parseFloat(data.cell.raw);
          const colIndex = data.column.index;
          const isInternal60 = (colIndex === 2 || colIndex === 4);
          const isStandard100 = (colIndex >= 3 && colIndex <= 8) || colIndex === 10;
          if ((isInternal60 && val < 30) || (isStandard100 && val < 50)) {
            data.cell.styles.textColor = [220, 38, 38]; 
            data.cell.styles.fontStyle = 'bold';
          }
        }
      }
    });
    doc.save(`${subjectCode}_Report.pdf`);
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const data = students.map(s => ({ 
      Roll: s.roll, 
      Name: s.name, 
      Total: calculateStats(s.marks).total, 
      Avg: calculateStats(s.marks).average 
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Marks");
    XLSX.writeFile(wb, `${subjectCode}_Marks.xlsx`);
    setShowExportMenu(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-4 sm:p-8 font-sans text-slate-900">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="text-emerald-400" size={20} />
          <span className="text-sm font-bold">Marks & Averages Updated!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <button onClick={onBack} className="flex self-start items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors">
            <ArrowLeft size={18} /> Back
          </button>
          
          <div className="flex w-full sm:w-auto gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)} 
                className="bg-white border-2 border-slate-200 px-5 py-3 rounded-xl font-bold flex items-center gap-2 text-xs hover:bg-slate-50 transition-all shadow-sm"
              >
                <Download size={16} className="text-indigo-600" /> Export <ChevronDown size={14} />
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-[999] py-1 overflow-hidden">
                  <button onClick={handleExportPDF} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                    <FileText size={16} className="text-red-500" /> Export as PDF
                  </button>
                  <button onClick={handleExportExcel} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                    <TableIcon size={16} className="text-emerald-500" /> Export as Excel
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={handleCloudSave}
              disabled={isSaving}
              className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all flex items-center justify-center gap-3 ${isSaving ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-indigo-600 active:scale-95'}`}
            >
              {isSaving ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
              {isSaving ? 'Saving...' : 'Submit Marks'}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm mb-8 flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shrink-0">
            <BookOpen size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{subjectName}</h2>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-black text-slate-500 border border-slate-200 uppercase">{subjectCode}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
              <GraduationCap size={14} className="text-indigo-400"/>
              <span>{deptName} • {className}</span>
            </div>
          </div>
        </div>

        {/* --- EXAM WISE STATS (AVG, PASS, FAIL) --- */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-4 min-w-[950px] pb-2">
            {[
              { label: 'Int 1 Avg', key: 'int1', max: 60, color: 'text-indigo-600' },
              { label: 'Int 2 Avg', key: 'int2', max: 60, color: 'text-indigo-600' },
              { label: 'ICT 1 Avg', key: 'ict1', max: 100, color: 'text-emerald-600' },
              { label: 'ICT 2 Avg', key: 'ict2', max: 100, color: 'text-emerald-600' },
              { label: 'Model Avg', key: 'model', max: 100, color: 'text-rose-600' }
            ].map((exam, i) => (
              <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex-1 min-w-[170px] flex flex-col gap-1">
                <p className="text-slate-400 font-black text-[9px] uppercase tracking-widest">{exam.label}</p>
                <h4 className={`text-lg font-black ${exam.color}`}>{examStats[exam.key].avg}<span className="text-[10px] opacity-40">/{exam.max}</span></h4>
                <div className="mt-2 text-[10px] font-bold text-slate-600 space-y-0.5">
                    <p>No. of Students Pass: {examStats[exam.key].pass}</p>
                    <p>No. of Students Fail: {examStats[exam.key].fail}</p>
                </div>
              </div>
            ))}
            <div className="bg-slate-900 p-5 rounded-[2rem] shadow-lg flex-1 min-w-[180px] flex flex-col justify-center border-b-4 border-b-emerald-500">
              <p className="text-slate-400 font-black text-[9px] uppercase tracking-widest mb-1">Class Total Avg</p>
              <h4 className="text-2xl font-black text-white">{submittedAverage}%</h4>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
           <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0"><Users size={24} /></div>
            <div><p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Strength</p><h4 className="text-xl font-black">{students.length} Students</h4></div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text" placeholder="Search roll no or name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full h-full bg-white border border-slate-100 rounded-2xl pl-12 pr-4 py-5 text-sm font-semibold outline-none focus:border-indigo-600 transition-all shadow-sm" 
            />
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto relative">
            <table className="w-full text-left min-w-[1000px] border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">
                  <th rowSpan="2" className="sticky left-0 z-20 bg-slate-50 px-5 py-4 border-r border-slate-100 min-w-[140px] text-left text-slate-900">Student Info</th>
                  <th colSpan="2" className="px-1 py-3 text-indigo-600 border-r border-slate-100">Int 1</th>
                  <th colSpan="2" className="px-1 py-3 text-indigo-600 border-r border-slate-100">Int 2</th>
                  <th rowSpan="2" className="px-1 py-4 border-r border-slate-100">ICT 1</th>
                  <th rowSpan="2" className="px-1 py-4 border-r border-slate-100">ICT 2</th>
                  <th rowSpan="2" className="px-1 py-4 border-r border-slate-100">Model</th>
                  <th rowSpan="2" className="px-3 py-4 text-slate-900 bg-slate-100/50">Total</th>
                  <th rowSpan="2" className="px-3 py-4 text-slate-900 bg-slate-100/30">Avg</th>
                </tr>
                <tr className="bg-slate-50 border-b border-slate-100 text-[8px] font-bold text-slate-400 uppercase text-center">
                  <th className="px-1 py-2 border-r border-slate-100">60</th><th className="px-1 py-2 border-r border-slate-100 text-indigo-400">100</th>
                  <th className="px-1 py-2 border-r border-slate-100">60</th><th className="px-1 py-2 border-r border-slate-100 text-indigo-400">100</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {getRankedAndFilteredStudents().map((s, sIdx) => {
                  const stats = calculateStats(s.marks);
                  return (
                    <tr key={s.id} className="group hover:bg-indigo-50/20 transition-all">
                      <td className="sticky left-0 z-10 bg-white group-hover:bg-[#F9FAFF] px-5 py-4 border-r border-slate-50">
                        <p className="font-bold text-slate-700 text-xs mb-0.5">{s.name}</p>
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{s.roll}</p>
                      </td>
                      {[0, 1, 2, 3, 4].map((mIdx) => {
                        const isInternalCol = mIdx < 2;
                        const maxVal = (mIdx === 0 || mIdx === 1) ? 60 : 100;
                        return (
                          <React.Fragment key={mIdx}>
                            <td className="px-1 py-4 border-r border-slate-50 text-center">
                              <input 
                                type="number" value={s.marks[mIdx]} 
                                ref={el => { if (!inputRefs.current[sIdx]) inputRefs.current[sIdx] = []; inputRefs.current[sIdx][mIdx] = el; }}
                                onKeyDown={(e) => handleKeyDown(e, sIdx, mIdx)}
                                onChange={(e) => handleMarkChange(s.id, mIdx, e.target.value)} 
                                className={`w-10 h-10 mx-auto block bg-white border-2 border-slate-400 focus:border-indigo-600 rounded-lg text-center font-bold text-[11px] outline-none transition-all shadow-sm ${getMarkTextColor(s.marks[mIdx], maxVal)}`} 
                              />
                            </td>
                            {isInternalCol && (
                              <td className={`px-1 py-4 border-r border-slate-50 font-black text-center text-[11px] bg-slate-50/50 ${getMarkTextColor(mIdx === 0 ? stats.int1_100 : stats.int2_100, 100)}`}>
                                {mIdx === 0 ? stats.int1_100 : stats.int2_100}
                              </td>
                            )}
                          </React.Fragment>
                        );
                      })}
                      <td className="px-2 py-4 text-center bg-slate-100/20 font-black text-slate-900 text-xs">{stats.total}</td>
                      <td className="px-3 py-4 text-center font-black text-slate-900 text-xs bg-slate-100/30">{stats.average}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {getRankedAndFilteredStudents().length === 0 && (
          <div className="bg-white p-20 rounded-b-[2.5rem] text-center border-t border-slate-100">
             <p className="text-slate-400 font-bold">No students found in this section.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentListPage;