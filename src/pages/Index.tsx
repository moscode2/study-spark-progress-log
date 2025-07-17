import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { WelcomeSection } from '@/components/WelcomeSection';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    if (user) {
      setShowDashboard(true);
    }
  }, [user]);

  const handleGetStarted = () => {
    if (user) {
      setShowDashboard(true);
    } else {
      navigate('/auth');
    }
  };

  if (!showDashboard && user) {
    return <WelcomeSection onGetStarted={handleGetStarted} />;
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default Index;
