import { Layout } from '@/components/Layout';
import { ProgressStats } from '@/components/ProgressStats';

const Progress = () => {
  const mockGoals = [
    {
      id: '1',
      title: 'Learn React',
      description: 'Master React fundamentals and hooks',
      progress: 75,
      targetDate: '2024-12-31',
      hoursPerWeek: 10,
      category: 'Programming',
      status: 'active' as const,
      streak: 7
    },
    {
      id: '2',
      title: 'Spanish Conversation',
      description: 'Improve conversational Spanish skills',
      progress: 45,
      targetDate: '2024-11-30',
      hoursPerWeek: 5,
      category: 'Language',
      status: 'active' as const,
      streak: 3
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Progress Overview</h1>
          <p className="text-muted-foreground">Track your learning progress and achievements</p>
        </div>
        <ProgressStats goals={mockGoals} />
      </div>
    </Layout>
  );
};

export default Progress;