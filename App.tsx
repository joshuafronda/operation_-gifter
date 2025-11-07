import React, { useState, useEffect } from 'react';
import { useAuth } from './src/hooks/useAuth';
import { useGroups } from './src/hooks/useGroups';
import { LoginPage } from './components/LoginPage';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import AdminSetup from './components/AdminSetup';
import { Participant } from './types';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>(window.location.pathname);
  
  // IMPORTANT: All hooks must be called before any conditional returns
  const { user, currentUser, loading: authLoading, loginAgent, loginAdmin, logout } = useAuth();
  const { groups, loading: groupsLoading, createGroup, addParticipant, updateParticipantWishlist, operateDraw } = useGroups();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Listen for navigation
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Show admin setup page if route is /setup or /admin-setup
  // This must come AFTER all hooks are called
  if (currentRoute === '/setup' || currentRoute === '/admin-setup') {
    return <AdminSetup />;
  }

  const handleLogin = async (name: string, role: 'USER' | 'ADMIN', adminEmail?: string, adminPassword?: string) => {
    try {
      setError('');
      if (role === 'USER') {
        await loginAgent(name.trim());
        return;
      } else {
        const email = adminEmail || import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com';
        const password = adminPassword || prompt('Enter admin password:');
        if (!password) return;
        await loginAdmin(email, password);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      console.error('Login error:', err);
    }
  };

  const handleCreateGroup = async (name: string) => {
    try {
      setError('');
      await createGroup(name);
    } catch (err: any) {
      setError(err.message || 'Failed to create group');
      console.error('Create group error:', err);
    }
  };

  const handleJoinGroup = async (groupName: string, participantName: string) => {
    try {
      setError('');
      const group = groups.find(g => g.name.toLowerCase() === groupName.toLowerCase());
      if (!group) {
        setError('Group not found');
        return;
      }

      if (group.drawCompleted) {
        setError('This mission draw has already been completed');
        return;
      }

      // Check if participant already exists
      const existingParticipant = group.participants.find(
        p => p.name.toLowerCase() === participantName.toLowerCase()
      );

      if (existingParticipant) {
        setError('You are already part of this mission');
        return;
      }

      // Create new participant
      const newParticipant: Participant = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: participantName,
        wishlist: ''
      };

      await addParticipant(group.id, newParticipant);
    } catch (err: any) {
      setError(err.message || 'Failed to join group');
      console.error('Join group error:', err);
    }
  };

  const handleUpdateWishlist = async (groupId: string, participantId: string, wishlist: string) => {
    try {
      setError('');
      await updateParticipantWishlist(groupId, participantId, wishlist);
    } catch (err: any) {
      setError(err.message || 'Failed to update wishlist');
      console.error('Update wishlist error:', err);
    }
  };

  const handleOperateDraw = async (groupId: string) => {
    try {
      setError('');
      await operateDraw(groupId);
    } catch (err: any) {
      setError(err.message || 'Failed to operate draw');
      console.error('Operate draw error:', err);
      alert(err.message || 'Failed to operate draw');
    }
  };

  // Remove loading state - go directly to content
  if (!user || !currentUser) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        {error && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {error}
          </div>
        )}
      </>
    );
  }

  const isAdmin = currentUser.role === 'ADMIN';

  return (
    <>
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md">
          {error}
        </div>
      )}
      {isAdmin ? (
        <AdminDashboard
          groups={groups}
          onCreateGroup={handleCreateGroup}
          onOperateDraw={handleOperateDraw}
          onLogout={logout}
        />
      ) : (
        <UserDashboard
          currentUser={currentUser}
          groups={groups}
          onJoinGroup={handleJoinGroup}
          onUpdateWishlist={handleUpdateWishlist}
          onLogout={logout}
        />
      )}
    </>
  );
};

export default App;