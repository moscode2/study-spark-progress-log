import { useState } from 'react';
import { Calendar, Clock, MoreHorizontal, Edit2, Trash2, Play, Pause, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

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

interface LearningGoalCardProps {
  goal: LearningGoal;
  onUpdate: (id: string, updates: Partial<LearningGoal>) => void;
  onDelete: (id: string) => void;
}

export const LearningGoalCard = ({ goal, onUpdate, onDelete }: LearningGoalCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'paused':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  const getCardClassName = () => {
    return cn(
      'goal-card learning-card-hover transition-all duration-300',
      {
        'goal-card-completed': goal.status === 'completed',
        'goal-card-active': goal.status === 'active',
        'opacity-75': goal.status === 'paused',
        'glow-effect': isHovered && goal.status === 'active'
      }
    );
  };

  const handleStatusChange = (newStatus: 'active' | 'completed' | 'paused') => {
    onUpdate(goal.id, { status: newStatus });
  };

  const handleProgressUpdate = () => {
    // Simulate progress update for demo
    const newProgress = Math.min(goal.progress + 10, 100);
    const newStatus = newProgress === 100 ? 'completed' : goal.status;
    onUpdate(goal.id, { progress: newProgress, status: newStatus });
  };

  return (
    <Card 
      className={getCardClassName()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg font-semibold line-clamp-1">
                {goal.title}
              </CardTitle>
              {goal.status === 'completed' && (
                <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {goal.category}
              </Badge>
              <Badge className={cn('text-xs', getStatusColor(goal.status))}>
                {goal.status}
              </Badge>
              {goal.streak > 0 && (
                <Badge variant="outline" className="text-xs streak-badge">
                  🔥 {goal.streak} day streak
                </Badge>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStatusChange('active')}>
                <Play className="mr-2 h-4 w-4" />
                Resume
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('paused')}>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Complete
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(goal.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="text-sm line-clamp-2">
          {goal.description}
        </CardDescription>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-bold text-primary">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>

        {/* Goal Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Due:</span>
            <span className="font-medium">{formatDate(goal.targetDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{goal.hoursPerWeek}h/week</span>
          </div>
        </div>

        {/* Action Buttons */}
        {goal.status === 'active' && (
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleProgressUpdate}
              size="sm"
              variant="gradient"
              className="flex-1"
            >
              Log Progress
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};