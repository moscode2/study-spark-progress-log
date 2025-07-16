import { useState } from 'react';
import { Calendar, Clock, Target, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

interface CreateGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateGoal: (goal: {
    title: string;
    description: string;
    targetDate: string;
    hoursPerWeek: number;
    category: string;
  }) => void;
}

const categories = [
  'Programming',
  'Design',
  'Marketing',
  'Data Science',
  'Business',
  'Language',
  'Music',
  'Art',
  'Science',
  'Other'
];

export const CreateGoalDialog = ({ open, onOpenChange, onCreateGoal }: CreateGoalDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !targetDate || !hoursPerWeek || !category) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      onCreateGoal({
        title,
        description,
        targetDate,
        hoursPerWeek: parseInt(hoursPerWeek),
        category
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setTargetDate('');
      setHoursPerWeek('');
      setCategory('');
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setTargetDate('');
    setHoursPerWeek('');
    setCategory('');
    onOpenChange(false);
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Create New Learning Goal
          </DialogTitle>
          <DialogDescription>
            Set up a new learning goal to track your progress and stay motivated.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Goal Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Learn React Development"
                className="mt-1"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you want to learn and why it's important to you..."
                className="mt-1 min-h-[100px]"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="hoursPerWeek" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Hours per Week
              </Label>
              <Input
                id="hoursPerWeek"
                type="number"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                placeholder="e.g., 5"
                min="1"
                max="40"
                className="mt-1"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="targetDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Target Completion Date
              </Label>
              <Input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={today}
                className="mt-1"
                required
              />
            </div>
          </div>

          {/* Preview Card */}
          {title && (
            <Card className="goal-card">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{title}</h3>
                  {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                  )}
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {category && <span>Category: {category}</span>}
                    {hoursPerWeek && <span>Time: {hoursPerWeek}h/week</span>}
                    {targetDate && <span>Due: {new Date(targetDate).toLocaleDateString()}</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !title || !description || !targetDate || !hoursPerWeek || !category}
              variant="gradient"
            >
              {isSubmitting ? 'Creating...' : 'Create Goal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};