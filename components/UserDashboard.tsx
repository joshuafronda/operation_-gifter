import React, { useState, useMemo, useEffect } from 'react';
import { Group, Participant, CurrentUser } from '../types';
import { GiftIcon } from './icons/GiftIcon';
import { GroupIcon } from './icons/GroupIcon';
import { UserIcon } from './icons/UserIcon';
import { TargetIcon } from './icons/TargetIcon';


interface UserDashboardProps {
  currentUser: CurrentUser;
  groups: Group[];
  onJoinGroup: (groupName: string, participantName: string) => void;
  onUpdateWishlist: (groupId: string, participantId: string, wishlist: string) => void;
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ currentUser, groups, onJoinGroup, onUpdateWishlist, onLogout }) => {
  const [groupNameToJoin, setGroupNameToJoin] = useState('');
  const [error, setError] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  const userParticipantRecord = useMemo(() => {
    for (const group of groups) {
      const participant = group.participants.find(p => p.name === currentUser.name);
      if (participant) {
        return { group, participant };
      }
    }
    return null;
  }, [groups, currentUser.name]);

  const [wishlist, setWishlist] = useState(userParticipantRecord?.participant.wishlist || '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    if (userParticipantRecord) {
        setWishlist(userParticipantRecord.participant.wishlist);
    }
  }, [userParticipantRecord]);


  const handleJoinGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupNameToJoin.trim()) {
      setError('Please enter a mission codename.');
      return;
    }
    if (!groups.some(g => g.name.toLowerCase() === groupNameToJoin.trim().toLowerCase())) {
        setError('Mission not found. Check the codename and try again.');
        return;
    }
    setError('');
    onJoinGroup(groupNameToJoin.trim(), currentUser.name);
  };
  
  const handleUpdateWishlist = () => {
    if(userParticipantRecord) {
        setSaveStatus('saving');
        onUpdateWishlist(userParticipantRecord.group.id, userParticipantRecord.participant.id, wishlist);
        setTimeout(() => setSaveStatus('saved'), 500);
        setTimeout(() => setSaveStatus('idle'), 2500);
    }
  };

  const assignedPerson = useMemo(() => {
    if (userParticipantRecord && userParticipantRecord.participant.assignedTo) {
      return userParticipantRecord.group.participants.find(p => p.id === userParticipantRecord.participant.assignedTo);
    }
    return null;
  }, [userParticipantRecord]);
  
  const handleReveal = () => {
    setIsRevealing(true);
    setTimeout(() => {
        setIsRevealing(false);
        setIsRevealed(true);
    }, 2000);
  };


  return (
    <div className="min-h-screen w-full">
         <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                <h1 className="text-xl md:text-2xl font-bold text-pink-400 truncate">Agent: <span className="text-slate-200">{currentUser.name}</span></h1>
                <button onClick={onLogout} className="bg-slate-700 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition">
                    Go Off-Grid
                </button>
                </div>
            </div>
        </header>

        <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-slate-800/50 rounded-2xl shadow-lg backdrop-blur-lg border border-slate-700 p-6 md:p-8">
            {!userParticipantRecord ? (
                <div className="text-center">
                    <GroupIcon className="mx-auto w-12 h-12 text-slate-500"/>
                    <h2 className="text-2xl font-semibold my-4 text-pink-300 font-orbitron">Join a Mission</h2>
                    <form onSubmit={handleJoinGroup} className="max-w-lg mx-auto">
                        <p className="text-slate-400 mb-4">Enter the exact mission codename provided by Mission Control.</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            value={groupNameToJoin}
                            onChange={(e) => setGroupNameToJoin(e.target.value)}
                            placeholder="Mission Codename"
                            className="flex-grow px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                        />
                        <button type="submit" className="bg-pink-500 hover:bg-pink-400 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105">
                            Join Mission
                        </button>
                        </div>
                        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
                    </form>
                </div>
            ) : (
                <div>
                <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-slate-300 mb-6">Mission Briefing: <span className="text-cyan-400">{userParticipantRecord.group.name}</span></h2>
                
                <div className="mb-8 p-6 bg-slate-900/40 rounded-lg border border-slate-700">
                    <h3 className="text-xl font-semibold mb-3 text-pink-300 flex items-center"><GiftIcon className="mr-2"/>Your Wishlist (Intel)</h3>
                    <textarea
                    value={wishlist}
                    onChange={(e) => setWishlist(e.target.value)}
                    placeholder="Provide intel for your secret agent... e.g., favorite color, hobbies, gift ideas."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                    />
                    <button 
                        onClick={handleUpdateWishlist}
                        disabled={saveStatus !== 'idle'}
                        className="mt-3 bg-pink-500/80 hover:bg-pink-500 text-white font-bold py-2 px-5 rounded-lg transition disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                       {saveStatus === 'idle' && 'Save Intel'}
                       {saveStatus === 'saving' && 'Saving...'}
                       {saveStatus === 'saved' && 'Intel Saved!'}
                    </button>
                </div>

                <div className="p-6 bg-slate-900/40 rounded-lg border-2 border-dashed border-slate-700 text-center">
                    <h3 className="text-xl font-semibold text-pink-300 mb-2 flex items-center justify-center font-orbitron"><TargetIcon className="mr-3" />Your Assignment</h3>
                    
                    {!userParticipantRecord.group.drawCompleted && (
                        <div className="py-8">
                            <p className="text-slate-400 text-lg">Awaiting assignment from Mission Control...</p>
                             <div className="mt-4 h-2 w-full max-w-xs mx-auto bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-400 animate-pulse w-full"></div>
                            </div>
                        </div>
                    )}

                    {userParticipantRecord.group.drawCompleted && !isRevealed && !isRevealing && (
                        <div className="py-4">
                            <p className="text-slate-300 text-xl mb-4">Your target has been assigned.</p>
                            <button onClick={handleReveal} className="bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-8 rounded-lg transition-transform transform hover:scale-110 shadow-lg shadow-red-500/20 inline-flex items-center text-lg">
                                <TargetIcon className="mr-3"/>
                                REVEAL TARGET
                            </button>
                        </div>
                    )}

                    {isRevealing && (
                        <div className="py-8 font-mono text-2xl text-cyan-300 scramble-text"></div>
                    )}

                    {isRevealed && assignedPerson && (
                         <div className="text-left mt-4 animate-fade-in">
                            <div className="space-y-4 text-left p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                                <p className="text-slate-300 text-lg">Your target is:</p>
                                <p className="text-4xl font-bold text-center text-cyan-300 py-4 bg-slate-900/50 rounded-lg font-orbitron">{assignedPerson.name}</p>
                                <div>
                                    <p className="font-semibold text-slate-300 mb-2">Target's Wishlist (Intel):</p>
                                    <div className="p-4 bg-slate-800/60 rounded-md text-slate-300 whitespace-pre-wrap min-h-[6rem] border border-slate-600">
                                        {assignedPerson.wishlist || "No intel provided."}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                </div>
            )}
            </div>
        </main>
    </div>
  );
};

export default UserDashboard;