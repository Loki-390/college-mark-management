import React, { useState } from 'react';
import { Lock, Mail, GraduationCap, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [role, setRole] = useState('faculty');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // PREDEFINED CREDENTIALS
  const credentials = {
    admin: { email: 'admin@college.edu', pass: '123' },
    faculty: { email: 'faculty@college.edu', pass: '123' }
  };

  const handleAuth = (e) => {
    e.preventDefault();
    setError('');

    const target = credentials[role];

    if (email === target.email && password === target.pass) {
      // SUCCESS: Passes 'admin' or 'faculty' to App.jsx
      onLogin(role);
    } else {
      setError(`Invalid ${role} credentials. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white flex-col lg:flex-row">
        
        <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 p-16 flex-col justify-between text-white relative">
          <div className="absolute -top-10 -right-10 opacity-10">
            <GraduationCap size={320} strokeWidth={1} />
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tight leading-tight"> Precision <br /> Analytics. </h1>
          </div>
          <p className="text-indigo-100 text-lg opacity-80"> Secure access for authorized staff and administrators. </p>
        </div>

        <div className="w-full lg:w-1/2 p-8 sm:p-20 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Sign In</h2>
            <p className="text-slate-500 mt-2 font-medium">Identify your role to continue.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button type="button" onClick={() => {setRole('faculty'); setError('');}} className={`flex flex-col items-center gap-2 p-5 rounded-3xl border-2 transition-all ${role === 'faculty' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-400'}`}>
              <GraduationCap size={24} /> <span className="font-bold text-sm">Faculty</span>
            </button>
            <button type="button" onClick={() => {setRole('admin'); setError('');}} className={`flex flex-col items-center gap-2 p-5 rounded-3xl border-2 transition-all ${role === 'admin' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-400'}`}>
              <ShieldCheck size={24} /> <span className="font-bold text-sm">Admin</span>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="group">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" size={18} />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-semibold" placeholder={role === 'admin' ? "admin@college.edu" : "faculty@college.edu"} />
              </div>
            </div>
            <div className="group">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" size={18} />
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-semibold" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white font-bold py-5 rounded-[1.25rem] shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 text-lg">
              Access Dashboard <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;