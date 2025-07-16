import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { WelcomeSection } from '@/components/WelcomeSection';

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  if (!showDashboard) {
    return <WelcomeSection onGetStarted={() => setShowDashboard(true)} />;
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default Index;
