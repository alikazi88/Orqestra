import React, { useEffect } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { Dashboard } from './features/dashboard/Dashboard';
import { Login } from './features/auth/Login';
import { SignUp } from './features/auth/SignUp';
import { WorkspaceSelector } from './features/auth/WorkspaceSelector';
import { OnboardingFlow } from './features/onboarding/OnboardingFlow';
import { VenueDiscovery } from './features/venues/VenueDiscovery';
import { VendorMarketplace } from './features/vendors/VendorMarketplace';
import { EventsList } from './features/events/EventsList';
import { EventDetail } from './features/events/EventDetail';
import { Landing } from './features/auth/Landing';
import { PublicEventPage } from './features/ticketing/PublicEventPage';
import { useAuthStore } from './stores/useAuthStore';
import { Routes, Route, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, loading, setUser, workspace, setWorkspace, signOut } = useAuthStore();
  const location = useLocation();

  const [view, setView] = React.useState<'landing' | 'login' | 'signup'>('landing');
  const [isOnboarding, setIsOnboarding] = React.useState(false);
  const [currentView, setCurrentView] = React.useState<'dashboard' | 'venues' | 'vendors' | 'events' | 'event-detail'>('dashboard');
  const [selectedEventId, setSelectedEventId] = React.useState<string | null>(null);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUserWorkspace(session.user.id);
      } else {
        useAuthStore.setState({ loading: false });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        setWorkspace(null);
        setIsOnboarding(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setWorkspace]);

  const checkUserWorkspace = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('workspace_id, workspaces(*)')
      .eq('id', userId)
      .single();

    if (!error && data?.workspaces) {
      setWorkspace(data.workspaces);
      // Check if onboarding is needed (very simple check for this demo)
      const needsOnboarding = !data.workspaces.brand_profile || Object.keys(data.workspaces.brand_profile).length === 0;
      setIsOnboarding(needsOnboarding);
    }
    useAuthStore.setState({ loading: false });
  };


  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    if (view === 'landing') {
      return <Landing
        onGetStarted={() => setView('signup')}
        onSignIn={() => setView('login')}
      />;
    }

    return view === 'login' ? (
      <Login onSwitch={() => setView('signup')} />
    ) : (
      <SignUp onSwitch={() => setView('login')} />
    );
  }

  if (!workspace) {
    return <WorkspaceSelector onSelect={(ws) => {
      setWorkspace(ws);
      const needsOnboarding = !ws.brand_profile || Object.keys(ws.brand_profile).length === 0;
      setIsOnboarding(needsOnboarding);
    }} />;
  }

  if (isOnboarding) {
    return <OnboardingFlow onComplete={() => setIsOnboarding(false)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'venues':
        return <VenueDiscovery />;
      case 'vendors':
        return <VendorMarketplace />;
      case 'events':
        return <EventsList
          onSelectEvent={(id) => {
            setSelectedEventId(id);
            setCurrentView('event-detail');
          }}
          onCreateNew={() => { }} // TODO: Handle new event creation
        />;
      case 'event-detail':
        return selectedEventId ? (
          <EventDetail
            eventId={selectedEventId}
            onBack={() => setCurrentView('events')}
          />
        ) : <EventsList onSelectEvent={setSelectedEventId} onCreateNew={() => { }} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Routes>
      <Route path="/e/:slug" element={<PublicEventPage />} />
      <Route path="*" element={
        !user ? (
          view === 'landing' ? (
            <Landing
              onGetStarted={() => setView('signup')}
              onSignIn={() => setView('login')}
            />
          ) : view === 'login' ? (
            <Login onSwitch={() => setView('signup')} />
          ) : (
            <SignUp onSwitch={() => setView('login')} />
          )
        ) : !workspace ? (
          <WorkspaceSelector onSelect={(ws) => {
            setWorkspace(ws);
            const needsOnboarding = !ws.brand_profile || Object.keys(ws.brand_profile).length === 0;
            setIsOnboarding(needsOnboarding);
          }} />
        ) : isOnboarding ? (
          <OnboardingFlow onComplete={() => setIsOnboarding(false)} />
        ) : (
          <DashboardLayout
            onSignOut={signOut}
            currentView={currentView}
            onViewChange={setCurrentView}
          >
            {renderView()}
          </DashboardLayout>
        )
      } />
    </Routes>
  );
}

export default App;
