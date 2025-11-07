import React, { useState } from 'react';
import { Role } from '../types';
import { AdminIcon } from './icons/AdminIcon';
import { UserIcon } from './icons/UserIcon';
import { DrawIcon } from './icons/DrawIcon';

interface LoginPageProps {
  onLogin: (name: string, role: Role, adminEmail?: string, adminPassword?: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [role, setRole] = useState<Role>('USER');
  const [name, setName] = useState('');
  const [adminEmail, setAdminEmail] = useState(import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (role === 'USER' && !name.trim()) {
      setError('Please enter your agent codename.');
      return;
    }
    if (role === 'ADMIN' && !adminEmail.trim()) {
      setError('Please enter admin email.');
      return;
    }
    if (role === 'ADMIN' && !adminPassword.trim()) {
      setError('Please enter admin password.');
      return;
    }
    setError('');
    const loginName = role === 'ADMIN' ? 'Admin' : name;
    onLogin(loginName, role, adminEmail, adminPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-lg bg-slate-800/50 rounded-2xl shadow-2xl shadow-cyan-500/10 backdrop-blur-lg border border-slate-700 overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <DrawIcon className="w-16 h-16 text-cyan-400 mb-4" />
            <h1 className="text-4xl font-bold text-cyan-400">Operation: Gifter</h1>
            <p className="text-slate-400 mt-2">Accept your secret mission. Good luck, agent.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setRole('USER')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-300 ${role === 'USER' ? 'bg-pink-500/80 text-white ring-2 ring-pink-400' : 'bg-slate-700 hover:bg-slate-600'}`}
            >
              <UserIcon className="w-8 h-8 mb-2" />
              <span className="font-semibold">I'm an Agent</span>
            </button>
            <button
              onClick={() => setRole('ADMIN')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-300 ${role === 'ADMIN' ? 'bg-yellow-500/80 text-white ring-2 ring-yellow-400' : 'bg-slate-700 hover:bg-slate-600'}`}
            >
              <AdminIcon className="w-8 h-8 mb-2" />
              <span className="font-semibold">Mission Control</span>
            </button>
          </div>
          
          {role === 'USER' && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-slate-300 text-sm font-bold mb-2">Your Agent Codename</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Captain Cookie"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              />
            </div>
          )}

          {role === 'ADMIN' && (
            <>
              <div className="mb-4">
                <label htmlFor="adminEmail" className="block text-slate-300 text-sm font-bold mb-2">Admin Email</label>
                <input
                  id="adminEmail"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="adminPassword" className="block text-slate-300 text-sm font-bold mb-2">Admin Password</label>
                <input
                  id="adminPassword"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
              <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-xs mb-2">
                  <strong>Setup Required:</strong> Make sure Email/Password authentication is enabled in Firebase Console and an admin user is created.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    window.history.pushState({}, '', '/setup');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="text-yellow-400 hover:text-yellow-300 text-xs underline"
                >
                  Or create admin user here →
                </button>
              </div>
            </>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
          
          <button
            onClick={handleLogin}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-4 rounded-lg transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            {role === 'ADMIN' ? 'Access Mission Control' : 'Accept Mission!'}
          </button>
        </div>
      </div>
    </div>
  );
};