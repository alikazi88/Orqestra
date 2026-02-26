import React, { useEffect } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { Dashboard } from './features/dashboard/Dashboard';
import { Login } from './features/auth/Login';
import { SignUp } from './features/auth/SignUp';
import { WorkspaceSelector } from './features/auth/WorkspaceSelector';
import { useAuthStore } from './stores/useAuthStore';
import { supabase } from './lib/supabase';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, loading, setUser, workspace, setWorkspace, signOut } = useAuthStore();
  const [view, setView] = React.useState<'login' | 'signup'>('login');

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      useAuthStore.setState({ loading: false });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        setWorkspace(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setWorkspace]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return view === 'login' ? (
      <div onClick={() => setView('signup')} className="cursor-pointer">
        <Login />
      </div>
    ) : (
      <div onClick={() => setView('login')} className="cursor-pointer">
        <SignUp />
      </div>
    );
  }

  if (!workspace) {
    return <WorkspaceSelector onSelect={(ws) => setWorkspace(ws)} />;
  }

  return (
    <DashboardLayout onSignOut={signOut}>
      <Dashboard />
    </DashboardLayout>
  );
}

export default App;
