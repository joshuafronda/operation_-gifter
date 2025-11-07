import React, { useState } from 'react';
import { Group } from '../types';
import { GroupIcon } from './icons/GroupIcon';
import { LinkIcon } from './icons/LinkIcon';
import { DrawIcon } from './icons/DrawIcon';
import { UserIcon } from './icons/UserIcon';

interface AdminDashboardProps {
  groups: Group[];
  onCreateGroup: (name: string) => void;
  onOperateDraw: (groupId: string) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ groups, onCreateGroup, onOperateDraw, onLogout }) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [copiedGroupId, setCopiedGroupId] = useState<string | null>(null);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      onCreateGroup(newGroupName.trim());
      setNewGroupName('');
    }
  };

  const copyToClipboard = (text: string, groupId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedGroupId(groupId);
    setTimeout(() => setCopiedGroupId(null), 2000);
  };

  return (
    <div className="min-h-screen w-full">
      <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">Mission Control</h1>
              <button onClick={onLogout} className="bg-slate-700 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition">
                Logout
              </button>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-slate-800/50 rounded-2xl shadow-lg backdrop-blur-lg border border-slate-700 p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-300 flex items-center"><GroupIcon className="mr-3 w-7 h-7"/>Launch New Mission</h2>
          <form onSubmit={handleCreateGroup} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter Mission Codename, e.g., 'Operation Noel'"
              className="flex-grow px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
            />
            <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 px-6 rounded-lg transition transform hover:scale-105">
              Launch Mission
            </button>
          </form>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold mb-6 text-slate-300 font-orbitron">Active Missions</h2>
          {groups.length === 0 ? (
             <div className="text-center py-16 px-6 bg-slate-800/40 rounded-2xl border-2 border-dashed border-slate-700">
                <GroupIcon className="mx-auto w-12 h-12 text-slate-500" />
                <h3 className="mt-4 text-xl font-semibold text-white">No Active Missions</h3>
                <p className="mt-1 text-slate-400">Launch a new mission above to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {groups.map(group => (
                <div key={group.id} className="bg-slate-800 rounded-xl shadow-md overflow-hidden border border-slate-700 transition-all hover:shadow-cyan-500/10 hover:border-cyan-500/50 flex flex-col">
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <h3 className="text-2xl font-bold text-cyan-400 font-orbitron">{group.name}</h3>
                            <p className="text-sm text-slate-500 mb-4">Mission ID: {group.id}</p>
                        </div>
                        <button
                            onClick={() => copyToClipboard(group.name, group.id)}
                            className="flex-shrink-0 flex items-center text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-3 rounded-lg transition"
                            title="Copy mission codename to share"
                        >
                            <LinkIcon className="w-4 h-4 mr-2"/> {copiedGroupId === group.id ? 'Copied!' : 'Copy Code'}
                        </button>
                    </div>
                    
                    <div className="mb-4">
                        <h4 className="font-semibold text-slate-300 mb-2 flex items-center"><UserIcon className="w-5 h-5 mr-2" />Agents ({group.participants.length})</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 rounded-lg bg-slate-900/40 p-3 border border-slate-700">
                          {group.participants.length > 0 ? group.participants.map(p => (
                            <div key={p.id} className="text-slate-300 bg-slate-700/50 px-3 py-2 rounded-md flex justify-between items-center text-sm">
                              <span className="truncate">{p.name}</span>
                              {group.drawCompleted && <span className="text-xs text-cyan-300 text-right pl-2"> &rarr; {group.participants.find(r => r.id === p.assignedTo)?.name || '...'}</span>}
                            </div>
                          )) : <p className="text-slate-500 text-sm text-center py-4">No agents have joined yet.</p>}
                        </div>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-800/50 mt-auto">
                    {group.drawCompleted ? (
                         <div className="text-center p-3 rounded-lg bg-green-500/20 text-green-300 border border-green-500/30 font-semibold">
                            Draw Complete! Targets Assigned.
                        </div>
                    ) : (
                        <>
                            <button
                              onClick={() => onOperateDraw(group.id)}
                              disabled={group.participants.length < 2}
                              className="w-full flex items-center justify-center bg-cyan-500 text-slate-900 font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed disabled:transform-none"
                            >
                              <DrawIcon className="mr-2"/> Initiate The Draw
                            </button>
                            {group.participants.length < 2 && <p className="text-xs text-center mt-2 text-yellow-400">Need at least 2 agents to initiate the draw.</p>}
                        </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;