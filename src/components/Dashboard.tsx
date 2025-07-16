import { useState } from 'react';
import { Plus, Target, Clock, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LearningGoalCard } from './LearningGoalCard';
import { CreateGoalDialog } from './CreateGoalDialog';
import { ProgressStats } from './ProgressStats';

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  progress: number;
  targetDate: string;
  hoursPerWeek: number;
  category: string;
  status: 'active' | 'completed' | 'paused';
  streak: number;
}

const mockGoals: LearningGoal[] = [
  {
    id: '1',
    title: 'Master React Development',
    description: 'Learn React from basics to advanced concepts including hooks, context, and state management',
    progress: 65,
    targetDate: '2024-12-31',
    hoursPerWeek: 8,
    category: 'Programming',
    status: 'active',
    streak: 7
  },
  {
    id: '2',
    title: 'Digital Marketing Fundamentals',
    description: 'Understanding SEO, SEM, social media marketing, and content strategy',
    progress: 30,
    targetDate: '2024-11-15',
    hoursPerWeek: 5,
    category: 'Marketing',
    status: 'active',
    streak: 3
  },
  {
    id: '3',
    title: 'Data Science with Python',
    description: 'Learn Python, pandas, numpy, and machine learning basics',
    progress: 100,
    targetDate: '2024-08-30',
    hoursPerWeek: 6,
    category: 'Data Science',
    status: 'completed',
    streak: 14
  }
];

export const Dashboard = () => {
  const [goals, setGoals] = useState<LearningGoal[]>(mockGoals);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const totalHoursThisWeek = activeGoals.reduce((sum, goal) => sum + goal.hoursPerWeek, 0);
  const averageProgress = activeGoals.reduce((sum, goal) => sum + goal.progress, 0) / activeGoals.length;

  const handleCreateGoal = (newGoal: Omit<LearningGoal, 'id' | 'progress' | 'streak' | 'status'>) => {
    const goal: LearningGoal = {
      ...newGoal,
      id: Date.now().toString(),
      progress: 0,
      streak: 0,
      status: 'active'
    };
    setGoals([...goals, goal]);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateGoal = (id: string, updates: Partial<LearningGoal>) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                LearnLog Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Track your learning journey and achieve your goals
              </p>
            </div>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              variant="gradient"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              New Goal
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="goal-card animate-bounce-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeGoals.length}</div>
              <p className="text-xs text-muted-foreground">
                {completedGoals.length} completed
              </p>
            </CardContent>
          </Card>

          <Card className="goal-card animate-bounce-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHoursThisWeek}h</div>
              <p className="text-xs text-muted-foreground">
                planned study time
              </p>
            </CardContent>
          </Card>

          <Card className="goal-card animate-bounce-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(averageProgress)}%</div>
              <Progress value={averageProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="goal-card animate-bounce-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
              <Award className="h-4 w-4 text-streak" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.max(...goals.map(g => g.streak))}
              </div>
              <p className="text-xs text-muted-foreground">
                days in a row
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Stats */}
        <ProgressStats goals={goals} />

        {/* Learning Goals */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Target className="mr-2 h-6 w-6 text-primary" />
            Your Learning Goals
          </h2>
          
          {goals.length === 0 ? (
            <Card className="goal-card text-center py-12">
              <CardContent>
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="mb-2">No Learning Goals Yet</CardTitle>
                <CardDescription className="mb-4">
                  Create your first learning goal to start tracking your progress
                </CardDescription>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  variant="gradient"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal, index) => (
                <div 
                  key={goal.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <LearningGoalCard
                    goal={goal}
                    onUpdate={handleUpdateGoal}
                    onDelete={handleDeleteGoal}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Goal Dialog */}
        <CreateGoalDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreateGoal={handleCreateGoal}
        />
      </div>
    </div>
  );
};