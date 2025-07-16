import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Calendar, Clock, Target } from 'lucide-react';

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

interface ProgressStatsProps {
  goals: LearningGoal[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))', 'hsl(var(--accent))'];

export const ProgressStats = ({ goals }: ProgressStatsProps) => {
  // Mock weekly progress data
  const weeklyProgressData = [
    { week: 'Week 1', hours: 12, goals: 2 },
    { week: 'Week 2', hours: 18, goals: 3 },
    { week: 'Week 3', hours: 15, goals: 2 },
    { week: 'Week 4', hours: 22, goals: 4 },
    { week: 'Week 5', hours: 20, goals: 3 },
    { week: 'Week 6', hours: 25, goals: 4 },
  ];

  // Category distribution
  const categoryData = goals.reduce((acc, goal) => {
    acc[goal.category] = (acc[goal.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([category, count]) => ({
    name: category,
    value: count,
  }));

  // Recent activity mock data
  const recentActivities = [
    { date: '2024-01-15', activity: 'Completed React Hooks chapter', goal: 'Master React Development' },
    { date: '2024-01-14', activity: 'Studied for 2 hours', goal: 'Digital Marketing Fundamentals' },
    { date: '2024-01-13', activity: 'Finished Python basics', goal: 'Data Science with Python' },
    { date: '2024-01-12', activity: 'Practiced coding exercises', goal: 'Master React Development' },
  ];

  if (goals.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Weekly Progress Chart */}
      <Card className="goal-card animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Weekly Progress
          </CardTitle>
          <CardDescription>
            Your learning hours and active goals over the past 6 weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyProgressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="week" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar 
                dataKey="hours" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
                name="Hours studied"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card className="goal-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Learning Categories
          </CardTitle>
          <CardDescription>
            Distribution of your learning goals by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Goal Progress Overview */}
      <Card className="goal-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Goal Progress Overview
          </CardTitle>
          <CardDescription>
            Current progress on all your learning goals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-sm">{goal.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {goal.category}
                    </Badge>
                    <Badge 
                      className={`text-xs ${
                        goal.status === 'completed' ? 'bg-success' : 
                        goal.status === 'paused' ? 'bg-warning' : 'bg-primary'
                      }`}
                    >
                      {goal.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-primary">{goal.progress}%</div>
                  <div className="text-xs text-muted-foreground">
                    {goal.hoursPerWeek}h/week
                  </div>
                </div>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="goal-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Your latest learning activities and progress updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.activity}</p>
                  <p className="text-xs text-muted-foreground">{activity.goal}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};